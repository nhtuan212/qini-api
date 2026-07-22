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

/**
 * Resolves the id of the user who owns the targeted resource, from the request.
 * Return `undefined` when it can't be determined (treated as "not the owner").
 * May be async (e.g. it has to look the owning userId up from the DB).
 */
type OwnerResolver = (
    req: Request,
) => string | undefined | Promise<string | undefined>;

/**
 * Authorization layer — run AFTER authMiddleware.
 * Allows the request if req.user.role is in the allowed list (e.g. ADMIN),
 * OR if the resource belongs to the caller (owner id === req.user.id).
 * Use for "own record, unless privileged" routes like personal salary.
 *
 * `owner` is either the name of a route param holding the owning userId
 * (e.g. "id" for /user/:id), or a resolver function for cases where the
 * owner lives in the body (POST) or must be fetched from the DB (PUT /:id).
 */
export const requireSelfOrRole = (
    owner: string | OwnerResolver,
    ...roles: Role[]
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(STATUS_CODE.UNAUTHORIZED).json({
                code: STATUS_CODE.UNAUTHORIZED,
                message: "Authentication required!",
            });
        }

        // Privileged roles bypass the ownership check (and any DB lookup).
        if (roles.includes(req.user.role)) {
            return next();
        }

        try {
            const ownerId =
                typeof owner === "function"
                    ? await owner(req)
                    : req.params?.[owner];

            if (ownerId && ownerId === req.user.id) {
                return next();
            }
        } catch {
            // fall through to FORBIDDEN — never leak the resource on error
        }

        return res.status(STATUS_CODE.FORBIDDEN).json({
            code: STATUS_CODE.FORBIDDEN,
            message: "You do not have permission to access this resource!",
        });
    };
};
