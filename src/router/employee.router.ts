import express from "express";
import {
    createEmployee,
    deleteEmployee,
    getEmployee,
    getEmployeeById,
    softDeleteEmployee,
    updateEmployee,
} from "../controller";

const router = express.Router();

export const employeeRouter = router
    .get("/", getEmployee)
    .get("/:id", getEmployeeById)
    .post("/", createEmployee)
    .put("/:id", updateEmployee)
    .put("/:id/in-active", softDeleteEmployee)
    .delete("/:id", deleteEmployee);
