import express from "express";
import { Target } from "../controller/TargetController";

const router = express.Router();

export const target = router.get("/", Target);
router.get("/:id", Target);
router.post("/", Target);
router.put("/:id", Target);
router.delete("/", Target);
