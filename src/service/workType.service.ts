import { db, workTypeTable, WorkTypeType } from "../db";
import { STATUS_CODE } from "../constants";
import { asc, eq } from "drizzle-orm";

export const findAllWorkType = async (): Promise<{
    code: number;
    message: string;
    data: WorkTypeType[];
}> => {
    return await db
        .select()
        .from(workTypeTable)
        .orderBy(asc(workTypeTable.name))
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Work Type successfully!",
                data: res,
            };
        });
};

export const findWorkTypeById = async ({ id }: { id: string }) => {
    return await db
        .select()
        .from(workTypeTable)
        .where(eq(workTypeTable.id, id))
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Work Type by Id successfully!",
                data: res[0],
            };
        });
};

export const insertWorkType = async ({ body }: { body: WorkTypeType }) => {
    return await db
        .insert(workTypeTable)
        .values(body)
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Create Work Type successfully!",
                data: res,
            };
        });
};

export const updateWorkTypeById = async ({
    id,
    body,
}: {
    id: string;
    body: WorkTypeType;
}) => {
    return await db
        .update(workTypeTable)
        .set(body)
        .where(eq(workTypeTable.id, id))
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Update Work Type successfully!",
                data: res,
            };
        });
};

export const removeWorkTypeById = async ({ id }: { id: string }) => {
    return await db
        .delete(workTypeTable)
        .where(eq(workTypeTable.id, id))
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Delete Work Type successfully!",
                data: res,
            };
        });
};
