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
    .get("/", getEmployee)
    .get("/:id", getEmployeeById)
    .post("/", requireRole(ROLE.ADMIN), createEmployee)
    .put("/:id", requireRole(ROLE.ADMIN), updateEmployee);
