import bcrypt from "bcrypt";
import { Pagination } from "./constants";

// Hash Password
export const hashPassword = async (password: string | Buffer) => {
    return await bcrypt
        .hash(password, Number(process.env.SALT_ROUNDS))
        .then(res => res);
};

// Password Compare
export const passwordCompare = async (
    password: string | Buffer,
    hash: string,
) => {
    return await bcrypt.compare(password, hash);
};

export const isDateValid = (date: Date) => {
    return !isNaN(Number(new Date(date)));
};

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
