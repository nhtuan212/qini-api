import {
    boolean,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

export const shiftTable = pgTable("shift", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    kiotId: varchar("kiot_id", { length: 255 }),
    name: varchar("name", { length: 255 }).notNull(),
    startTime: varchar("start_time", { length: 10 }),
    endTime: varchar("end_time", { length: 10 }),
    isTarget: boolean("is_target").notNull().default(false),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
});

export type Shift = typeof shiftTable.$inferSelect;
