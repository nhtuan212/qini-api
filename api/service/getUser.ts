import { Request } from "express";
import { client } from ".";
import { UserType } from "../types/users";

export const queryUser = async ({ offset, limit }: any) => {
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
            data: query,
        })
        .then((res: any) => res)
        .catch((err: any) => err);
};
