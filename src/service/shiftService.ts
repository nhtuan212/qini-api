import { client } from ".";

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
