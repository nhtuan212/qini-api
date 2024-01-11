import { client } from ".";

export const login = async ({
    username,
    password,
}: {
    username: string;
    password: string;
}) => {
    return await client.users
        .findUnique({ where: { username, password } })
        .then((res: any) => {
            // console.log({ res });
            if (!res) {
                return {
                    code: 401,
                    message: "User or Password incorrectly!",
                };
            }

            return {
                code: 200,
                message: "Create success!",
                data: res,
            };
        })
        .catch((err: any) => {
            throw err;
        });
};
