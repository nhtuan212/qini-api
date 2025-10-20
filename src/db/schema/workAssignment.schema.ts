import {
    boolean,
    date,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { workTypeTable, WorkTypeType } from "./workType.schema";
import { staffTable, StaffType } from "./staffs.schema";
import { relations } from "drizzle-orm";
import { shiftTable, ShiftType } from "./shifts.schema";

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
    shiftId: uuid("shift_id")
        .notNull()
        .references(() => shiftTable.id, {
            onDelete: "cascade",
        }),
    description: varchar("description", { length: 255 }),
    isCompleted: boolean("is_completed").notNull().default(false),
    date: date("date", { mode: "string" }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", {
        precision: 6,
        mode: "string",
    }),
});

export const workAssignmentWithRelations = relations(
    workAssignmentTable,
    ({ one }) => ({
        workType: one(workTypeTable, {
            fields: [workAssignmentTable.workTypeId],
            references: [workTypeTable.id],
        }),
        staff: one(staffTable, {
            fields: [workAssignmentTable.staffId],
            references: [staffTable.id],
        }),
        shift: one(shiftTable, {
            fields: [workAssignmentTable.shiftId],
            references: [shiftTable.id],
        }),
    }),
);

export type WorkAssignmentType = typeof workAssignmentTable.$inferSelect & {
    workType: WorkTypeType;
    staff: StaffType;
    shift: ShiftType;
};
