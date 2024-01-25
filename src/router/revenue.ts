import express from "express";
import { Revenue } from "../controller/RevenueController";

const router = express.Router();

export const revenue = router.get("/", Revenue);
router.post("/", Revenue);
router.delete("/", Revenue);
