import { client } from ".";
import { ReportsOnStaffs } from "../../dist/generated/client";
import { isDateValid } from "../utils";

// Get method
export const getReportOnStaff = async ({ query }: { query: any }) => {
    const reportWhereClause = {
        ...(Object.keys(query).length > 0 && {
            ...(query.staffId && { staffId: query.staffId }),
            ...(query.reportId && { reportId: query.reportId }),

            // Check if startDate and endDate are valid date
            ...(isDateValid(query.startDate) &&
                isDateValid(query.endDate) && {
                    createAt: {
                        gte: new Date(query.startDate),
                        lte: new Date(`${query.endDate}T23:59:59.999Z`), // End of day
                    },
                }),
        }),
    };

    return await client.reportsOnStaffs
        .findMany({
            orderBy: {
                createAt: "desc",
            },
            where: {
                ...reportWhereClause,
            },
            include: {
                report: {
                    include: {
                        shift: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        })
        .then(res => {
            return {
                code: 200,
                message: "Get report on staff successfully!",
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

// Post method
export const createReport = async ({ body }: { body: ReportsOnStaffs }) => {
    return await client.reportsOnStaffs
        .createMany({
            data: body,
        })
        .then(res => {
            return {
                code: 200,
                message: "Add report on staff successfully!",
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
