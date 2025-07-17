import { db, UserType, userTable } from "../db";
import { STATUS_CODE } from "../constants";
import { eq } from "drizzle-orm";

export const findAllUser = async () => {
    return await db
        .select()
        .from(userTable)
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get User successfully!",
                data: res,
            };
        });
};

export const insertUser = async ({ body }: { body: UserType }) => {
    return await db
        .insert(userTable)
        .values(body)
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Create User successfully!",
                data: res,
            };
        });
};

export const removeUserById = async ({ id }: { id: string }) => {
    return await db
        .delete(userTable)
        .where(eq(userTable.id, id))
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Delete User successfully!",
                data: res,
            };
        });
};
