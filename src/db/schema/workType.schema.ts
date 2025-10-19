import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const workTypeTable = pgTable("work_type", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", {
        precision: 6,
        mode: "string",
    }),
});

export type WorkTypeType = typeof workTypeTable.$inferSelect;
