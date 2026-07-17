import { and, countDistinct, desc, eq, gte, lte, sql, SQL } from "drizzle-orm";
import {
    db,
    shiftTable,
    employeeTable,
    targetShiftTable,
    timeSheetTable,
    TimeSheetType,
    UserType,
} from "../db";
import { LIMIT, STATUS_CODE } from "../constants";
import { getDateRange, getDefaultTargetAt } from "../utils";

export type InsertTimeSheetBody = {
    userId: string; // the person (user.id, matches the JWT id)
    targetShiftId: string; // the target shift this session belongs to
    checkIn?: string; // "HH:mm", default ""
    checkOut?: string; // "HH:mm", default ""
    workingHours?: number; // default 0
    date?: string; // "YYYY-MM-DD", default = today's target date
};

const timeSheetSelect = {
    id: timeSheetTable.id,
    userId: timeSheetTable.userId,
    shiftId: shiftTable.id,
    targetShiftId: timeSheetTable.targetShiftId,
    shiftName: shiftTable.name,
    date: timeSheetTable.date,
    checkIn: timeSheetTable.checkIn,
    checkOut: timeSheetTable.checkOut,
    workingHours: timeSheetTable.workingHours,
};

const getTimeSheetsWithRelations = async (
    whereCondition: any,
): Promise<any> => {
    return await db
        .select({
            id: timeSheetTable.id,
            userId: timeSheetTable.userId,
            shiftId: shiftTable.id,
            targetShiftId: timeSheetTable.targetShiftId,
            date: timeSheetTable.date,
            checkIn: timeSheetTable.checkIn,
            checkOut: timeSheetTable.checkOut,
            workingHours: timeSheetTable.workingHours,
            shiftName: shiftTable.name,
            name: employeeTable.name,
        })
        .from(timeSheetTable)
        .leftJoin(
            employeeTable,
            eq(timeSheetTable.userId, employeeTable.userId),
        )
        .leftJoin(
            targetShiftTable,
            eq(timeSheetTable.targetShiftId, targetShiftTable.id),
        )
        .leftJoin(shiftTable, eq(targetShiftTable.shiftId, shiftTable.id))
        .where(whereCondition);
};

export const findAllTimeSheet = async () => {
    return await db
        .select(timeSheetSelect)
        .from(timeSheetTable)
        .leftJoin(
            employeeTable,
            eq(timeSheetTable.userId, employeeTable.userId),
        )
        .leftJoin(
            targetShiftTable,
            eq(timeSheetTable.targetShiftId, targetShiftTable.id),
        )
        .leftJoin(shiftTable, eq(targetShiftTable.shiftId, shiftTable.id))
        .then(res => ({
            code: STATUS_CODE.SUCCESS,
            message: "Get time sheet successfully!",
            data: res,
        }));
};

export const findTimeSheetById = async (id: TimeSheetType["id"]) => {
    return await db
        .select({
            ...timeSheetSelect,
            target: targetShiftTable.revenue,
            totalWorkingHours: sql<number>`SUM(${timeSheetTable.workingHours})`,
        })
        .from(timeSheetTable)
        .leftJoin(
            employeeTable,
            eq(timeSheetTable.userId, employeeTable.userId),
        )
        .leftJoin(
            targetShiftTable,
            eq(timeSheetTable.targetShiftId, targetShiftTable.id),
        )
        .leftJoin(shiftTable, eq(targetShiftTable.shiftId, shiftTable.id))
        .groupBy(timeSheetTable.id)
        .where(eq(timeSheetTable.id, id))
        .then(res => ({
            code: STATUS_CODE.SUCCESS,
            message: "Get time sheet by id successfully!",
            data: res,
        }));
};

