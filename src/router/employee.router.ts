import express from "express";
import {
    createEmployee,
    getEmployee,
    getEmployeeById,
    updateEmployee,
} from "../controller";
import { requireRole } from "../middleware";
import { ROLE } from "../db";

const router = express.Router();

export const employeeRouter = router
    .get("/", requireRole(ROLE.ADMIN, ROLE.MANAGER), getEmployee)
    .get("/:id", requireRole(ROLE.ADMIN, ROLE.MANAGER), getEmployeeById)
    .post("/", requireRole(ROLE.ADMIN), createEmployee)
    .put("/:id", requireRole(ROLE.ADMIN), updateEmployee);
