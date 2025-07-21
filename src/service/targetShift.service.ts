import { desc, eq } from "drizzle-orm";
import { db, targetShiftTable, TargetShiftType } from "../db";
import { LIMIT, STATUS_CODE } from "../constants";

export const findAllTargetShift = async () => {
    return await db
        .select()
        .from(targetShiftTable)
        .orderBy(desc(targetShiftTable.createdAt))
        .limit(LIMIT)
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Target Shift successfully!",
                data: res,
            };
        });
};

export const findTargetShiftById = async ({ id }: { id: string }) => {
    return await db
        .select()
        .from(targetShiftTable)
        .where(eq(targetShiftTable.id, id))
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Target Shift successfully!",
                data: res,
            };
        });
};

export const insertTargetShift = async ({
    body,
}: {
    body: TargetShiftType;
}) => {
    return await db
        .insert(targetShiftTable)
        .values(body)
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Insert Target Shift successfully!",
                data: res,
            };
        });
};

export const updateTargetShiftById = async ({
    id,
    body,
}: {
    id: string;
    body: TargetShiftType;
}) => {
    return await db
        .update(targetShiftTable)
        .set(body)
        .where(eq(targetShiftTable.id, id))
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Update Target Shift successfully!",
                data: res[0],
            };
        });
};

export const deleteTargetShiftById = async ({ id }: { id: string }) => {
    return await db
        .delete(targetShiftTable)
        .where(eq(targetShiftTable.id, id))
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Delete Target Shift successfully!",
                data: res,
            };
        });
};
