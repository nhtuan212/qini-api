import { Request } from "express";
import { serviceHandler } from ".";
import {
    handleLogin,
    handleChangePassword,
    handleCreatePassword,
} from "../service";
import { verifyCreatePasswordToken } from "../utils";
import { STATUS_CODE } from "../constants";

export const login = serviceHandler(
    async (req: Request) =>
        await handleLogin({
            username: req.body.username,
            password: req.body.password,
        }),
);

export const changePassword = serviceHandler(
    async (req: Request) =>
        await handleChangePassword({
            username: req.body.username,
            currentPassword: req.body.currentPassword,
            newPassword: req.body.newPassword,
        }),
);

export const createPassword = serviceHandler(async (req: Request) => {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return {
            code: STATUS_CODE.UNAUTHORIZED,
            message: "Missing or invalid authorization token!",
        };
    }

    const payload = verifyCreatePasswordToken(token);

    if (!payload) {
        return {
            code: STATUS_CODE.UNAUTHORIZED,
            message: "Token is invalid or expired!",
        };
    }

    return await handleCreatePassword({
        id: payload.id,
        newPassword: req.body.newPassword,
    });
});
