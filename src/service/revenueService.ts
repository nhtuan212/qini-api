import { client } from ".";
import { Revenues } from "@prisma/client";

// Get method
export const getRevenue = async () => {
    return await client.revenues
        .findMany({
            orderBy: {
                createAt: "desc",
            },
        })
        .then(res => {
            return {
                code: 200,
                message: "Get revenue successfully!",
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
export const createRevenue = async ({ body }: { body: Revenues }) => {
    return await client.revenues
        .create({
            data: body,
        })
        .then(res => {
            return {
                code: 200,
                message: "Add revenue successfully!",
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
export const deleteRevenue = async ({ body }: { body: Revenues }) => {
    const { id } = body;

    return await client.revenues
        .delete({
            where: {
                id,
            },
        })
        .then(res => {
            return {
                code: 200,
                message: "Delete revenue successfully!",
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
