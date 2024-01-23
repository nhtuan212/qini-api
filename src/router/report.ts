import express from "express";
import { AddReport } from "../controller/ReportController";

const router = express.Router();

export const report = router.post("/", AddReport);
