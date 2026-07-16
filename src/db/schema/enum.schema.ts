import { pgEnum } from "drizzle-orm/pg-core";

export const salaryTypeEnum = pgEnum("salary_type", ["HOURLY", "MONTHLY"]);
export const roleEnum = pgEnum("role", ["ADMIN", "REPORT", "MANAGER", "STAFF"]);

export type Role = (typeof roleEnum.enumValues)[number];

export const ROLE = Object.fromEntries(
    roleEnum.enumValues.map(role => [role, role]),
) as { [K in Role]: K };
