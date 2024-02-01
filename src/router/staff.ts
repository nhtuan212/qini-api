import express from "express";
import { Staff } from "../controller/StaffController";

const router = express.Router();

export const staff = router.get("/", Staff);
router.post("/", Staff);
router.get("/:id", Staff);
router.put("/:id", Staff);
router.delete("/", Staff);
