import {
    boolean,
    doublePrecision,
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

export const locationTable = pgTable("location", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),
    radius: integer("radius").notNull().default(120),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
});

export type LocationType = typeof locationTable.$inferSelect;
