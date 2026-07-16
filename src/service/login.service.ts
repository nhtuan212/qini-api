import { db, userTable } from "../db";
import { eq } from "drizzle-orm";
import { comparePassword, generateToken } from "../utils";
import { STATUS_CODE } from "../constants";

export const handleLogin = async ({
    username,
    password,
}: {
    username: string;
    password: string;
}) => {
    return await db.query.userTable
        .findFirst({
            where: eq(userTable.username, username),
        })
        .then(async res => {
            if (!res) {
                return {
                    code: STATUS_CODE.UNAUTHORIZED,
                    message: "User or Password incorrectly!",
                };
            }

            const passwordValid = await comparePassword(password, res.password);
            if (!passwordValid) {
                return {
                    code: STATUS_CODE.UNAUTHORIZED,
                    message: "User or Password incorrectly!",
                };
            }

            const accessToken = generateToken({
                id: res.id,
                username: res.username,
                role: res.role,
            });

            const { password: _password, ...user } = res;

            return {
                code: STATUS_CODE.SUCCESS,
                message: "Login successfully!",
                data: {
                    accessToken,
                    ...user,
                },
            };
        });
};
