import {
    date,
    pgTable,
    real,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

export const timeSheetTable = pgTable("time_sheet", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    staffId: uuid("staff_id").notNull(),
    shiftId: uuid("shift_id").notNull(),
    targetShiftId: uuid("target_shift_id").notNull(),
    checkIn: varchar("check_in", { length: 10 }).default(""),
    checkOut: varchar("check_out", { length: 10 }).default(""),
    workingHours: real("working_hours").notNull().default(0),
    date: date("date", { mode: "string" }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
});

export type TimeSheet = typeof timeSheetTable.$inferSelect;
