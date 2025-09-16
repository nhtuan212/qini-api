import {
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar,
    text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { staffTable } from "./staffs";

export const salaryTable = pgTable("salary", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    staffId: uuid("staff_id")
        .notNull()
        .references(() => staffTable.id, {
            onDelete: "cascade",
        }),
    name: varchar("name", { length: 255 }).notNull(),
    bonus: integer("bonus").notNull().default(0),
    salary: integer("salary").notNull().default(0),
    description: text("description").notNull().default(""),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
});

// 🎯 STAFF RELATIONS
export const salaryRelations = relations(salaryTable, ({ one }) => ({
    staffs: one(staffTable),
}));

export type SalaryType = typeof salaryTable.$inferSelect;
