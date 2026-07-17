import { db, userTable } from "../db";
import { eq } from "drizzle-orm";
import {
    comparePassword,
    generateToken,
    generateCreatePasswordToken,
    hashPassword,
} from "../utils";
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

            if (!res.isActive) {
                return {
                    code: STATUS_CODE.FORBIDDEN,
                    message: "Your account has been disabled!",
                };
            }

            if (res.isFirstLogin) {
                const createPasswordToken = generateCreatePasswordToken({
                    id: res.id,
                    username: res.username,
                });

                return {
                    code: STATUS_CODE.SUCCESS,
                    message: "Please create your password before continuing.",
                    data: {
                        isFirstLogin: true,
                        createPasswordToken,
                    },
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

export const handleChangePassword = async ({
    username,
    currentPassword,
    newPassword,
}: {
    username: string;
    currentPassword: string;
    newPassword: string;
}) => {
    if (!newPassword) {
        return {
            code: STATUS_CODE.BAD_REQUEST,
            message: "New password is required!",
        };
    }

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

            const passwordValid = await comparePassword(
                currentPassword,
                res.password,
            );

            if (!passwordValid) {
                return {
                    code: STATUS_CODE.UNAUTHORIZED,
                    message: "User or Password incorrectly!",
                };
            }

            if (!res.isActive) {
                return {
                    code: STATUS_CODE.FORBIDDEN,
                    message: "Your account has been disabled!",
                };
            }

            const hashedPassword = await hashPassword(newPassword);

            await db
                .update(userTable)
                .set({
                    password: hashedPassword,
                    isFirstLogin: false,
                    updatedAt: new Date().toISOString(),
                })
                .where(eq(userTable.id, res.id));

            return {
                code: STATUS_CODE.SUCCESS,
                message: "Password changed successfully! Please login again.",
            };
        });
};

export const handleCreatePassword = async ({
    id,
    newPassword,
}: {
    id: string;
    newPassword: string;
}) => {
    if (!newPassword) {
        return {
            code: STATUS_CODE.BAD_REQUEST,
            message: "New password is required!",
        };
    }

    return await db.query.userTable
        .findFirst({
            where: eq(userTable.id, id),
        })
        .then(async res => {
            if (!res) {
                return {
                    code: STATUS_CODE.UNAUTHORIZED,
                    message: "User not found!",
                };
            }

            if (!res.isActive) {
                return {
                    code: STATUS_CODE.FORBIDDEN,
                    message: "Your account has been disabled!",
                };
            }

            if (!res.isFirstLogin) {
                return {
                    code: STATUS_CODE.BAD_REQUEST,
                    message: "Password has already been created!",
                };
            }

            const hashedPassword = await hashPassword(newPassword);

            await db
                .update(userTable)
                .set({
                    password: hashedPassword,
                    isFirstLogin: false,
                    updatedAt: new Date().toISOString(),
                })
                .where(eq(userTable.id, res.id));

            return {
                code: STATUS_CODE.SUCCESS,
                message: "Password created successfully! Please login again.",
            };
        });
};
