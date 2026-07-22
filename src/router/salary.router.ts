import express from "express";
import {
    createSalary,
    deleteSalary,
    getSalary,
    getSalaryByUserId,
    updateSalary,
} from "../controller";
import { requireRole, requireSelfOrRole } from "../middleware";
import { ROLE } from "../db";

const router = express.Router();

export const salaryRouter = router
    .get("/", getSalary)
    .get("/user/:id", requireSelfOrRole("id", ROLE.ADMIN), getSalaryByUserId)
    .post("/", requireRole(ROLE.ADMIN), createSalary)
    .put("/:id", requireRole(ROLE.ADMIN), updateSalary)
    .delete("/:id", requireRole(ROLE.ADMIN), deleteSalary);
