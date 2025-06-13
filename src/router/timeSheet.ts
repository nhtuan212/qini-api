import express from "express";
import { TimeSheet } from "../controller/TimeSheetController";

const router = express.Router();

export const timeSheet = router.get("/", TimeSheet);
router.post("/", TimeSheet);
router.get("/:id", TimeSheet);
router.put("/:id", TimeSheet);
router.delete("/", TimeSheet);
