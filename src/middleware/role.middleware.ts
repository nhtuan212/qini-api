import { NextFunction, Request, Response } from "express";
import { STATUS_CODE } from "../constants";
import { Role } from "../db/schema/enum.schema";

/**
 * Authorization layer — run AFTER authMiddleware.
 * Allows the request only if req.user.role is in the allowed list.
 */
export const requireRole = (...roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(STATUS_CODE.UNAUTHORIZED).json({
                code: STATUS_CODE.UNAUTHORIZED,
                message: "Authentication required!",
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(STATUS_CODE.FORBIDDEN).json({
                code: STATUS_CODE.FORBIDDEN,
                message: "You do not have permission to access this resource!",
            });
        }

        next();
    };
};
