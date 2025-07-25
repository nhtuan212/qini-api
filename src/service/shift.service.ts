import { db, shiftTable, ShiftType } from "../db";
import { STATUS_CODE } from "../constants";
import { eq } from "drizzle-orm";

export const findAllShift = async () => {
    return await db
        .select()
        .from(shiftTable)
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Shift successfully!",
                data: res,
            };
        });
};

export const insertShift = async ({ body }: { body: ShiftType }) => {
    return await db
        .insert(shiftTable)
        .values(body)
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Create Shift successfully!",
                data: res,
            };
        });
};

export const updateShiftById = async ({
    id,
    body,
}: {
    id: string;
    body: ShiftType;
}) => {
    return await db
        .update(shiftTable)
        .set(body)
        .where(eq(shiftTable.id, id))
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Update Shift successfully!",
                data: res,
            };
        });
};

export const deleteShiftById = async ({ id }: { id: string }) => {
    return await db
        .delete(shiftTable)
        .where(eq(shiftTable.id, id))
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Delete Shift successfully!",
                data: res,
            };
        });
};
