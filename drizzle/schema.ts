import {
    pgTable,
    uuid,
    varchar,
    boolean,
    timestamp,
    unique,
    date,
    foreignKey,
    real,
    uniqueIndex,
    integer,
    pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const role = pgEnum("role", ["ADMIN", "REPORT", "MANAGER", "STAFF"]);

export const user = pgTable("user", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    username: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }),
    isActive: boolean("is_active").default(true).notNull(),
    role: role().default("REPORT").notNull(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
});

export const target = pgTable(
    "target",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        name: varchar({ length: 255 }).notNull(),
        targetAt: date("target_at").notNull(),
        createdAt: timestamp("created_at", { precision: 6, mode: "string" })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    },
    table => [unique("target_target_at_unique").on(table.targetAt)],
);

export const targetShift = pgTable(
    "target_shift",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        targetId: uuid("target_id").notNull(),
        shiftId: uuid("shift_id").notNull(),
        cash: real().default(0).notNull(),
        transfer: real().default(0).notNull(),
        point: real().default(0).notNull(),
        deduction: real().default(0).notNull(),
        revenue: real().default(0).notNull(),
        description: varchar({ length: 255 }).default(""),
        createdAt: timestamp("created_at", { precision: 6, mode: "string" })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    },
    table => [
        foreignKey({
            columns: [table.targetId],
            foreignColumns: [target.id],
            name: "target_shift_target_id_target_id_fk",
        }).onDelete("cascade"),
        foreignKey({
            columns: [table.shiftId],
            foreignColumns: [shift.id],
            name: "target_shift_shift_id_shift_id_fk",
        }).onDelete("cascade"),
    ],
);

export const shift = pgTable("shift", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    kiotId: varchar("kiot_id", { length: 255 }),
    name: varchar({ length: 255 }).notNull(),
    startTime: varchar("start_time", { length: 10 }),
    endTime: varchar("end_time", { length: 10 }),
    isTarget: boolean("is_target").default(false).notNull(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
});

export const timeSheet = pgTable(
    "time_sheet",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        targetShiftId: uuid("target_shift_id").notNull(),
        staffId: uuid("staff_id").notNull(),
        checkIn: varchar("check_in", { length: 10 }).default(""),
        checkOut: varchar("check_out", { length: 10 }).default(""),
        workingHours: real("working_hours").default(0).notNull(),
        date: date(),
        createdAt: timestamp("created_at", { precision: 6, mode: "string" })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    },
    table => [
        uniqueIndex("unique_staff_target_shift_date").using(
            "btree",
            table.staffId.asc().nullsLast().op("date_ops"),
            table.targetShiftId.asc().nullsLast().op("uuid_ops"),
            table.date.asc().nullsLast().op("date_ops"),
        ),
        foreignKey({
            columns: [table.targetShiftId],
            foreignColumns: [targetShift.id],
            name: "time_sheet_target_shift_id_target_shift_id_fk",
        }).onDelete("cascade"),
        foreignKey({
            columns: [table.staffId],
            foreignColumns: [staff.id],
            name: "time_sheet_staff_id_staff_id_fk",
        }).onDelete("cascade"),
    ],
);

export const staff = pgTable("staff", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: varchar({ length: 50 }).notNull(),
    salary: integer().default(0).notNull(),
    isTarget: boolean("is_target").default(false).notNull(),
    isFirstLogin: boolean("is_first_login").default(true).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    password: varchar({ length: 255 }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    isDeleted: boolean("is_deleted").default(false).notNull(),
});
