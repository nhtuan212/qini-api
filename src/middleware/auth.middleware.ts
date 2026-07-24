import { NextFunction, Request, Response } from "express";
import { STATUS_CODE } from "../constants";
import { TokenPayload, verifyToken } from "../utils";

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(STATUS_CODE.UNAUTHORIZED).json({
            code: STATUS_CODE.UNAUTHORIZED,
            message: "Missing or invalid authorization token!",
        });
    }

    const payload = verifyToken(token);

    if (!payload) {
        return res.status(STATUS_CODE.UNAUTHORIZED).json({
            code: STATUS_CODE.UNAUTHORIZED,
            message: "Token is invalid or expired!",
        });
    }

    req.user = payload;
    next();
};
