import { desc, eq } from "drizzle-orm";
import {
    db,
    shiftTable,
    staffTable,
    workAssignmentTable,
    WorkAssignmentType,
    workTypeTable,
} from "../db";
import { LIMIT, STATUS_CODE } from "../constants";

const workAssignmentSelect = {
    id: workAssignmentTable.id,
    workTypeId: workAssignmentTable.workTypeId,
    shiftId: workAssignmentTable.shiftId,
    staffId: workAssignmentTable.staffId,

    workTypeName: workTypeTable.name,
    staffName: staffTable.name,
    shiftName: shiftTable.name,

    description: workAssignmentTable.description,
    isCompleted: workAssignmentTable.isCompleted,
    date: workAssignmentTable.date,
    updatedAt: workAssignmentTable.updatedAt,
};

export const findAllWorkAssignment = async ({
    query,
}: {
    query: Record<string, any>;
}) => {
    const { page = 1, pageSize = LIMIT } = query;
    const offset = (page - 1) * pageSize;

    return await db
        .select(workAssignmentSelect)
        .from(workAssignmentTable)
        .orderBy(desc(workAssignmentTable.createdAt))
        .leftJoin(
            workTypeTable,
            eq(workAssignmentTable.workTypeId, workTypeTable.id),
        )
        .leftJoin(shiftTable, eq(workAssignmentTable.shiftId, shiftTable.id))
        .leftJoin(staffTable, eq(workAssignmentTable.staffId, staffTable.id))
        .limit(Number(pageSize))
        .offset(Number(offset))
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Work Assignment successfully!",
                data: res,
                total: res.length,
                pagination: { page, pageSize },
            };
        });
};

export const findWorkAssignmentById = async ({ id }: { id: string }) => {
    return await db
        .select(workAssignmentSelect)
        .from(workAssignmentTable)
        .leftJoin(
            workTypeTable,
            eq(workAssignmentTable.workTypeId, workTypeTable.id),
        )
        .leftJoin(shiftTable, eq(workAssignmentTable.shiftId, shiftTable.id))
        .leftJoin(staffTable, eq(workAssignmentTable.staffId, staffTable.id))
        .where(eq(workAssignmentTable.id, id))
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Work Assignment by Id successfully!",
                data: res[0],
                total: res.length,
                pagination: { page: 1, pageSize: 1 },
            };
        });
};

export const insertWorkAssignment = async ({
    body,
}: {
    body: WorkAssignmentType;
}) => {
    const insertedData = await db
        .insert(workAssignmentTable)
        .values(body)
        .returning();

    return await db
        .select(workAssignmentSelect)
        .from(workAssignmentTable)
        .leftJoin(
            workTypeTable,
            eq(workAssignmentTable.workTypeId, workTypeTable.id),
        )
        .leftJoin(shiftTable, eq(workAssignmentTable.shiftId, shiftTable.id))
        .leftJoin(staffTable, eq(workAssignmentTable.staffId, staffTable.id))
        .where(eq(workAssignmentTable.id, insertedData[0].id))
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Create Work Assignment successfully!",
                data: res[0],
            };
        });
};

export const updateWorkAssignmentById = async ({
    id,
    body,
}: {
    id: string;
    body: WorkAssignmentType;
}) => {
    const updatedData = await db
        .update(workAssignmentTable)
        .set({
            ...body,
            ...(body.isCompleted && { updatedAt: new Date().toISOString() }),
        })
        .where(eq(workAssignmentTable.id, id))
        .returning();

    return await db
        .select(workAssignmentSelect)
        .from(workAssignmentTable)
        .leftJoin(
            workTypeTable,
            eq(workAssignmentTable.workTypeId, workTypeTable.id),
        )
        .leftJoin(shiftTable, eq(workAssignmentTable.shiftId, shiftTable.id))
        .leftJoin(staffTable, eq(workAssignmentTable.staffId, staffTable.id))
        .where(eq(workAssignmentTable.id, updatedData[0].id))
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Update Work Assignment successfully!",
                data: res[0],
            };
        });
};

export const removeWorkAssignmentById = async ({ id }: { id: string }) => {
    return await db
        .delete(workAssignmentTable)
        .where(eq(workAssignmentTable.id, id))
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Delete Work Assignment successfully!",
                data: res,
            };
        });
};
