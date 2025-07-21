import { asc, eq } from "drizzle-orm";
import { db, staffTable, StaffType } from "../db";
import { comparePassword, decryptPassword, hashPassword } from "../utils";
import { STATUS_CODE } from "../constants";

export const findAllStaff = async () => {
    return await db
        .select()
        .from(staffTable)
        .orderBy(asc(staffTable.name))
        .then((res: StaffType[]) => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Staff successfully!",
                data: res,
            };
        });
};

export const findStaffById = async ({ id }: { id: string }) => {
    return await db.query.staffTable
        .findFirst({
            where: eq(staffTable.id, id),
        })
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Staff by Id successfully!",
                data: res,
            };
        });
};

export const insertStaff = async ({ body }: { body: StaffType }) => {
    return await db
        .insert(staffTable)
        .values(body)
        .returning()
        .then((res: StaffType[]) => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Create Staff successfully!",
                data: res,
            };
        });
};

export const updateStaffById = async ({
    id,
    body,
}: {
    id: string;
    body: StaffType;
}) => {
    if (body.password) {
        const decryptedPassword = decryptPassword(body.password);
        body.password = await hashPassword(decryptedPassword);
    }

    return await db
        .update(staffTable)
        .set({
            ...body,
            isFirstLogin: false,
            updatedAt: new Date().toISOString(),
        })
        .where(eq(staffTable.id, id))
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Update Staff successfully!",
                data: res[0],
            };
        });
};

export const removeStaffById = async ({ id }: { id: string }) => {
    console.log("id", id);
    return await db
        .delete(staffTable)
        .where(eq(staffTable.id, id))
        .returning()
        .then((res: StaffType[]) => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Delete Staff successfully!",
                data: res,
            };
        });
};

export const validateStaffPasswordById = async ({
    id,
    password,
}: {
    id: StaffType["id"];
    password: string;
}) => {
    return await db.query.staffTable
        .findFirst({
            where: eq(staffTable.id, id),
        })
        .then(async res => {
            if (!res) {
                return {
                    code: STATUS_CODE.BAD_REQUEST,
                    message: "Staff not found!",
                };
            }

            if (!res.password) {
                return {
                    code: STATUS_CODE.BAD_REQUEST,
                    message: "Staff has no password set!",
                };
            }

            if (!res.active) {
                return {
                    code: STATUS_CODE.BAD_REQUEST,
                    message: "Staff account is inactive!",
                };
            }

            const decryptedPassword = decryptPassword(password);

            const isPasswordValid = await comparePassword(
                decryptedPassword,
                res.password,
            );

            if (!isPasswordValid) {
                return {
                    code: STATUS_CODE.BAD_REQUEST,
                    message: "Invalid password!",
                };
            }

            return {
                code: STATUS_CODE.SUCCESS,
                message: "Password is valid!",
            };
        });
};
