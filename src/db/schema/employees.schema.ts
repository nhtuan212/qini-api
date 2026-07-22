import {
    boolean,
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { salaryTypeEnum } from "./enum.schema";
import { userTable } from "./users.schema";

export const employeeTable = pgTable("employee", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    userId: uuid("user_id")
        .notNull()
        .unique()
        .references(() => userTable.id, {
            onDelete: "restrict",
        }),
    name: varchar("name", { length: 50 }).notNull(),
    salary: integer("salary").notNull().default(0),
    salaryType: salaryTypeEnum("salary_type").notNull().default("HOURLY"),
    isTarget: boolean("is_target").notNull().default(false),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
});

// 🎯 EMPLOYEE RELATIONS
export const employeeRelations = relations(employeeTable, ({ one }) => ({
    user: one(userTable, {
        fields: [employeeTable.userId],
        references: [userTable.id],
    }),
}));

export type EmployeeType = typeof employeeTable.$inferSelect;
