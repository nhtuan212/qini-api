import { client } from ".";
import { Reports } from "@prisma/client";
import { isDateValid } from "../utils";

// Get method
export const getReport = async ({ id, query }: { id: string; query: any }) => {
    return await client.reports
        .findMany({
            orderBy: {
                createAt: "desc",
            },
            where: {
                ...(id && { staffId: id }),
                ...(Object.keys(query).length > 0 && {
                    ...(isDateValid(query.startDate) &&
                        isDateValid(query.endDate) && {
                            createAt: {
                                gte: new Date(query.startDate),
                                lte: new Date(query.endDate),
                            },
                        }),
                }),
            },
        })
        .then(res => {
            return {
                code: 200,
                message: "Get report successfully!",
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
export const createReport = async ({ body }: { body: Reports }) => {
    return await client.reports
        .createMany({
            data: body,
        })
        .then(res => {
            return {
                code: 200,
                message: "Add report successfully!",
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
