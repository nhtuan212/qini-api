import { client } from ".";
import { Reports } from "../../dist/generated/client";
import { isDateValid } from "../utils";

// Get method
export const getReport = async ({
    path,
    id,
    query,
}: {
    path: string;
    id: string;
    query: any;
}) => {
    const whereByDate = {
        ...(Object.keys(query).length > 0 && {
            // Check if staffId is valid
            ...(query.staffId && { staffId: query.staffId }),

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

    return await client.reports
        .findMany({
            orderBy: {
                createAt: "desc",
            },
            where: {
                ...(path.includes("revenue") && { revenueId: id }),
                ...(path.includes("staff") && { staffId: id }),
                ...whereByDate,
            },
            include: {
                staff: {
                    select: {
                        // id: true,
                        name: true,
                    },
                },
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
