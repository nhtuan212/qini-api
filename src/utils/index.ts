import bcrypt from "bcryptjs";
import { Pagination } from "../constants";

export const hashPassword = async (
    password: string,
    saltRounds: number = 10,
): Promise<string> => {
    return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
    password: string,
    hash: string,
): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};

export const isDateValid = (date: Date) => {
    return !isNaN(Number(new Date(date)));
};

export const isValidISODate = (date: string) =>
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date);

//** Pagination Query */
export const paginationQuery = (query: { [key: string]: any }) => {
    return {
        skip:
            (Number(query.page || 1) - 1) *
            Number(query.limit || Pagination.limit),
        take: Number(query.limit || Pagination.limit),
    };
};

export const isEmpty = (data: Array<string | number> | object) => {
    if (!data) return true;

    if (Array.isArray(data)) {
        return data.length === 0;
    }

    return Object.keys(data).length === 0;
};

export const getDefaultTargetAt = () => {
    const now = new Date();
    const vntNow = new Date(
        now.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
    );

    if (vntNow.getHours() < 7) {
        // Before 7 AM VNT - set to today 07:00:01 VNT
        return new Date(
            vntNow.getFullYear(),
            vntNow.getMonth(),
            vntNow.getDate(),
            7,
            0,
            1,
        );
    } else {
        // After 7 AM VNT - use current time
        return now;
    }
};

export const dateFilterQuery = (start_date?: string, end_date?: string) => {
    if (start_date && end_date) {
        return { gte: new Date(start_date), lte: new Date(end_date) };
    }
    if (start_date) {
        return { gte: new Date(start_date) };
    }
    return undefined;
};

// Crypto
export { generateRSAKeyPair, decryptPassword } from "./crypto";
