import express from "express";
import {
    getTimeSheet,
    createTimeSheet,
    updateTimeSheet,
    deleteTimeSheet,
    getTimeSheetById,
    getTimeSheetByStaffId,
} from "../controller";

const router = express.Router();
export const timeSheetRouter = router
    .get("/", getTimeSheet)
    .get("/:id", getTimeSheetById)
    .get("/staff/:id", getTimeSheetByStaffId)
    .post("/", createTimeSheet)
    .put("/:id", updateTimeSheet)
    .delete("/:id", deleteTimeSheet);
