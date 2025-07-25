import express from "express";
import {
    createStaff,
    deleteStaff,
    getStaff,
    getStaffById,
    updateStaff,
    validateStaffPassword,
} from "../controller";

const router = express.Router();

export const staffRouter = router
    .get("/", getStaff)
    .get("/:id", getStaffById)
    .post("/", createStaff)
    .post("/:id/validate-password", validateStaffPassword)
    .put("/:id", updateStaff)
    .delete("/:id", deleteStaff);
