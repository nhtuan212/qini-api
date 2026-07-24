import { db } from "../db";

export const dbConnection = async () => db;

export * from "./employee.service";
export * from "./shift.service";
export * from "./user.service";
export * from "./target.service";
export * from "./targetShift.service";
export * from "./timeSheet.service";
export * from "./invoice.service";
export * from "./login.service";
export * from "./salary.service";
export * from "./location.service";
