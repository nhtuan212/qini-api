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

export const staffRouter = router.get("/", getStaff);
router.get("/:id", getStaffById);
router.post("/", createStaff);
router.post("/:id/validate-password", validateStaffPassword);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);
