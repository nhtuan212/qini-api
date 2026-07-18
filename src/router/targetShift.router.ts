import express from "express";
import {
    createTargetShift,
    deleteTargetShift,
    getTargetShift,
    getTargetShiftById,
    updateTargetShift,
} from "../controller";
import { requireRole } from "../middleware";
import { ROLE } from "../db";

const router = express.Router();

export const targetShiftRouter = router
    .get("/", requireRole(ROLE.ADMIN), getTargetShift)
    .get("/:id", requireRole(ROLE.ADMIN), getTargetShiftById)
    .post("/", requireRole(ROLE.ADMIN), createTargetShift)
    .put("/:id", updateTargetShift)
    .delete("/:id", requireRole(ROLE.ADMIN), deleteTargetShift);
