import bcrypt from "bcrypt";

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
