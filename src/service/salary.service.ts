import { asc, eq } from "drizzle-orm";
import { db, salaryTable, SalaryType } from "../db";
import { STATUS_CODE } from "../constants";

export const findAllSalary = async () => {
    return await db
        .select()
        .from(salaryTable)
        .orderBy(asc(salaryTable.name))
        .then((res: SalaryType[]) => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Salary successfully!",
                data: res,
            };
        });
};

export const findSalaryById = async ({ id }: { id: string }) => {
    return await db.query.salaryTable
        .findFirst({
            where: eq(salaryTable.id, id),
        })
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Salary by Id successfully!",
                data: res,
            };
        });
};

export const insertSalary = async ({ body }: { body: SalaryType }) => {
    return await db
        .insert(salaryTable)
        .values(body)
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Insert Salary successfully!",
                data: res,
            };
        });
};

export const updateSalaryById = async ({
    id,
    body,
}: {
    id: string;
    body: SalaryType;
}) => {
    return await db
        .update(salaryTable)
        .set(body)
        .where(eq(salaryTable.id, id))
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Update Salary by Id successfully!",
                data: res,
            };
        });
};
