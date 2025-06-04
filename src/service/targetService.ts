import { client } from ".";
import { Target, TargetStaff } from "../../dist/generated/client";
import { Pagination } from "../constants";
import { calculateWorkingHours, isDateValid, paginationQuery } from "../utils";

//** Get targets */
export const getTarget = async (req: { [key: string]: any }) => {
    const { query, params } = req;
    const { id } = params;

    const targetWhereClause = {
        ...(Object.keys(params).length > 0 && {
            ...(id && { id }),
        }),

        ...(Object.keys(query).length > 0 && {
            // Check if startDate and endDate are valid date
            ...(isDateValid(query.start_date) &&
                isDateValid(query.end_date) && {
                    target_at: {
                        gte: new Date(query.start_date),
                        lte: new Date(
                            new Date(query.end_date).setDate(
                                new Date(query.end_date).getDate(),
                            ),
                        ),
                    },
                }),
        }),
    };

    if (targetWhereClause.id) {
        //** Use Prisma client to get target */
        return await client.target
            .findUnique({
                where: {
                    id,
                },
                select: {
                    id: true,
                    name: true,
                    target_at: true,

                    target_shift: {
                        select: {
                            shift_id: true,
                            revenue: true,
                            cash: true,
                            transfer: true,
                            deduction: true,
                            description: true,

                            shift: {
                                select: {
                                    name: true,
                                },
                            },

                            target_staff: {
                                select: {
                                    staff_id: true,
                                    check_in: true,
                                    check_out: true,
                                    working_hours: true,
                                    target: true,

                                    staff: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            })
            .then(async res => {
                const newData = {
                    ...res,
                    target_shift: res?.target_shift.map((shift: any) => ({
                        ...shift,
                        shift: undefined,
                        target_name: shift.shift.name,

                        target_staff: shift.target_staff.map((staff: any) => ({
                            ...staff,
                            staff: undefined,
                            staff_name: staff.staff.name,
                        })),
                    })),
                };

                return {
                    code: 200,
                    message: "Get target successfully!",
                    data: newData,
                    pagination: {
                        page: Number(query.page || 1),
                        rowsPerPage: Number(query.limit || Pagination.limit),
                        total: await client.target.count({
                            where: {
                                ...targetWhereClause,
                            },
                        }),
                    },
                };
            });
    }

    return await client.target
        .findMany({
            ...paginationQuery(query),
            where: {
                ...targetWhereClause,
            },
            orderBy: [
                {
                    target_at: "desc",
                },
                {
                    created_at: "desc",
                },
            ],
        })
        .then(async res => {
            return {
                code: 200,
                message: "Get target successfully!",
                data: res,
                pagination: {
                    page: Number(query.page || 1),
                    rowsPerPage: Number(query.limit || Pagination.limit),
                    total: await client.target.count({
                        where: {
                            ...targetWhereClause,
                        },
                    }),
                },
            };
        })
        .catch(err => {
            return {
                code: 404,
                message: err.message,
                data: [],
                pagination: {},
            };
        });
};

//** Create target */
export const createTarget = async ({
    body,
}: {
    body: Target & {
        shifts: { [key: string]: any }[];
    };
}) => {
    return await client
        .$transaction(async tx => {
            const targetTotal = calcTargetTotal(body.shifts);

            //** Create target */
            const target = await tx.target.create({
                data: {
                    name: body.name,
                    target_at: new Date(body.target_at),
                    revenue: targetTotal.revenue,
                    cash: targetTotal.cash,
                    transfer: targetTotal.transfer,
                    deduction: targetTotal.deduction,
                },
            });

            await Promise.all(
                Object.entries(body.shifts).map(async ([shift_id, shift]) => {
                    // Create target shift
                    const newTargetShift = await tx.targetShift.create({
                        data: {
                            target_id: target.id,
                            shift_id,
                            revenue: shift.revenue,
                            cash: shift.cash,
                            transfer: shift.transfer,
                            deduction: shift.deduction,
                            description: shift.description ?? "",
                        },
                    });

                    if (!shift.staffs?.length) return;

                    // Create target staff
                    await Promise.all(
                        shift.staffs.map((staff: TargetStaff) =>
                            tx.targetStaff.create({
                                data: {
                                    target_shift_id: newTargetShift.id,
                                    staff_id: staff.staff_id,
                                    check_in: staff.check_in,
                                    check_out: staff.check_out,
                                    working_hours: calculateWorkingHours(
                                        staff.check_in,
                                        staff.check_out,
                                    ),
                                    target: Math.trunc(
                                        (shift.revenue || 0) /
                                            shift.staffs.length,
                                    ),
                                },
                            }),
                        ),
                    );
                }),
            );

            return target;
        })
        .then(res => {
            return {
                code: 200,
                message: "Add target successfully!",
                data: res,
            };
        })
        .catch(err => {
            if (err.code === "P2002") {
                return {
                    code: 400,
                    message: `Create failed because "${err?.meta?.target}" already exists!`,
                    data: [],
                };
            }
            return {
                code: 404,
                message: err.message,
                data: [],
            };
        });
};

//** Update target */
export const updateTarget = async ({
    id,
    body,
}: {
    id: string;
    body: Target & {
        shifts: {
            [key: string]: {
                revenue: number;
                cash: number;
                transfer: number;
                deduction: number;
                description?: string;
                staffs?: any[];
            };
        };
    };
}) => {
    return await client
        .$transaction(
            async tx => {
                const currentTarget = await tx.target.findUnique({
                    where: { id },
                    include: {
                        target_shift: {
                            include: {
                                target_staff: true,
                            },
                        },
                    },
                });

                if (!currentTarget) throw new Error("Target not found");

                const targetTotal = calcTargetTotal(body.shifts);
                const shiftChanged = hasShiftChanged(
                    currentTarget,
                    body.shifts,
                );

                const target = await tx.target.update({
                    where: { id },
                    data: {
                        name: body.name,
                        target_at: new Date(body.target_at),
                        revenue: targetTotal.revenue,
                        cash: targetTotal.cash,
                        transfer: targetTotal.transfer,
                        deduction: targetTotal.deduction,
                    },
                });

                if (!shiftChanged) return target;

                await tx.targetShift.deleteMany({
                    where: { target_id: id },
                });

                await Promise.all(
                    Object.entries(body.shifts).map(
                        async ([shift_id, shift]) => {
                            // Create target shift
                            const newTargetShift = await tx.targetShift.create({
                                data: {
                                    target_id: id,
                                    shift_id,
                                    revenue: shift.revenue,
                                    cash: shift.cash,
                                    transfer: shift.transfer,
                                    deduction: shift.deduction,
                                    description: shift.description ?? "",
                                },
                            });

                            const staffData = (shift.staffs || []).filter(
                                s => s.staff_id,
                            );
                            if (staffData.length === 0) return;

                            // Create target staff
                            await Promise.all(
                                staffData.map(staff => {
                                    return tx.targetStaff.create({
                                        data: {
                                            target_shift_id: newTargetShift.id,
                                            staff_id: staff.staff_id,
                                            check_in: staff.check_in,
                                            check_out: staff.check_out,
                                            working_hours:
                                                calculateWorkingHours(
                                                    staff.check_in,
                                                    staff.check_out,
                                                ),
                                            target: Math.trunc(
                                                (shift.revenue || 0) /
                                                    staffData.length,
                                            ),
                                        },
                                    });
                                }),
                            );
                        },
                    ),
                );

                return target;
            },
            {
                maxWait: 5000,
                timeout: 10000,
            },
        )
        .then(res => {
            return {
                code: 200,
                message: "Update target successfully!",
                data: res,
            };
        })
        .catch(err => {
            if (err.code === "P2002") {
                return {
                    code: 400,
                    message: `Update failed because "${err?.meta?.target}" already exists!`,
                    data: [],
                };
            }
            return {
                code: 404,
                message: err.message,
                data: [],
            };
        });
};

//** Delete target */
export const deleteTarget = async ({ body }: { body: Target }) => {
    const { id } = body;

    return await client.target
        .delete({
            where: {
                id,
            },
        })
        .then(res => {
            return {
                code: 200,
                message: "Delete target successfully!",
                data: res,
            };
        })
        .catch(err => {
            return {
                code: 404,
                message: err.message,
                data: [],
            };
        });
};

function calcTargetTotal(shifts: Record<string, any>) {
    return Object.values(shifts).reduce(
        (acc, s) => ({
            revenue: acc.revenue + (s.revenue || 0),
            cash: acc.cash + (s.cash || 0),
            transfer: acc.transfer + (s.transfer || 0),
            deduction: acc.deduction + (s.deduction || 0),
        }),
        { revenue: 0, cash: 0, transfer: 0, deduction: 0 },
    );
}

function hasShiftChanged(existing: any, newShifts: Record<string, any>) {
    const oldShifts = existing.target_shift;

    if (oldShifts.length !== Object.keys(newShifts).length) return true;

    return Object.entries(newShifts).some(([shift_id, newShift]) => {
        const old = oldShifts.find(
            (s: { shift_id: string }) => s.shift_id === shift_id,
        );
        if (!old) return true;

        const basicChanged =
            old.revenue !== newShift.revenue ||
            old.cash !== newShift.cash ||
            old.transfer !== newShift.transfer ||
            old.deduction !== newShift.deduction ||
            (old.description || "") !== (newShift.description || "");

        const staffChanged = isStaffChanged(
            old.target_staff ?? [],
            newShift.staffs ?? [],
            newShift.revenue,
        );

        return basicChanged || staffChanged;
    });
}

function isStaffChanged(
    oldStaffs: any[],
    newStaffs: any[],
    revenue: number,
): boolean {
    if (oldStaffs.length !== newStaffs.length) return true;

    return newStaffs.some(newStaff => {
        const working_hours = calculateWorkingHours(
            newStaff.check_in,
            newStaff.check_out,
        );
        const target = revenue / newStaffs.length;

        const match = oldStaffs.find(
            s =>
                s.staff_id === newStaff.staff_id &&
                s.check_in === newStaff.check_in &&
                s.check_out === newStaff.check_out &&
                s.working_hours === working_hours &&
                s.target === target,
        );

        return !match;
    });
}
