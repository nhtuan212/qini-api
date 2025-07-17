import { date, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const targetTable = pgTable("target", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    targetAt: date("target_at", { mode: "string" }).notNull().unique(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
});

export type TargetType = typeof targetTable.$inferSelect;
