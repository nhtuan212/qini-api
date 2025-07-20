import {
    db,
    shiftTable,
    targetShiftTable,
    targetTable,
    TargetType,
} from "../db";
import { and, desc, eq, gte, inArray, lte, sql, asc, SQL } from "drizzle-orm";
import { LIMIT, STATUS_CODE } from "../constants";
import { timeSheetTable } from "../db/schema/timeSheets";
import { staffTable } from "../db/schema/staffs";

export const findAllTarget = async (query: Record<string, any>) => {
    const { page = 1, pageSize = LIMIT, startDate, endDate } = query;
    const offset = (page - 1) * pageSize;

    try {
        // STEP 1: Get targets
        const baseTargetsQuery = db
            .select({
                id: targetTable.id,
                name: targetTable.name,
                targetAt: targetTable.targetAt,
                createdAt: targetTable.createdAt,
                updatedAt: targetTable.updatedAt,

                // Total
                totalRevenue:
                    sql<number>`coalesce(sum(${targetShiftTable.revenue}), 0)`.as(
                        "totalRevenue",
                    ),
                totalCash:
                    sql<number>`coalesce(sum(${targetShiftTable.cash}), 0)`.as(
                        "totalCash",
                    ),
                totalTransfer:
                    sql<number>`coalesce(sum(${targetShiftTable.transfer}), 0)`.as(
                        "totalTransfer",
                    ),
                totalDeduction:
                    sql<number>`coalesce(sum(${targetShiftTable.deduction}), 0)`.as(
                        "totalDeduction",
                    ),
                totalPoint:
                    sql<number>`coalesce(sum(${targetShiftTable.point}), 0)`.as(
                        "totalPoint",
                    ),
            })
            .from(targetTable)
            .leftJoin(
                targetShiftTable,
                eq(targetTable.id, targetShiftTable.targetId),
            )
            .groupBy(
                targetTable.id,
                targetTable.name,
                targetTable.targetAt,
                targetTable.createdAt,
                targetTable.updatedAt,
            );

        // Apply filters
        const whereConditions: SQL[] = [];
        if (startDate) {
            whereConditions.push(
                gte(targetTable.targetAt, new Date(startDate).toISOString()),
            );
        }
        if (endDate) {
            whereConditions.push(
                lte(targetTable.targetAt, new Date(endDate).toISOString()),
            );
        }

        // Build final query
        const targetsQuery =
            whereConditions.length > 0
                ? baseTargetsQuery.where(and(...whereConditions))
                : baseTargetsQuery;
        if (whereConditions.length <= 0) {
            targetsQuery.limit(LIMIT);
            targetsQuery.offset(offset);
        }
        targetsQuery.orderBy(desc(targetTable.targetAt));

        const targets = await targetsQuery;

        if (targets.length === 0) {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Target successfully!",
                data: [],
                total: 0,
                pagination: { page, pageSize },
            };
        }

        // STEP 2: Get targetShifts
        const targetIds = targets.map(t => t.id);

        const targetShiftsWithShifts = await db
            .select({
                id: targetShiftTable.id,
                targetId: targetShiftTable.targetId,
                shiftId: targetShiftTable.shiftId,
                revenue: targetShiftTable.revenue,
                cash: targetShiftTable.cash,
                transfer: targetShiftTable.transfer,
                point: targetShiftTable.point,
                deduction: targetShiftTable.deduction,
                description: targetShiftTable.description,
                createdAt: targetShiftTable.createdAt,
                updatedAt: targetShiftTable.updatedAt,

                // Shift data
                shiftName: shiftTable.name,
                startTime: shiftTable.startTime,
                endTime: shiftTable.endTime,
                kiotId: shiftTable.kiotId,
                shiftIsTarget: shiftTable.isTarget,
            })
            .from(targetShiftTable)
            .leftJoin(shiftTable, eq(targetShiftTable.shiftId, shiftTable.id))
            .where(inArray(targetShiftTable.targetId, targetIds))
            .orderBy(desc(shiftTable.isTarget), asc(shiftTable.startTime));

        // STEP 3: Get timeSheets
        const targetShiftIds = targetShiftsWithShifts.map(ts => ts.id);
        let timeSheetsWithStaff: Array<{
            id: string;
            targetShiftId: string;
            staffId: string;
            checkIn: string | null;
            checkOut: string | null;
            workingHours: number | null;
            createdAt: string;
            updatedAt: string | null;
            staffName: string | null;
        }> = [];

        if (targetShiftIds.length > 0) {
            timeSheetsWithStaff = await db
                .select({
                    id: timeSheetTable.id,
                    targetShiftId: timeSheetTable.targetShiftId,
                    staffId: timeSheetTable.staffId,
                    checkIn: timeSheetTable.checkIn,
                    checkOut: timeSheetTable.checkOut,
                    workingHours: timeSheetTable.workingHours,
                    createdAt: timeSheetTable.createdAt,
                    updatedAt: timeSheetTable.updatedAt,
                    staffName: staffTable.name,
                })
                .from(timeSheetTable)
                .leftJoin(staffTable, eq(timeSheetTable.staffId, staffTable.id))
                .where(inArray(timeSheetTable.targetShiftId, targetShiftIds))
                .orderBy(asc(timeSheetTable.checkIn));
        }

        // STEP 4: Group data efficiently
        const timeSheetsMap = new Map();

        timeSheetsWithStaff.forEach(ts => {
            const key = ts.targetShiftId;
            if (!timeSheetsMap.has(key)) {
                timeSheetsMap.set(key, []);
            }

            const timeSheetData = {
                id: ts.id,
                staffId: ts.staffId,
                checkIn: ts.checkIn,
                checkOut: ts.checkOut,
                workingHours: ts.workingHours,
                staffName: ts.staffName,
            };

            timeSheetsMap.get(key)!.push(timeSheetData);
        });

        const targetShiftsMap = new Map();

        targetShiftsWithShifts.forEach(ts => {
            const key = ts.targetId;
            if (!targetShiftsMap.has(key)) {
                targetShiftsMap.set(key, []);
            }

            const targetShiftData = {
                id: ts.id,
                shiftId: ts.shiftId,
                revenue: ts.revenue,
                cash: ts.cash,
                transfer: ts.transfer,
                point: ts.point,
                deduction: ts.deduction,
                description: ts.description,
                shiftName: ts.shiftName,
                startTime: ts.startTime,
                endTime: ts.endTime,
                kiotId: ts.kiotId,
                timeSheets: timeSheetsMap.get(ts.id) || [],
            };

            targetShiftsMap.get(key)!.push(targetShiftData);
        });

        // STEP 5: Get result
        const result = targets.map(target => ({
            id: target.id,
            name: target.name,
            targetAt: target.targetAt,
            createdAt: target.createdAt,
            updatedAt: target.updatedAt,

            // Use pre-computed database totals
            revenue: Number(target.totalRevenue ?? 0),
            cash: Number(target.totalCash ?? 0),
            transfer: Number(target.totalTransfer ?? 0),
            deduction: Number(target.totalDeduction ?? 0),
            point: Number(target.totalPoint ?? 0),
            targetShifts: targetShiftsMap.get(target.id) || [],
        }));

        return {
            code: STATUS_CODE.SUCCESS,
            message: "Get Target successfully!",
            data: result,
            total: result.length,
            pagination: {
                page,
                pageSize,
            },
        };
    } catch (error: unknown) {
        console.error("Error fetching targets:", error);

        const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred";

        return {
            code: STATUS_CODE.ERROR,
            message: `Failed to get targets: ${errorMessage}`,
            data: [],
            total: 0,
            pagination: { page, pageSize },
        };
    }
};

