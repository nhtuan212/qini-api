import {
    boolean,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { workTypeTable } from "./workType.schema";
import { staffTable } from "./staffs.schema";

export const workAssignmentTable = pgTable("work_assignment", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    workTypeId: uuid("work_type_id")
        .notNull()
        .references(() => workTypeTable.id, {
            onDelete: "cascade",
        }),
    staffId: uuid("staff_id")
        .notNull()
        .references(() => staffTable.id, {
            onDelete: "cascade",
        }),
    description: varchar("description", { length: 255 }),
    isCompleted: boolean("is_completed").notNull().default(false),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", {
        precision: 6,
        mode: "string",
    }).defaultNow(),
});

export type WorkAssignmentType = typeof workAssignmentTable.$inferSelect;
