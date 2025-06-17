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

export const calculateWorkingHours = (
    checkIn: string,
    checkOut: string,
): number => {
    const [inH, inM] = checkIn.split(":").map(Number);
    const [outH, outM] = checkOut.split(":").map(Number);

    const inMinutes = inH * 60 + inM;
    const outMinutes = outH * 60 + outM;

    const diffMinutes = outMinutes - inMinutes;
    return Number((diffMinutes / 60).toFixed(2)); // Convert to hours
};

// Crypto
export { generateRSAKeyPair, decryptPassword } from "./crypto";
