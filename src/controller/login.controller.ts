import { Request } from "express";
import { serviceHandler } from ".";
import { handleLogin } from "../service/login.service";

export const login = serviceHandler(
    async (req: Request) =>
        await handleLogin({
            username: req.body.username,
            password: req.body.password,
        }),
);
