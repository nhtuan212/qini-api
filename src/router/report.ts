import express from "express";
import { Report } from "../controller/ReportController";

const router = express.Router();

export const report = router.get("/", Report);
router.get("/revenue/:id", Report);
router.get("/staff/:id", Report);
router.get("/salary/", Report);
router.post("/", Report);
