import express from "express";
import {
    createSalary,
    deleteSalary,
    getSalary,
    getSalaryByUserId,
    updateSalary,
} from "../controller";
import { requireRole } from "../middleware";
import { ROLE } from "../db";

const router = express.Router();

export const salaryRouter = router
    .get("/", getSalary)
    .get("/user/:id", getSalaryByUserId)
    .post("/", requireRole(ROLE.ADMIN), createSalary)
    .put("/:id", requireRole(ROLE.ADMIN), updateSalary)
    .delete("/:id", requireRole(ROLE.ADMIN), deleteSalary);
