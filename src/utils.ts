import bcrypt from "bcrypt";

// Hash Password
export const hashPassword = async (password: string | Buffer) => {
    return await bcrypt
        .hash(password, Number(process.env.SALT_ROUNDS))
        .then(res => res);
};
