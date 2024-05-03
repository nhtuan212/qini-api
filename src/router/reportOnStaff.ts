import express from "express";
import { ReportOnStaff } from "../controller/ReportOnStaffController";

const router = express.Router();

export const reportOnStaff = router.get("/", ReportOnStaff);
router.get("/:id", ReportOnStaff);
router.get("/staff/:id", ReportOnStaff);
router.get("/salary/", ReportOnStaff);
router.post("/", ReportOnStaff);
