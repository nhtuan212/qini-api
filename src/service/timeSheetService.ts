import { client } from ".";
import { TimeSheet } from "../../dist/generated/client";
import { getStaff } from "./staffService";
import { getDefaultTargetAt, isValidISODate } from "../utils";

const formatTimeSheetResponse = (res: any, type: "many" | "one") => {
    switch (type) {
        case "many": {
            return res.map((item: any) => {
                const { staff, shift, ...rest } = item;
                return {
                    ...rest,
                    staff_name: staff?.name,
                    shift_name: shift?.name,
                };
            });
        }
        case "one": {
            const { staff, shift, ...rest } = res;
            return {
                ...rest,
                staff_name: staff?.name,
                shift_name: shift?.name,
            };
        }
        default:
            return [];
    }
};

export const getTimeSheet = async (req: { [key: string]: any }) => {
    const { query, params } = req;
    const { id } = params;
    const { staff_id, shift_id, target_at } = query;

    const whereClause = {
        ...(Object.keys(params).length > 0 && {
            ...(id && { id }),
        }),

        ...(Object.keys(query).length > 0 && {
            ...(staff_id && { staff_id }),
            ...(shift_id && { shift_id }),
            ...(target_at &&
                isValidISODate(target_at) && {
                    target_at: {
                        gte: new Date(target_at),
                        lte: new Date(
                            new Date(target_at).setDate(
                                new Date(target_at).getDate() + 1,
                            ),
                        ),
                    },
                }),
        }),
    };

    return client.timeSheet
        .findMany({
            where: { ...whereClause },
            include: {
                staff: true,
                shift: true,
            },
            orderBy: {
                created_at: "desc",
            },
        })
        .then(res => {
            return {
                code: 200,
                message: "Get TimeSheets successfully!",
                data: formatTimeSheetResponse(res, "many"),
                pagination: {
                    total: res.length,
                    page: Number(query.page) || 1,
                    limit: Number(query.limit) || 10,
                },
            };
        })
        .catch((err: any) => {
            throw err;
        });
};

export const createTimeSheet = async ({ body }: { body: TimeSheet }) => {
    return await client.timeSheet
        .create({
            data: {
                ...body,
                working_hours: 0,
                created_at: getDefaultTargetAt(),
            },
            include: {
                staff: true,
                shift: true,
            },
        })
        .then(res => {
            return {
                code: 200,
                message: "Create TimeSheet success!",
                data: formatTimeSheetResponse(res, "one"),
            };
        })
        .catch(err => {
            if (err.code === "P2002") {
                return {
                    code: 400,
                    message:
                        "Create failed because time_sheet for this shift already exists!",
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

export const updateTimeSheet = async ({
    id,
    body,
}: {
    id: string;
    body: TimeSheet;
}) => {
    return await client.timeSheet
        .update({
            where: {
                id,
            },
            data: body,
            include: {
                staff: true,
                shift: true,
            },
        })
        .then(res => {
            return {
                code: 200,
                message: "Update time_sheet successfully!",
                data: formatTimeSheetResponse(res, "one"),
            };
        })
        .catch(err => {
            if (err.code === "P2002") {
                return {
                    code: 400,
                    message:
                        "Update failed because time_sheet for this staff and date already exists!",
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

export const deleteTimeSheet = async (id: string) => {
    return await client
        .$transaction(async prisma => {
            return prisma.timeSheet.delete({
                where: {
                    id,
                },
            });
        })
        .then(res => {
            return {
                code: 200,
                message: "Delete TimeSheet successfully!",
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

type StaffTargetResult = {
    staff_id: string;
    staff_name: string;
    time_sheet_id: string | null;
    check_in: string | null;
    check_out: string | null;
    working_hours: number | null;
    target: number | null;
    target_shift_id: string | null;
    shift_id: string | null;
    shift_name: string | null;
    target_at: Date | null;
    target_id: string | null;
};

export const getTimeSheetReport = async (req: { [key: string]: any }) => {
    const { query } = req;
    const { staff_id } = query;

    return await client
        .$transaction(async prisma => {
            const staff = await getStaff({ id: staff_id });
            const timeSheet = await prisma.timeSheet.findMany({
                orderBy: {
                    created_at: "desc",
                },
                where: {
                    staff_id: staff_id,
                },
                select: {
                    id: true,
                    check_in: true,
                    check_out: true,
                    working_hours: true,

                    staff: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });

            const totalWorkingHours = timeSheet.reduce(
                (sum, item) => sum + (item.working_hours || 0),
                0,
            );

            const totalTarget = 0;
            // const totalTarget = timeSheet.reduce(
            //     (sum, item) => sum + (item.target || 0),
            //     0,
            // );

            return {
                code: 200,
                message: "Get target staff successfully!",
                data: {
                    id: staff?.data?.id || query.staff_id,
                    name: staff?.data?.name || "",
                    totalWorkingHours,
                    totalTarget,
                    shifts: timeSheet.map((item: any) => {
                        return {
                            ...item,
                            shift_name: item.target_shift.shift.name,
                            target_at: item.target_shift.target.target_at,
                            target_shift: undefined,
                            staff: undefined,
                        };
                    }),
                },
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

export const getTimeSheetReportByQueryRaw = async (req: {
    [key: string]: any;
}) => {
    const { query } = req;
    const { staff_id, start_date, end_date } = query;

    const staff = await getStaff({ id: staff_id });
    const result = await client.$queryRawUnsafe<StaffTargetResult[]>(
        `
              SELECT
                  ts.id AS time_sheet_id,
                  ts.check_in,
                  ts.check_out,
                  ts.working_hours,
                  ts.target,
                  t_shift.id AS target_shift_id,
                  s.id AS shift_id,
                  s.name AS shift_name,
                  t.target_at,
                  t.id AS target_id
              FROM time_sheet ts
              INNER JOIN target_shift t_shift ON ts.target_shift_id = t_shift.id
              INNER JOIN shift s ON t_shift.shift_id = s.id
              INNER JOIN target t ON t.id = t_shift.target_id
              WHERE ts.staff_id = $1::uuid
              ${
                  start_date && end_date
                      ? "AND t.target_at BETWEEN $2 AND $3"
                      : ""
              }
              ORDER BY t.target_at DESC
            `,
        ...(start_date && end_date
            ? [
                  staff_id,
                  new Date(start_date),
                  new Date(
                      new Date(query.end_date).setDate(
                          new Date(query.end_date).getDate(),
                      ),
                  ),
              ]
            : [staff_id]),
    );

    const totalWorkingHours = result.reduce(
        (sum, item) => sum + (item.working_hours || 0),
        0,
    );
    const totalTarget = result.reduce(
        (sum, item) => sum + (item.target || 0),
        0,
    );

    return {
        code: 200,
        message: "Get staff id successfully!",
        data: {
            staff_id: staff?.data?.id || staff_id,
            staff_name: staff?.data?.name || "",
            totalWorkingHours,
            totalTarget,
            shifts: result.map(r => ({
                target_shift_id: r.target_shift_id,
                check_in: r.check_in,
                check_out: r.check_out,
                working_hours: r.working_hours,
                target: r.target,
                shift_name: r.shift_name,
                target_at: r.target_at,
            })),
        },
    };
};
