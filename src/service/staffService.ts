import { client } from ".";
import { Staffs } from "@prisma/client";

export const getStaff = async ({ id }: { id?: string }) => {
    if (id) {
        return await client.staffs
            .findUnique({
                where: { id },
            })
            .then((res: any) => {
                return {
                    code: 200,
                    message: "Get Staff id successfully!",
                    data: res,
                };
            })
            .catch((err: any) => {
                throw err;
            });
    }

    return await client.staffs
        .findMany({
            orderBy: {
                createAt: "desc",
            },
        })
        .then((res: any) => {
            return {
                code: 200,
                message: "Get Staff successfully!",
                data: res,
            };
        })
        .catch((err: any) => {
            throw err;
        });
};

export const createStaff = async ({ body }: { body: Staffs }) => {
    return await client.staffs
        .create({
            data: {
                ...body,
            },
        })
        .then(res => {
            return {
                code: 200,
                message: "Create success!",
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

export const editStaff = async ({ id, body }: { id: string; body: Staffs }) => {
    return await client.staffs
        .update({
            where: { id },
            data: { ...body, updateAt: new Date().toISOString() },
        })
        .then(res => {
            return {
                code: 200,
                message: "Get staff successfully!",
                data: res,
            };
        })
        .catch(err => {
            if (err.code === "P2002") {
                return {
                    code: 404,
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

export const deleteStaff = async ({ body }: { body: Staffs }) => {
    const { id } = body;

    return await client.staffs
        .delete({
            where: {
                id,
            },
        })
        .then(res => {
            return {
                code: 200,
                message: "Delete staff successfully!",
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
