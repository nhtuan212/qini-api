import { client } from ".";
import { Users } from "../../dist/generated/client";
import { hashPassword } from "../utils";

export const getTimeSheet = async ({ offset, limit }: any) => {
    const pagination = {
        ...(offset && { skip: Number(offset) }),
        ...(limit && { take: Number(limit) }),
    };

    return await client.users
        .findMany(pagination)
        .then((res: any) => {
            return res;
        })
        .catch((err: any) => {
            throw err;
        });
};

export const createTimeSheet = async ({ body }: { body: Users }) => {
    return await client.users
        .create({
            data: {
                ...body,
                password: await hashPassword(body.password),
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
