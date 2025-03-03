import express from "express";
import { TimeSheet } from "../controller/TimeSheetController";

const router = express.Router();

export const user = router.get("/", TimeSheet);
router.post("/", TimeSheet);
