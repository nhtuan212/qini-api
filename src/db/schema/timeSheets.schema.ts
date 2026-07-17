import { relations } from "drizzle-orm";
import {
    date,
    pgTable,
    real,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { targetShiftTable } from "./targetShifts.schema";
import { userTable } from "./users.schema";

export const timeSheetTable = pgTable(
    "time_sheet",
    {
        id: uuid("id").primaryKey().defaultRandom().notNull(),
        targetShiftId: uuid("target_shift_id")
            .notNull()
            .references(() => targetShiftTable.id, {
                onDelete: "cascade",
            }),
        userId: uuid("user_id")
            .notNull()
            .references(() => userTable.id, {
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
        // UNIQUE CONSTRAINT for insertTimeSheet's onConflictDoNothing dedupe.
        // check_in is part of the key on purpose: a person can legitimately have
        // multiple sessions (split shifts) for the same target shift on the same
        // day, so the key is (user, shift, date, check_in) — it blocks exact
        // re-submissions without collapsing real split-shift records.
        uniqueIndex("unique_user_target_shift_date").on(
            table.userId,
            table.targetShiftId,
            table.date,
            table.checkIn,
        ),
    ],
);

// 🎯 TIME_SHEET RELATIONS
export const timeSheetRelations = relations(timeSheetTable, ({ one }) => ({
    targetShift: one(targetShiftTable, {
        fields: [timeSheetTable.targetShiftId],
        references: [targetShiftTable.id],
    }),
    user: one(userTable, {
        fields: [timeSheetTable.userId],
        references: [userTable.id],
    }),
}));

export type TimeSheetType = typeof timeSheetTable.$inferSelect;
