import {
    real,
    pgTable,
    timestamp,
    uuid,
    varchar,
    text,
    integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { staffTable } from "./staffs.schema";

export const salaryTable = pgTable("salary", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    staffId: uuid("staff_id")
        .notNull()
        .references(() => staffTable.id, {
            onDelete: "cascade",
        }),
    name: varchar("name", { length: 255 }).notNull(),
    salary: integer("salary").notNull().default(0),
    paidLeave: integer("paid_leave").notNull().default(0),
    lunchAllowancePerDay: integer("lunch_allowance_per_day")
        .notNull()
        .default(0),
    gasolineAllowancePerDay: integer("gasoline_allowance_per_day")
        .notNull()
        .default(0),
    workingMonth: integer("working_month").notNull().default(0),
    workingDay: integer("working_day").notNull().default(0),
    workingHours: real("working_hours").notNull().default(0),
    target: integer("target").notNull().default(0),
    bonus: integer("bonus").notNull().default(0),
    startDate: timestamp("start_date", {
        precision: 6,
        mode: "string",
    }).notNull(),
    endDate: timestamp("end_date", { precision: 6, mode: "string" }).notNull(),
    description: text("description").notNull().default(""),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
});

// 🎯 STAFF RELATIONS
export const salaryRelations = relations(salaryTable, ({ one }) => ({
    staff: one(staffTable, {
        fields: [salaryTable.staffId],
        references: [staffTable.id],
    }),
}));

export type SalaryType = typeof salaryTable.$inferSelect;
