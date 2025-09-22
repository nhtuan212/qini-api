import express from "express";
import {
    createSalary,
    deleteSalary,
    getSalary,
    getSalaryByStaffId,
    updateSalary,
} from "../controller";

const router = express.Router();

export const salaryRouter = router
    .get("/", getSalary)
    .get("/staff/:id", getSalaryByStaffId)
    .post("/", createSalary)
    .put("/:id", updateSalary)
    .delete("/:id", deleteSalary);
