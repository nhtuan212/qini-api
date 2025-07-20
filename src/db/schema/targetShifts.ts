import { pgTable, real, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { targetTable } from "./targets";
import { shiftTable } from "./shifts";
import { relations } from "drizzle-orm";
import { timeSheetTable } from "./timeSheets";

export const targetShiftTable = pgTable("target_shift", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    targetId: uuid("target_id")
        .notNull()
        .references(() => targetTable.id, {
            onDelete: "cascade",
        }),
    shiftId: uuid("shift_id")
        .notNull()
        .references(() => shiftTable.id, {
            onDelete: "cascade",
        }),
    cash: real("cash").notNull().default(0),
    transfer: real("transfer").notNull().default(0),
    point: real("point").notNull().default(0),
    deduction: real("deduction").notNull().default(0),
    revenue: real("revenue").notNull().default(0),
    description: varchar("description", { length: 255 }).default(""),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
});

// 🎯 TARGET_SHIFT RELATIONS
export const targetShiftRelations = relations(
    targetShiftTable,
    ({ one, many }) => ({
        target: one(targetTable, {
            fields: [targetShiftTable.targetId],
            references: [targetTable.id],
        }),
        shift: one(shiftTable, {
            fields: [targetShiftTable.shiftId],
            references: [shiftTable.id],
        }),
        timeSheets: many(timeSheetTable),
    }),
);

export type TargetShiftType = typeof targetShiftTable.$inferSelect;
