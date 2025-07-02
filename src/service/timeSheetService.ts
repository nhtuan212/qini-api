import { client } from ".";
import { TimeSheet } from "../../dist/generated/client";
import { getDefaultTargetAt } from "../utils";

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
    const { query } = req;
    const { staff_id, shift_id, start_date, end_date } = query;

    const where: string[] = [];
    const params: any[] = [];

    if (staff_id) {
        where.push(`ts.staff_id = $${params.length + 1}::uuid`);
        params.push(staff_id);
    }
    if (shift_id) {
        where.push(`s.id = $${params.length + 1}::uuid`);
        params.push(shift_id);
    }
    if (start_date && end_date) {
        where.push(
            `ts.date BETWEEN $${params.length + 1}::date AND $${
                params.length + 2
            }::date`,
        );
        params.push(start_date, end_date);
    } else if (start_date) {
        where.push(`ts.date >= $${params.length + 1}::date`);
        params.push(start_date);
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const sql = `
        SELECT
            ts.id, ts.staff_id, ts.shift_id, ts.target_shift_id, ts.check_in, ts.check_out, ts.working_hours, ts.date,
            st.name AS staff_name,
            s.name AS shift_name,
            FLOOR(t_shift.revenue / tsc.cnt) AS target
        FROM time_sheet ts
        INNER JOIN target_shift t_shift ON ts.target_shift_id = t_shift.id
        INNER JOIN shift s ON t_shift.shift_id = s.id
        INNER JOIN staff st ON ts.staff_id = st.id
        INNER JOIN (
            SELECT target_shift_id, COUNT(*) AS cnt
            FROM time_sheet
            GROUP BY target_shift_id
        ) tsc ON tsc.target_shift_id = ts.target_shift_id
        ${whereClause}
        ORDER BY ts.date desc;
    `;

    const sumWorkingHoursQuery = `
        SELECT COALESCE(SUM(ts.working_hours), 0) AS total_working_hours
        FROM time_sheet ts
        INNER JOIN target_shift t_shift ON ts.target_shift_id = t_shift.id
        INNER JOIN shift s ON t_shift.shift_id = s.id
        INNER JOIN staff st ON ts.staff_id = st.id
        ${whereClause};
    `;

    const [result, sumResult] = await Promise.all([
        client.$queryRawUnsafe(sql, ...params),
        client.$queryRawUnsafe(sumWorkingHoursQuery, ...params),
    ]);

    const total_target = (result as any).reduce((sum: number, row: any) => {
        return sum + (row.target || 0);
    }, 0);
    const total_working_hours = (sumResult as any)[0]?.total_working_hours || 0;

    return client.timeSheet
        .findMany({
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
                data: result,
                total_working_hours,
                total_target,
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
    if (Array.isArray(body)) {
        return client.timeSheet
            .createManyAndReturn({
                data: body.map(item => ({
                    ...item,
                    working_hours: item.working_hours || 0,
                    date: item.date || getDefaultTargetAt(),
                })),
                include: {
                    staff: true,
                    shift: true,
                },
                skipDuplicates: true, // Optional: skip duplicates
            })
            .then(res => ({
                code: 200,
                message: "Create TimeSheets success!",
                data: formatTimeSheetResponse(res, "many"),
            }))
            .catch(err => ({
                code: 400,
                message: err.message,
                data: [],
            }));
    }

    return await client.timeSheet
        .create({
            data: {
                ...body,
                working_hours: 0,
                date: getDefaultTargetAt(),
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
