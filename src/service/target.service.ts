import { db, targetTable, TargetType } from "../db";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { STATUS_CODE } from "../constants";

export const findAllTarget = async () => {
    return await db
        .select()
        .from(targetTable)
        .orderBy(desc(targetTable.targetAt))
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Target successfully!",
                data: res,
            };
        });
};

export const findTargetById = async ({ id }: { id: string }) => {
    return await db
        .select()
        .from(targetTable)
        .where(eq(targetTable.id, id))
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Target by Id successfully!",
                data: res,
            };
        });
};

export const findTargetWithFilter = async ({
    startDate,
    endDate,
}: {
    startDate: Date | null;
    endDate: Date | null;
}) => {
    return await db
        .select()
        .from(targetTable)
        .orderBy(desc(targetTable.targetAt))
        .where(
            and(
                gte(targetTable.targetAt, startDate?.toISOString() || ""),
                lte(targetTable.targetAt, endDate?.toISOString() || ""),
            ),
        )
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Target with filter successfully!",
                data: res,
            };
        });
};

export const insertTarget = async ({ body }: { body: TargetType }) => {
    return await db
        .insert(targetTable)
        .values(body)
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Insert Target successfully!",
                data: res,
            };
        });
};

export const updateTargetById = async ({
    id,
    body,
}: {
    id: string;
    body: TargetType;
}) => {
    return await db
        .update(targetTable)
        .set(body)
        .where(eq(targetTable.id, id))
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Update Target by Id successfully!",
                data: res,
            };
        });
};

export const removeTargetById = async ({ id }: { id: string }) => {
    return await db
        .delete(targetTable)
        .where(eq(targetTable.id, id))
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Delete Target by Id successfully!",
                data: res,
            };
        });
};
