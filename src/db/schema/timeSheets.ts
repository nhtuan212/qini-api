import { relations } from "drizzle-orm";
import {
    date,
    pgTable,
    real,
    timestamp,
    uuid,
    varchar,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import { targetShiftTable } from "./targetShifts";
import { staffTable } from "./staffs";

export const timeSheetTable = pgTable(
    "time_sheet",
    {
        id: uuid("id").primaryKey().defaultRandom().notNull(),
        targetShiftId: uuid("target_shift_id")
            .notNull()
            .references(() => targetShiftTable.id, {
                onDelete: "cascade",
            }),
        staffId: uuid("staff_id")
            .notNull()
            .references(() => staffTable.id, {
                onDelete: "cascade",
            }),
        checkIn: varchar("check_in", { length: 10 }).default(""),
        checkOut: varchar("check_out", { length: 10 }).default(""),
        workingHours: real("working_hours").notNull().default(0),
        date: date("date", { mode: "string" }),
        createdAt: timestamp("created_at", { precision: 6, mode: "string" })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    },
    table => [
        // UNIQUE CONSTRAINT: 1 employee only has 1 record per shift per day
        uniqueIndex("unique_staff_target_shift_date").on(
            table.staffId,
            table.targetShiftId,
            table.date,
        ),
    ],
);

// 🎯 TIME_SHEET RELATIONS
export const timeSheetRelations = relations(timeSheetTable, ({ one }) => ({
    targetShift: one(targetShiftTable, {
        fields: [timeSheetTable.targetShiftId],
        references: [targetShiftTable.id],
    }),
    staff: one(staffTable, {
        fields: [timeSheetTable.staffId],
        references: [staffTable.id],
    }),
}));

export type TimeSheetType = typeof timeSheetTable.$inferSelect;
