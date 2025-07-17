import { pgTable, real, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const targetShiftTable = pgTable("target_shift", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    targetId: uuid("target_id").notNull(),
    shiftId: uuid("shift_id").notNull(),
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

export type TargetShift = typeof targetShiftTable.$inferSelect;
