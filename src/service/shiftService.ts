import { client } from ".";
import { Staffs } from "../../dist/generated/client";

export const getShift = async () => {
    return await client.shifts
        .findMany({
            orderBy: {
                name: "asc",
            },
        })
        .then((res: any) => {
            return {
                code: 200,
                message: "Get Shift successfully!",
                data: res,
            };
        })
        .catch((err: any) => {
            throw err;
        });
};

export const createShift = async (data: any) => {
    return await client.shifts
        .createMany({
            data,
        })
        .then((res: any) => {
            return {
                code: 201,
                message: "Create Shift successfully!",
                data: res,
            };
        })
        .catch((err: any) => {
            throw err;
        });
};

export const updateShift = async ({
    id,
    body,
}: {
    id: string;
    body: Staffs;
}) => {
    return await client.shifts
        .update({
            where: {
                id,
            },
            data: body,
        })
        .then((res: any) => {
            return {
                code: 200,
                message: "Update Shift successfully!",
                data: res,
            };
        })
        .catch((err: any) => {
            throw err;
        });
};
