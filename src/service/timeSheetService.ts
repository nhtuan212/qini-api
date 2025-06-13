import { client } from ".";
import { TimeSheet } from "../../dist/generated/client";

export const getTimeSheet = async ({
    id,
    offset,
    limit,
}: {
    id?: string;
    offset?: any;
    limit?: any;
}) => {
    if (id) {
        return await client.timeSheet
            .findUnique({
                where: { id },
                include: {
                    staff: true,
                },
            })
            .then((res: any) => {
                return {
                    code: 200,
                    message: "Get TimeSheet successfully!",
                    data: res,
                };
            })
            .catch((err: any) => {
                throw err;
            });
    }

    const pagination = {
        ...(offset && { skip: Number(offset) }),
        ...(limit && { take: Number(limit) }),
    };

    return await client.timeSheet
        .findMany({
            ...pagination,
            include: {
                staff: true,
            },
            orderBy: {
                date: "desc",
            },
        })
        .then((res: any) => {
            return {
                code: 200,
                message: "Get TimeSheets successfully!",
                data: res,
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
            },
        })
        .then(res => {
            return {
                code: 200,
                message: "Create TimeSheet success!",
                data: res,
            };
        })
        .catch(err => {
            if (err.code === "P2002") {
                return {
                    code: 400,
                    message:
                        "Create failed because time_sheet for this staff and date already exists!",
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

    // Calculate working hours from check_in and check_out times
    let working_hours = 0;
    if (check_in && check_out) {
        const [checkInHour, checkInMin] = check_in.split(":").map(Number);
        const [checkOutHour, checkOutMin] = check_out.split(":").map(Number);

        const checkInMinutes = checkInHour * 60 + checkInMin;
        const checkOutMinutes = checkOutHour * 60 + checkOutMin;

        // Handle overnight shifts
        const totalMinutes =
            checkOutMinutes >= checkInMinutes
                ? checkOutMinutes - checkInMinutes
                : 24 * 60 - checkInMinutes + checkOutMinutes;

        working_hours = totalMinutes / 60; // Convert to hours

        // Round working hours with custom logic based on minutes:
        // <= 15 minutes => round down to integer
        // 16-46 minutes => round to .5
        // >= 47 minutes => round up to next integer
        const wholeHours = Math.floor(working_hours);
        const minutes = totalMinutes % 60;

        if (minutes < 15) {
            working_hours = wholeHours; // Round down
        } else if (minutes >= 15 && minutes <= 45) {
            working_hours = wholeHours + 0.5; // Round to .5
        } else {
            working_hours = wholeHours + 1; // Round up
        }
    }

    const data = {
        ...body,
        working_hours,
    };

    return await client.timeSheet
        .update({
            where: { id },
            data,
            include: {
                staff: true,
            },
        })
        .then(res => {
            return {
                code: 200,
                message: "Update time_sheet successfully!",
                data: res,
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
