import { and, asc, eq, isNull } from "drizzle-orm";
import { db, employeeTable, EmployeeType, userTable } from "../db";
import { STATUS_CODE } from "../constants";

const employeeWithStatus = {
    id: employeeTable.id,
    userId: employeeTable.userId,
    name: employeeTable.name,
    salary: employeeTable.salary,
    salaryType: employeeTable.salaryType,
    isTarget: employeeTable.isTarget,
    isActive: userTable.isActive,
    createdAt: employeeTable.createdAt,
    updatedAt: employeeTable.updatedAt,
};

export const findAllEmployee = async () => {
    return await db
        .select(employeeWithStatus)
        .from(employeeTable)
        .innerJoin(userTable, eq(employeeTable.userId, userTable.id))
        .where(isNull(userTable.deletedAt))
        .orderBy(asc(employeeTable.name))
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Employee successfully!",
                data: res,
            };
        });
};

export const findEmployeeById = async ({ id }: { id: string }) => {
    return await db
        .select(employeeWithStatus)
        .from(employeeTable)
        .innerJoin(userTable, eq(employeeTable.userId, userTable.id))
        .where(and(eq(employeeTable.id, id), isNull(userTable.deletedAt)))
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Employee by Id successfully!",
                data: res[0],
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
