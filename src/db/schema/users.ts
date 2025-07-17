import {
    boolean,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { roleEnum } from "./enum";

export const userTable = pgTable("user", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    username: varchar("username", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }),
    active: boolean("active").notNull().default(true),
    role: roleEnum("role").default("REPORT").notNull(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
});

export type UserType = typeof userTable.$inferSelect;
