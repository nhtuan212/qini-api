import { client } from ".";
import { passwordCompare } from "../utils";

export const login = async ({
    username,
    password,
}: {
    username: string;
    password: string;
}) => {
    const user = await client.users.findUnique({
        where: { username },
    });
    if (!user) {
        return {
            status: 401,
            message: "User or Password incorrectly!",
        };
    }

    const passwordValid = await passwordCompare(password, user.password);
    if (!passwordValid) {
        return {
            status: 401,
            message: "User or Password incorrectly!",
        };
    }

    return {
        status: 200,
        message: "Create success!",
        data: user,
    };
};
