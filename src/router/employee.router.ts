import express from "express";
import {
    createEmployee,
    deleteEmployee,
    getEmployee,
    getEmployeeById,
    softDeleteEmployee,
    updateEmployee,
} from "../controller";
import { requireRole } from "../middleware";
import { ROLE } from "../db";

const router = express.Router();

export const employeeRouter = router
    .get("/", getEmployee)
    .get("/:id", getEmployeeById)
    .post("/", requireRole(ROLE.ADMIN), createEmployee)
    .put("/:id", requireRole(ROLE.ADMIN), updateEmployee)
    .put("/:id/in-active", requireRole(ROLE.ADMIN), softDeleteEmployee)
    .delete("/:id", requireRole(ROLE.ADMIN), deleteEmployee);
