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
