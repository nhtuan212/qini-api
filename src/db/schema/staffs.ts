import {
    boolean,
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timeSheetTable } from "./timeSheets";

export const staffTable = pgTable("staff", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: varchar("name", { length: 50 }).notNull(),
    salary: integer("salary").notNull().default(0),
    isTarget: boolean("is_target").notNull().default(false),
    isFirstLogin: boolean("is_first_login").notNull().default(true),
    active: boolean("active").notNull().default(true),
    password: varchar("password", { length: 255 }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
});

// 🎯 STAFF RELATIONS
export const staffRelations = relations(staffTable, ({ many }) => ({
    timeSheets: many(timeSheetTable),
}));

export type StaffType = typeof staffTable.$inferSelect;
