import { and, asc, eq, gte, lte, SQL } from "drizzle-orm";
import { db, salaryTable, SalaryType, staffTable, StaffType } from "../db";
import { calculateTotalSalary } from "../utils";
import { LIMIT, STATUS_CODE } from "../constants";

type SalaryWithStaff = SalaryType & {
    staffName?: StaffType["name"];
    salaryType?: StaffType["salaryType"];
};

const formatResponse = (res: SalaryWithStaff[]) => {
    const result = res.map(item => ({
        ...item,
        total: item.salary * item.workingHours + item.target + item.bonus,

        ...(item.salaryType === "MONTHLY" && {
            total: calculateTotalSalary({
                salary: item.salary,
                paidLeave: Number(item.paidLeave) || 0,
                workingMonth: item.workingMonth,
                workingDay: item.workingDay,
                workingHours: item.workingHours,
                lunchAllowancePerDay: item.lunchAllowancePerDay,
                gasolineAllowancePerDay: item.gasolineAllowancePerDay,
                bonus: item.bonus,
            }),
        }),
    }));

    return result;
};

const salaryWithStaffSelect = {
    id: salaryTable.id,
    staffName: staffTable.name,
    name: salaryTable.name,
    salary: salaryTable.salary,
    salaryType: staffTable.salaryType,

    // HOURLY
    workingHours: salaryTable.workingHours,
    target: salaryTable.target,
    bonus: salaryTable.bonus,

    // MONTHLY
    workingMonth: salaryTable.workingMonth,
    workingDay: salaryTable.workingDay,
    lunchAllowancePerDay: salaryTable.lunchAllowancePerDay,
    gasolineAllowancePerDay: salaryTable.gasolineAllowancePerDay,
    paidLeave: salaryTable.paidLeave,

    description: salaryTable.description,
    startDate: salaryTable.startDate,
    endDate: salaryTable.endDate,
};

export const findAllSalary = async ({
    query,
}: {
    query: Record<string, any>;
}) => {
    const { page = 1, pageSize = LIMIT, startDate, endDate } = query;
    const offset = (page - 1) * pageSize;

    const whereConditions: SQL[] = [];
    if (startDate) {
        whereConditions.push(gte(salaryTable.startDate, startDate));
    }
    if (endDate) {
        whereConditions.push(lte(salaryTable.endDate, endDate));
    }

    return await db
        .select(salaryWithStaffSelect)
        .from(salaryTable)
        .leftJoin(staffTable, eq(salaryTable.staffId, staffTable.id))
        .where(and(...whereConditions))
        .orderBy(asc(staffTable.name))
        .limit(Number(pageSize))
        .offset(Number(offset))
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Salary successfully!",
                data: formatResponse(res as SalaryWithStaff[]),
                total: res.length,
                pagination: { page, pageSize },
            };
        });
};

export const findSalaryByStaffId = async ({
    id,
    query,
}: {
    id: string;
    query: Record<string, any>;
}) => {
    const { page = 1, pageSize = LIMIT } = query;
    const offset = (page - 1) * pageSize;

    return await db
        .select(salaryWithStaffSelect)
        .from(salaryTable)
        .leftJoin(staffTable, eq(salaryTable.staffId, staffTable.id))
        .where(eq(salaryTable.staffId, id))
        .orderBy(asc(staffTable.name))
        .limit(Number(pageSize))
        .offset(Number(offset))
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Salary by Staff Id successfully!",
                data: formatResponse(res as SalaryWithStaff[]),
                total: res.length,
                pagination: { page, pageSize },
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
                message: "Create Salary successfully!",
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
    return await db.transaction(async tx => {
        await tx.update(salaryTable).set(body).where(eq(salaryTable.id, id));

        const updatedSalary = (await tx.query.salaryTable.findFirst({
            with: { staff: true },
            where: eq(salaryTable.id, id),
        })) as SalaryWithStaff;

        return {
            code: STATUS_CODE.SUCCESS,
            message: "Update Salary by Id successfully!",
            data: formatResponse([updatedSalary])[0],
        };
    });
};

export const deleteSalaryById = async ({ id }: { id: string }) => {
    return await db
        .delete(salaryTable)
        .where(eq(salaryTable.id, id))
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Delete Salary by Id successfully!",
                data: res,
            };
        });
};
