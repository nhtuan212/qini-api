import { client } from ".";
import { Staff } from "../../dist/generated/client";

export const getStaff = async ({ id }: { id: string }) => {
    if (id) {
        return await client.staff
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

    return await client.staff
        .findMany({
            orderBy: {
                name: "asc",
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

export const createStaff = async ({ body }: { body: Staff }) => {
    return await client.staff
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

export const editStaff = async ({ id, body }: { id: string; body: Staff }) => {
    return await client.staff
        .update({
            where: { id },
            data: { ...body, updated_at: new Date().toISOString() },
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

export const deleteStaff = async ({ body }: { body: Staff }) => {
    const { id } = body;

    return await client
        .$transaction(async prisma => {
            return prisma.staff.delete({
                where: {
                    id,
                },
            });
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
