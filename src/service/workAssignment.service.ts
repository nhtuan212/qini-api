import { desc, eq } from "drizzle-orm";
import {
    db,
    staffTable,
    workAssignmentTable,
    WorkAssignmentType,
    workTypeTable,
} from "../db";
import { LIMIT, STATUS_CODE } from "../constants";

const workAssignmentSelect = {
    id: workAssignmentTable.id,
    workTypeId: workAssignmentTable.workTypeId,
    staffId: workAssignmentTable.staffId,

    workTypeName: workTypeTable.name,
    staffName: staffTable.name,

    description: workAssignmentTable.description,
    isCompleted: workAssignmentTable.isCompleted,
    date: workAssignmentTable.date,
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
    return await db
        .insert(workAssignmentTable)
        .values(body)
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Create Work Assignment successfully!",
                data: res,
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
    return await db
        .update(workAssignmentTable)
        .set(body)
        .where(eq(workAssignmentTable.id, id))
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Update Work Assignment successfully!",
                data: res,
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
