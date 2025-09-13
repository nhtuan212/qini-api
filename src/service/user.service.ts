import { db, UserType, userTable } from "../db";
import { STATUS_CODE } from "../constants";
import { eq } from "drizzle-orm";
import { hashPassword } from "../utils";

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
    if (!body.password) {
        return {
            code: STATUS_CODE.BAD_REQUEST,
            message: "Password is required!",
        };
    }

    return await db
        .insert(userTable)
        .values({
            ...body,
            password: await hashPassword(body.password),
        })
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Create User successfully!",
                data: res,
            };
        });
};

export const updateUserById = async ({
    id,
    body,
}: {
    id: string;
    body: UserType;
}) => {
    return await db
        .update(userTable)
        .set({
            ...body,
            password: await hashPassword(body.password),
        })
        .where(eq(userTable.id, id))
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Update User successfully!",
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