export const findTargetById = async ({ id }: { id: string }) => {
    return await db
        .select()
        .from(targetTable)
        .where(eq(targetTable.id, id))
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Get Target by Id successfully!",
                data: res,
            };
        });
};

export const insertTarget = async ({ body }: { body: TargetType }) => {
    return await db
        .insert(targetTable)
        .values(body)
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Insert Target successfully!",
                data: res,
            };
        });
};

export const updateTargetById = async ({
    id,
    body,
}: {
    id: string;
    body: TargetType;
}) => {
    return await db
        .update(targetTable)
        .set(body)
        .where(eq(targetTable.id, id))
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Update Target by Id successfully!",
                data: res,
            };
        });
};

export const removeTargetById = async ({ id }: { id: string }) => {
    return await db
        .delete(targetTable)
        .where(eq(targetTable.id, id))
        .returning()
        .then(res => {
            return {
                code: STATUS_CODE.SUCCESS,
                message: "Delete Target by Id successfully!",
                data: res,
            };
        });
};

// export const findAllTargetWithRelations = async () => {
//     const targets = await db.query.targetTable.findMany({
//         columns: {
//             id: true,
//             name: true,
//             targetAt: true,
//         },
//         with: {
//             targetShifts: {
//                 columns: {
//                     id: true,
//                     shiftId: true,
//                     revenue: true,
//                     cash: true,
//                     transfer: true,
//                     point: true,
//                     deduction: true,
//                     description: true,
//                 },
//                 with: {
//                     shift: {
//                         columns: {
//                             kiotId: true,
//                             name: true,
//                             startTime: true,
//                             endTime: true,
//                         },
//                     },
//                     timeSheets: {
//                         columns: {
//                             id: true,
//                             staffId: true,
//                             checkIn: true,
//                             checkOut: true,
//                             workingHours: true,
//                         },
//                         with: {
//                             staff: {
//                                 columns: {
//                                     name: true,
//                                 },
//                             },
//                         },
//                     },
//                 },
//             },
//         },
//         orderBy: [desc(targetTable.targetAt)],
//         limit: LIMIT,
//     });

//     // Transform to match Prisma structure
//     const result = targets.map(target => {
//         const { targetShifts, ...rest } = target;

//         return {
//             ...rest,

//             revenue: targetShifts.reduce((acc, ts) => acc + ts.revenue, 0),
//             cash: targetShifts.reduce((acc, ts) => acc + ts.cash, 0),
//             transfer: targetShifts.reduce((acc, ts) => acc + ts.transfer, 0),
//             deduction: targetShifts.reduce((acc, ts) => acc + ts.deduction, 0),
//             point: targetShifts.reduce((acc, ts) => acc + ts.point, 0),

//             targetShifts: targetShifts.map(ts => {
//                 const { shift, timeSheets, ...rest } = ts;

//                 return {
//                     ...rest,

//                     shiftName: shift?.name,
//                     startTime: shift?.startTime,
//                     endTime: shift?.endTime,

//                     timeSheets: timeSheets.map(timeSheet => {
//                         const { staff, ...rest } = timeSheet;

//                         return {
//                             ...rest,
//                             staffName: staff?.name,
//                         };
//                     }),
//                 };
//             }),
//         };
//     });

//     return {
//         code: STATUS_CODE.SUCCESS,
//         message: "Get Target successfully!",
//         data: result,
//         total: result.length,
//     };
// };
