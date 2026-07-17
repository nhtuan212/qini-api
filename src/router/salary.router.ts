import express from "express";
import {
    createSalary,
    deleteSalary,
    getSalary,
    getSalaryByUserId,
    updateSalary,
} from "../controller";

const router = express.Router();

export const salaryRouter = router
    .get("/", getSalary)
    .get("/user/:id", getSalaryByUserId)
    .post("/", createSalary)
    .put("/:id", updateSalary)
    .delete("/:id", deleteSalary);
