import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../constants";
import { Role } from "../db/schema/enum.schema";

export interface TokenPayload {
    id: string;
    username: string;
    role: Role;
}

export interface CreatePasswordTokenPayload {
    id: string;
    username: string;
    purpose: "create-password";
}

export const generateToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
};

export const verifyToken = (token: string): TokenPayload | null => {
    try {
        const payload = jwt.verify(token, JWT_SECRET) as TokenPayload & {
            purpose?: string;
        };

        // Reject scoped tokens (e.g. create-password) on normal routes.
        if (payload.purpose) return null;

        return payload;
    } catch {
        return null;
    }
};

export const generateCreatePasswordToken = (payload: {
    id: string;
    username: string;
}): string => {
    return jwt.sign({ ...payload, purpose: "create-password" }, JWT_SECRET, {
        expiresIn: "15m",
    });
};

export const verifyCreatePasswordToken = (
    token: string,
): CreatePasswordTokenPayload | null => {
    try {
        const payload = jwt.verify(
            token,
            JWT_SECRET,
        ) as CreatePasswordTokenPayload;

        if (payload.purpose !== "create-password") return null;

        return payload;
    } catch {
        return null;
    }
};
