import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

// Uuid
export const uuid = () => uuidv4();

// Hash Password
export const hashPassword = async (password: string | Buffer) => {
    return await bcrypt
        .hash(password, Number(process.env.SALT_ROUNDS))
        .then(res => res);
};
