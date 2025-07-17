import { db, userTable } from "../db";
import { eq } from "drizzle-orm";
import { comparePassword } from "../utils";

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
                    code: 401,
                    message: "User or Password incorrectly!",
                };
            }

            const passwordValid = await comparePassword(password, res.password);
            if (!passwordValid) {
                return {
                    code: 401,
                    message: "User or Password incorrectly!",
                };
            }

            return {
                code: 200,
                message: "Login successfully!",
                data: res,
            };
        });
};
