import express from "express";
import { TargetStaff } from "../controller/TargetStaffController";

const router = express.Router();

export const targetStaff = router.get("/", TargetStaff);
// router.get("/:id", TargetStaff);
