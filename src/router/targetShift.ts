import express from "express";
import { TargetShift } from "../controller/TargetShiftController";

const router = express.Router();

export const targetShift = router.get("/", TargetShift);
router.get("/:id", TargetShift);
router.post("/", TargetShift);
router.put("/:id", TargetShift);
router.delete("/:id", TargetShift);
