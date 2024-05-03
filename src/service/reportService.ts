import { client } from ".";
import { Reports } from "../../dist/generated/client";

// Get method
export const getReport = async () => {
    return await client.reports
        .findMany({
            orderBy: {
                createAt: "desc",
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

//** Post method */
// Create
export const createReport = async ({ body }: { body: Reports }) => {
    return await client.reports
        .create({
            data: {
                revenue: Number(body.revenue),
                createAt: body.createAt,
            },
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

// Delete method
export const deleteReport = async ({ body }: { body: Reports }) => {
    const { id } = body;

    return await client.reports
        .delete({
            where: {
                id,
            },
        })
        .then(res => {
            return {
                code: 200,
                message: "Delete report successfully!",
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
