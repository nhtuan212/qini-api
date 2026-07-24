import express from "express";
import { getShift, createShift, updateShift, deleteShift } from "../controller";
import { requireRole } from "../middleware";
import { ROLE } from "../db";

const router = express.Router();

export const shiftRouter = router
    .get("/", getShift)
    .post("/", requireRole(ROLE.ADMIN), createShift)
    .put("/:id", requireRole(ROLE.ADMIN), updateShift)
    .delete("/:id", requireRole(ROLE.ADMIN), deleteShift);