export const findTimeSheetByUserId = async (
    id: UserType["id"],
    query: Record<string, any>,
) => {
    const { startDate, endDate } = getDateRange(query.startDate, query.endDate);

    const whereConditions: SQL[] = [];
    if (id) {
        whereConditions.push(eq(timeSheetTable.userId, id));
    }

    whereConditions.push(gte(timeSheetTable.date, startDate));
    whereConditions.push(lte(timeSheetTable.date, endDate));

    const employeeInfo = await db.query.employeeTable.findFirst({
        where: eq(employeeTable.userId, id),
    });

    const totalCountSubquery = db
        .select({
            targetShiftId: timeSheetTable.targetShiftId,
            cnt: countDistinct(timeSheetTable.userId).as("cnt"),
        })
        .from(timeSheetTable)
        .groupBy(timeSheetTable.targetShiftId)
        .as("total_cnt");

    const timeSheetQuery = db
        .select({
            ...timeSheetSelect,
            target: sql<number>`
                COALESCE(
                    FLOOR(${targetShiftTable.revenue}::numeric / NULLIF(${totalCountSubquery.cnt}::numeric, 0)), 0
                )
            `,
        })
        .from(timeSheetTable)
        .leftJoin(
            targetShiftTable,
            eq(timeSheetTable.targetShiftId, targetShiftTable.id),
        )
        .leftJoin(shiftTable, eq(targetShiftTable.shiftId, shiftTable.id))
        .leftJoin(
            totalCountSubquery,
            eq(totalCountSubquery.targetShiftId, timeSheetTable.targetShiftId),
        )
        .where(and(...whereConditions))
        .orderBy(desc(timeSheetTable.date));

    if (!startDate && !endDate) {
        timeSheetQuery.limit(LIMIT);
    }

    const data = await timeSheetQuery;

    const totalWorkingHours = data.reduce(
        (sum, row) => sum + (Number(row.workingHours) || 0),
        0,
    );
    const totalTarget = data.reduce(
        (sum, row) => sum + (Number(row.target) || 0),
        0,
    );

    return {
        code: STATUS_CODE.SUCCESS,
        message: "Get time sheet by user id successfully!",
        name: employeeInfo?.name,
        salary: employeeInfo?.salary,
        total: data.length,
        totalWorkingHours,
        totalTarget,
        data,
    };
};

export const insertTimeSheet = async (body: InsertTimeSheetBody) => {
    if (!body?.userId || !body?.targetShiftId) {
        return {
            code: STATUS_CODE.BAD_REQUEST,
            message:
                "Missing required field(s): userId or targetShiftId are required.",
            data: null,
        };
    }

    const insertData = {
        ...body,
        workingHours: body.workingHours || 0,
        date: body.date || getDefaultTargetAt().toISOString(),
    };

    try {
        const inserted = await db
            .insert(timeSheetTable)
            .values(insertData)
            .onConflictDoNothing()
            .returning({ id: timeSheetTable.id });

        if (inserted.length === 0) {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "No new TimeSheet created (duplicate skipped)",
                data: {},
            };
        }

        const result = await getTimeSheetsWithRelations(
            eq(timeSheetTable.id, inserted[0].id),
        );

        return {
            code: STATUS_CODE.SUCCESS,
            message: "Create TimeSheet success!",
            data: result[0],
        };
    } catch (error) {
        // Drizzle wraps the DB error; the real Postgres error is on `.cause`
        // (code/detail). Surface that instead of the opaque "Failed query: ...".
        const pgError = ((error as any)?.cause ?? error) as {
            code?: string;
            detail?: string;
            message?: string;
        };

        // 23503 = foreign_key_violation: userId/targetShiftId points to a row
        // that doesn't exist.
        if (pgError?.code === "23503") {
            return {
                code: STATUS_CODE.BAD_REQUEST,
                message:
                    pgError.detail ?? "userId or targetShiftId does not exist.",
                data: null,
            };
        }

        return {
            code: STATUS_CODE.BAD_REQUEST,
            message:
                pgError?.detail ??
                pgError?.message ??
                "Failed to create TimeSheet.",
            data: null,
        };
    }
};

export const updateTimeSheetById = async (id: string, body: TimeSheetType) => {
    const updated = await db
        .update(timeSheetTable)
        .set(body)
        .where(eq(timeSheetTable.id, id))
        .returning({ id: timeSheetTable.id });

    if (updated.length === 0) {
        return {
            code: STATUS_CODE.NOT_FOUND,
            message: "TimeSheet not found",
            data: null,
        };
    }

    const result = await getTimeSheetsWithRelations(
        eq(timeSheetTable.id, updated[0].id),
    );

    return {
        code: STATUS_CODE.SUCCESS,
        message: "Update TimeSheet success!",
        data: result[0],
    };
};

export const deleteTimeSheetById = async (id: TimeSheetType["id"]) => {
    return await db
        .delete(timeSheetTable)
        .where(eq(timeSheetTable.id, id))
        .returning()
        .then(res => ({
            code: STATUS_CODE.SUCCESS,
            message: "Delete time sheet successfully!",
            data: res[0],
        }));
};
