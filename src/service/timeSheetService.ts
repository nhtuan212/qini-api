import { client } from ".";
import { TimeSheet } from "../../dist/generated/client";
import { calculateWorkingHours, isValidISODate } from "../utils";

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
    const { staff_id, shift_id, date } = query;

    const whereClause = {
        ...(Object.keys(params).length > 0 && {
            ...(id && { id }),
        }),

        ...(Object.keys(query).length > 0 && {
            ...(staff_id && { staff_id }),
            ...(shift_id && { shift_id }),
            ...(date && isValidISODate(date) && { date: new Date(date) }),
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
                created_at: "asc",
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
    // Fetch existing record to get check_in if not provided
    const existingRecord = await client.timeSheet.findUnique({
        where: { id },
        select: { check_in: true, check_out: true },
    });

    if (!existingRecord) {
        return {
            code: 404,
            message: "TimeSheet not found!",
            data: [],
        };
    }

    // Use existing check_in if not provided in body
    const check_in = body.check_in || existingRecord.check_in;
    const check_out = body.check_out || existingRecord.check_out;

    const data = {
        ...body,
        working_hours: calculateWorkingHours(check_in, check_out),
    };

    return await client.timeSheet
        .update({
            where: { id },
            data,
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

export const deleteTimeSheet = async ({ body }: { body: TimeSheet }) => {
    const { id } = body;

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
