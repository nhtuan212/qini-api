import { client } from ".";
import { Staff } from "../../dist/generated/client";
import { decryptPassword, comparePassword, hashPassword } from "../utils";

export const getStaff = async ({ id }: { id: string }) => {
    if (id) {
        return await client.staff
            .findUnique({
                where: { id },
                select: { id: true, name: true, is_target: true, active: true },
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
            select: { id: true, name: true, is_target: true, active: true },
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
    if (body.password) {
        const decryptedPassword = decryptPassword(body.password);
        body.password = await hashPassword(decryptedPassword);
    }

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

export const updateStaff = async ({
    id,
    body,
}: {
    id: string;
    body: Staff;
}) => {
    if (body.password) {
        const decryptedPassword = decryptPassword(body.password);
        body.password = await hashPassword(decryptedPassword);
    }

    return await client.staff
        .update({
            where: { id },
            data: {
                ...body,
                updated_at: new Date().toISOString(),
            },
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

export const validateStaffPassword = async ({
    id,
    password,
}: {
    id: string;
    password: string;
}) => {
    return await client.staff
        .findUnique({
            where: { id },
            select: { id: true, name: true, password: true, active: true },
        })
        .then(async res => {
            if (!res) {
                return {
                    code: 404,
                    message: "Staff not found!",
                    data: null,
                };
            }

            if (!res.active) {
                return {
                    code: 403,
                    message: "Staff account is inactive!",
                    data: null,
                };
            }

            if (!res.password) {
                return {
                    code: 400,
                    message: "Staff has no password set!",
                    data: null,
                };
            }

            const decryptedPassword = decryptPassword(password);

            const isPasswordValid = await comparePassword(
                decryptedPassword,
                res.password,
            );

            if (!isPasswordValid) {
                return {
                    code: 400,
                    message: "Invalid password!",
                    data: null,
                };
            }

            return {
                code: 200,
                data: {
                    valid: isPasswordValid,
                    staff_id: res.id,
                    staff_name: res.name,
                },
            };
        })
        .catch(err => {
            return {
                code: 404,
                message: err.message,
                data: null,
            };
        });
};
