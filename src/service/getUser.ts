import { Request } from "express";
import { client } from ".";
import { UserType } from "../types/users";
import { hashPassword } from "../utils";

export const getUser = async ({ offset, limit }: any) => {
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

export const createUser = async ({
    query,
}: {
    query: Request["query"] & UserType;
}) => {
    return await client.users
        .create({
            data: {
                ...query,
                password: await hashPassword(query.password),
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
