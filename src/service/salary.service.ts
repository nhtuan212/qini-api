import { and, asc, desc, eq, gte, lt, lte, SQL } from "drizzle-orm";
import dayjs from "dayjs";
import {
    db,
    salaryTable,
    SalaryType,
    employeeTable,
    EmployeeType,
} from "../db";
import { calculateTotalSalary } from "../utils";
import { LIMIT, STATUS_CODE } from "../constants";

type SalaryWithEmployee = SalaryType & {
    employeeName?: EmployeeType["name"];
    salaryType?: EmployeeType["salaryType"];
};

const formatResponse = (res: SalaryWithEmployee[]) => {
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

const salaryWithEmployeeSelect = {
    id: salaryTable.id,
    employeeName: employeeTable.name,
    name: salaryTable.name,
    salary: salaryTable.salary,
    salaryType: employeeTable.salaryType,

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
    let periodStartDate: string | null = null;
    let periodEndDate: string | null = null;

    if (startDate || endDate) {
        if (startDate) {
            whereConditions.push(gte(salaryTable.startDate, startDate));
        }
        if (endDate) {
            whereConditions.push(lte(salaryTable.endDate, endDate));
        }
        periodStartDate = startDate ?? null;
        periodEndDate = endDate ?? null;
    } else {
        // Default: only show the month of the most recent salary period
        const [latest] = await db
            .select({ startDate: salaryTable.startDate })
            .from(salaryTable)
            .orderBy(desc(salaryTable.startDate))
            .limit(1);

        if (!latest) {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Salary successfully!",
                data: [],
                startDate: null,
                endDate: null,
                totalAmount: 0,
                total: 0,
                pagination: { page, pageSize },
            };
        }

        const latestMonth = dayjs(latest.startDate);
        const monthStart = latestMonth.startOf("month").format("YYYY-MM-DD");
        const monthEnd = latestMonth.endOf("month").format("YYYY-MM-DD");
        const nextMonthStart = latestMonth
            .add(1, "month")
            .startOf("month")
            .format("YYYY-MM-DD");

        whereConditions.push(gte(salaryTable.startDate, monthStart));
        whereConditions.push(lt(salaryTable.startDate, nextMonthStart));
        periodStartDate = monthStart;
        periodEndDate = monthEnd;
    }

    const res = await db
        .select(salaryWithEmployeeSelect)
        .from(salaryTable)
        .leftJoin(employeeTable, eq(salaryTable.userId, employeeTable.userId))
        .where(and(...whereConditions))
        .orderBy(desc(salaryTable.startDate), asc(employeeTable.name));

    const allData = formatResponse(res as SalaryWithEmployee[]);
    const data = allData.slice(
        Number(offset),
        Number(offset) + Number(pageSize),
    );

    return {
        code: STATUS_CODE.SUCCESS,
        message: "Get Salary successfully!",
        data,
        startDate: periodStartDate,
        endDate: periodEndDate,
        // Sum over every record matching the filter, not just the current page
        totalAmount: allData.reduce((sum, item) => sum + item.total, 0),
        total: data.length,
        pagination: { page, pageSize },
    };
};

export const findSalaryByUserId = async ({
    id,
    query,
}: {
    id: string;
    query: Record<string, any>;
}) => {
    const { page = 1, pageSize = LIMIT } = query;
    const offset = (page - 1) * pageSize;

    const res = await db
        .select(salaryWithEmployeeSelect)
        .from(salaryTable)
        .leftJoin(employeeTable, eq(salaryTable.userId, employeeTable.userId))
        .where(eq(salaryTable.userId, id))
        .orderBy(desc(salaryTable.startDate));

    const allData = formatResponse(res as SalaryWithEmployee[]);
    const data = allData.slice(
        Number(offset),
        Number(offset) + Number(pageSize),
    );

    return {
        code: STATUS_CODE.SUCCESS,
        message: "Get Salary by User Id successfully!",
        data,
        startDate: null as string | null,
        endDate: null as string | null,
        totalAmount: allData.reduce((sum, item) => sum + item.total, 0),
        total: data.length,
        pagination: { page, pageSize },
    };
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

        const [updatedSalary] = await tx
            .select(salaryWithEmployeeSelect)
            .from(salaryTable)
            .leftJoin(
                employeeTable,
                eq(salaryTable.userId, employeeTable.userId),
            )
            .where(eq(salaryTable.id, id));

        return {
            code: STATUS_CODE.SUCCESS,
            message: "Update Salary by Id successfully!",
            data: formatResponse([updatedSalary as SalaryWithEmployee])[0],
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
