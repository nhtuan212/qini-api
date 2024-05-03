import express from "express";
import { Report } from "../controller/ReportController";

const router = express.Router();

export const report = router.get("/", Report);
router.post("/", Report);
router.delete("/", Report);
