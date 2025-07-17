import express from "express";
import {
    createTargetShift,
    deleteTargetShift,
    getTargetShift,
    getTargetShiftById,
    updateTargetShift,
} from "../controller";

const router = express.Router();

export const targetShiftRouter = router
    .get("/", getTargetShift)
    .get("/:id", getTargetShiftById)
    .post("/", createTargetShift)
    .put("/:id", updateTargetShift)
    .delete("/:id", deleteTargetShift);
