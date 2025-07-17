import {
    boolean,
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

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

export type StaffType = typeof staffTable.$inferSelect;
