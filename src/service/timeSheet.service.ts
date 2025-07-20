import { and, countDistinct, desc, eq, gte, lte, sql, SQL } from "drizzle-orm";
import {
    db,
    shiftTable,
    staffTable,
    StaffType,
    targetShiftTable,
    timeSheetTable,
    TimeSheetType,
} from "../db";
import { LIMIT, STATUS_CODE } from "../constants";

const timeSheetSelect = {
    id: timeSheetTable.id,
    staffName: staffTable.name,
    shiftName: shiftTable.name,
    date: timeSheetTable.date,
    checkIn: timeSheetTable.checkIn,
    checkOut: timeSheetTable.checkOut,
    workingHours: timeSheetTable.workingHours,
};

export const findAllTimeSheet = async () => {
    return await db
        .select(timeSheetSelect)
        .from(timeSheetTable)
        .leftJoin(staffTable, eq(timeSheetTable.staffId, staffTable.id))
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
        .leftJoin(staffTable, eq(timeSheetTable.staffId, staffTable.id))
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

export const findTimeSheetByStaffId = async (
    id: StaffType["id"],
    query: Record<string, any>,
) => {
    const { startDate, endDate } = query;

    const whereConditions: SQL[] = [];
    if (startDate) {
        whereConditions.push(gte(timeSheetTable.date, startDate));
    }
    if (endDate) {
        whereConditions.push(lte(timeSheetTable.date, endDate));
    }

    const totalCountSubquery = db
        .select({
            targetShiftId: timeSheetTable.targetShiftId,
            cnt: countDistinct(timeSheetTable.staffId).as("cnt"),
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
        .leftJoin(staffTable, eq(timeSheetTable.staffId, staffTable.id))
        .leftJoin(
            targetShiftTable,
            eq(timeSheetTable.targetShiftId, targetShiftTable.id),
        )
        .leftJoin(shiftTable, eq(targetShiftTable.shiftId, shiftTable.id))
        .leftJoin(
            totalCountSubquery,
            eq(totalCountSubquery.targetShiftId, timeSheetTable.targetShiftId),
        )
        .where(and(eq(staffTable.id, id), ...whereConditions))
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
        message: "Get time sheet by staff id successfully!",
        total: data.length,
        totalWorkingHours,
        totalTarget,
        data,
    };
};

export const insertTimeSheet = async (body: TimeSheetType) => {
    return await db
        .insert(timeSheetTable)
        .values(body)
        .returning()
        .then(res => ({
            code: STATUS_CODE.SUCCESS,
            message: "Create time sheet successfully!",
            data: res,
        }));
};

export const updateTimeSheetById = async (id: string, body: TimeSheetType) => {
    return await db
        .update(timeSheetTable)
        .set(body)
        .where(eq(timeSheetTable.id, id))
        .returning()
        .then(res => ({
            code: STATUS_CODE.SUCCESS,
            message: "Update time sheet successfully!",
            data: res,
        }));
};

export const deleteTimeSheetById = async (id: TimeSheetType["id"]) => {
    return await db
        .delete(timeSheetTable)
        .where(eq(timeSheetTable.id, id))
        .returning()
        .then(res => ({
            code: STATUS_CODE.SUCCESS,
            message: "Delete time sheet successfully!",
            data: res,
        }));
};
