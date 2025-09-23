import { and, asc, eq, gte, lte, SQL } from "drizzle-orm";
import { db, salaryTable, SalaryType, StaffType } from "../db";
import { LIMIT, STATUS_CODE } from "../constants";

type SalaryWithStaff = SalaryType & { staff: StaffType };

const formatResponse = (res: SalaryWithStaff[]) => {
    return res.map(({ staff, ...item }) => ({
        ...item,
        staffName: staff?.name,
        totalSalary: item.salary * item.workingHours + item.target + item.bonus,
    }));
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

    return await db.query.salaryTable
        .findMany({
            with: {
                staff: true,
            },
            orderBy: asc(salaryTable.name),
            limit: Number(pageSize),
            offset: Number(offset),
            where: and(...whereConditions),
        })
        .then((res: SalaryWithStaff[]) => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Salary successfully!",
                data: formatResponse(res),
                total: res.length,
                pagination: {
                    page,
                    pageSize,
                },
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

    const salary = await db.query.salaryTable.findMany({
        with: { staff: true },
        where: eq(salaryTable.staffId, id),
        limit: pageSize as never,
        offset: offset,
    });

    return {
        code: STATUS_CODE.SUCCESS,
        message: "Get Salary by Staff Id successfully!",
        data: salary ? formatResponse(salary) : [],
        total: 1,
        pagination: {
            page,
            pageSize,
        },
    };
};

export const insertSalary = async ({ body }: { body: SalaryType }) => {
    return await db.transaction(async tx => {
        const [insertedSalary] = await tx
            .insert(salaryTable)
            .values(body)
            .returning();

        const salaryWithStaff = (await tx.query.salaryTable.findFirst({
            with: { staff: true },
            where: eq(salaryTable.id, insertedSalary.id),
        })) as SalaryWithStaff;

        return {
            code: STATUS_CODE.SUCCESS,
            message: "Insert Salary successfully!",
            data: formatResponse([salaryWithStaff])[0],
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
