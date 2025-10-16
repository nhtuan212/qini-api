import { pgEnum } from "drizzle-orm/pg-core";

export const salaryTypeEnum = pgEnum("salary_type", ["HOURLY", "MONTHLY"]);
export const roleEnum = pgEnum("role", ["ADMIN", "REPORT", "MANAGER", "STAFF"]);
