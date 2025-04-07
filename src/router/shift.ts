import express from "express";
import { Shift } from "../controller/ShiftController";

const router = express.Router();

export const shift = router.get("/", Shift);
router.post("/", Shift);
router.put("/:id", Shift);
