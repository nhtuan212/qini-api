import express from "express";
import {
    createSalary,
    getSalary,
    getSalaryById,
    updateSalary,
} from "../controller";

const router = express.Router();

export const salaryRouter = router
    .get("/", getSalary)
    .get("/:id", getSalaryById)
    .post("/", createSalary)
    .put("/:id", updateSalary);
