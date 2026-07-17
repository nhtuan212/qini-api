import { asc, eq } from "drizzle-orm";
import { db, employeeTable, EmployeeType } from "../db";
import { STATUS_CODE } from "../constants";

export const findAllEmployee = async () => {
    return await db
        .select()
        .from(employeeTable)
        .orderBy(asc(employeeTable.name))
        .then((res: EmployeeType[]) => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Employee successfully!",
                data: res,
            };
        });
};

export const findEmployeeById = async ({ id }: { id: string }) => {
    return await db.query.employeeTable
        .findFirst({
            where: eq(employeeTable.id, id),
        })
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Employee by Id successfully!",
                data: res,
            };
        });
};

export const insertEmployee = async ({ body }: { body: EmployeeType }) => {
    return await db
        .insert(employeeTable)
        .values(body)
        .returning()
        .then((res: EmployeeType[]) => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Create Employee successfully!",
                data: res,
            };
        });
};

export const updateEmployeeById = async ({
    id,
    body,
}: {
    id: string;
    body: EmployeeType;
}) => {
    return await db
        .update(employeeTable)
        .set({
            ...body,
            updatedAt: new Date().toISOString(),
        })
        .where(eq(employeeTable.id, id))
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Update Employee successfully!",
                data: res[0],
            };
        });
};

export const softDeleteEmployeeById = async ({ id }: { id: string }) => {
    return await db
        .update(employeeTable)
        .set({ isActive: false, updatedAt: new Date().toISOString() })
        .where(eq(employeeTable.id, id))
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Soft Delete Employee successfully!",
                data: res,
            };
        });
};

export const removeEmployeeById = async ({ id }: { id: string }) => {
    return await db
        .delete(employeeTable)
        .where(eq(employeeTable.id, id))
        .returning()
        .then((res: EmployeeType[]) => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Delete Employee successfully!",
                data: res[0],
            };
        });
};
