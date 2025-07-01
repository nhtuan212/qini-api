import { client } from ".";
import {
    Prisma,
    Shift,
    Target,
    TargetShift,
    TimeSheet,
} from "../../dist/generated/client";
import { isEmpty, isValidISODate, paginationQuery } from "../utils";
import { Pagination } from "../constants";

//** Variables */
const targetShiftSelect = {
    select: {
        id: true,
        shift_id: true,
        revenue: true,
        cash: true,
        transfer: true,
        deduction: true,
        description: true,

        shift: {
            select: {
                name: true,
                start_time: true,
                end_time: true,
            },
        },

        time_sheet: {
            select: {
                id: true,
                staff_id: true,
                check_in: true,
                check_out: true,
                working_hours: true,
                staff: {
                    select: {
                        name: true,
                    },
                },
            },
        },
    },
    orderBy: [
        {
            shift: {
                is_target: Prisma.SortOrder.desc,
            },
        },
        {
            shift: {
                start_time: Prisma.SortOrder.asc,
            },
        },
    ],
};

const targetSelect = {
    id: true,
    name: true,
    target_at: true,
    target_shift: targetShiftSelect,
};

const formatTargetResponse = (res: any, groupBy?: any) => {
    interface TargetShiftProps {
        shift: Shift;
        time_sheet: TimeSheet[];
    }

    if (Array.isArray(res)) {
        return res.map((target: any) => {
            const { target_shift, ...rest } = target;
            const targetSum = groupBy.find(
                (group: any) => group.target_id === target.id,
            );

            return {
                ...rest,
                revenue: targetSum?._sum.revenue || 0,
                cash: targetSum?._sum.cash || 0,
                transfer: targetSum?._sum.transfer || 0,
                deduction: targetSum?._sum.deduction || 0,
                target_shift: target_shift.map(
                    (target_shift: TargetShiftProps) => {
                        const { shift, time_sheet, ...rest } = target_shift;
                        return {
                            ...rest,
                            shift_name: shift.name,
                            start_time: shift.start_time,
                            end_time: shift.end_time,
                            time_sheet: time_sheet.map((time_sheet: any) => {
                                const { staff, ...rest } = time_sheet;
                                return {
                                    ...rest,
                                    staff_name: staff.name,
                                };
                            }),
                        };
                    },
                ),
            };
        });
    }

    const { target_shift, ...rest } = res;

    return {
        ...rest,
        target_shift: target_shift.map((target_shift: TargetShiftProps) => {
            const { shift, time_sheet, ...rest } = target_shift;
            return {
                ...rest,
                ...groupBy,
                shift_name: shift.name,
                time_sheet: time_sheet.map((time_sheet: any) => {
                    const { staff, ...rest } = time_sheet;
                    return {
                        ...rest,
                        staff_name: staff.name,
                    };
                }),
            };
        }),
    };
};

//** Get targets */
export const getTarget = async (req: { [key: string]: any }) => {
    const { query, params } = req;
    const { id } = params;

    const targetWhereClause = {
        ...(Object.keys(params).length > 0 && {
            ...(id && { id }),
        }),

        ...(Object.keys(query).length > 0 && {
            ...(query.target_at &&
                isValidISODate(query.target_at) && {
                    target_at: {
                        gte: new Date(query.target_at),
                        lte: new Date(
                            new Date(query.target_at).setDate(
                                new Date(query.target_at).getDate() + 1,
                            ),
                        ),
                    },
                }),

            // Check if startDate and endDate are valid date
            ...(isValidISODate(query.start_date) &&
                isValidISODate(query.end_date) && {
                    target_at: {
                        gte: new Date(query.start_date),
                        lte: new Date(
                            new Date(query.end_date).setDate(
                                new Date(query.end_date).getDate() + 1,
                            ),
                        ),
                    },
                }),
        }),
    };

    if (id) {
        const target = await client.target.findUnique({
            where: { id },
            select: targetSelect,
        });

        const groupBy = await client.targetShift.groupBy({
            by: ["target_id"],
            where: { target_id: id },
            _sum: {
                revenue: true,
                cash: true,
                transfer: true,
                deduction: true,
            },
        });

        return Promise.all([target, groupBy]).then(
            async ([target, groupBy]) => {
                return {
                    code: 200,
                    message: "Get target successfully!",
                    data: formatTargetResponse(target, groupBy),
                    pagination: {
                        page: 1,
                        rowsPerPage: 1,
                        total: target ? 1 : 0,
                    },
                };
            },
        );
    }

    const targets = await client.target.findMany({
        select: targetSelect,
        where: targetWhereClause,
        ...paginationQuery(query),
        orderBy: [
            {
                target_at: "desc",
            },
            {
                created_at: "desc",
            },
        ],
    });

    const total = await client.target.count({
        where: targetWhereClause,
    });

    const groupBy = await client.targetShift.groupBy({
        by: ["target_id"],
        _sum: {
            revenue: true,
            cash: true,
            transfer: true,
            deduction: true,
        },
    });

    return Promise.all([targets, total, groupBy]).then(
        async ([targets, total, groupBy]) => {
            return {
                code: 200,
                message: "Get target successfully!",
                data: formatTargetResponse(targets, groupBy),
                pagination: {
                    page: Number(query.page || 1),
                    rowsPerPage: Number(query.limit || Pagination.limit),
                    total,
                },
            };
        },
    );
};

//** Create target */
export const createTarget = async ({
    body,
}: {
    body: Target & {
        target_shift?: {
            [key: string]: any;
        };
    };
}) => {
    const shifts =
        body.target_shift && !isEmpty(body.target_shift)
            ? body.target_shift
            : await client.shift.findMany();

    const target = await client.target.create({
        data: {
            name: body.name,
            target_at: new Date(body.target_at),
        },
    });

    //** Create target shifts */
    const target_shift = await client.targetShift.createManyAndReturn({
        data: shifts.map((shift: TargetShift) => ({
            target_id: target.id,
            shift_id: shift.id,
        })),
    });

    //** Create time sheets */
    const time_sheet = shifts.flatMap(
        (shift: TargetShift & { time_sheet: TimeSheet[] }) => {
            if (shift.time_sheet && !isEmpty(shift.time_sheet)) {
                return shift.time_sheet.map((time_sheet: TimeSheet) => ({
                    target_shift_id: target_shift.find(
                        (ts: TargetShift) => ts.shift_id === shift.id,
                    )?.id,
                    staff_id: time_sheet.staff_id,
                    check_in: time_sheet.check_in,
                    check_out: time_sheet.check_out,
                    working_hours: time_sheet.working_hours,
                    target: Math.trunc(
                        (shift.revenue || 0) / shift.time_sheet.length,
                    ),
                    target_at: new Date(body.target_at),
                }));
            }
            return [];
        },
    );

    if (!isEmpty(time_sheet)) {
        await client.timeSheet.createManyAndReturn({
            data: time_sheet,
        });
    }

    return Promise.all([target, target_shift, time_sheet])
        .then(() => {
            return {
                code: 200,
                message: "Add target successfully!",
                data: {
                    ...target,
                    target_shift: target_shift.map((ts: TargetShift) => ({
                        ...ts,
                        time_sheet: [],
                    })),
                },
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
    body: Target;
}) => {
    return await client.target
        .update({
            select: targetSelect,
            where: { id },
            data: {
                name: body.name,
                target_at: new Date(body.target_at),
            },
        })
        .then(res => {
            return {
                code: 200,
                message: "Update target successfully!",
                data: formatTargetResponse(res),
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
