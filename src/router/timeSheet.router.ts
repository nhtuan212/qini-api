import express from "express";
import {
    getTimeSheet,
    createTimeSheet,
    updateTimeSheet,
    deleteTimeSheet,
    getTimeSheetById,
    getTimeSheetByStaffId,
} from "../controller";
import { requireRole } from "../middleware";
import { ROLE } from "../db/schema/enum.schema";

const router = express.Router();
export const timeSheetRouter = router
    .get("/", requireRole(ROLE.ADMIN, ROLE.MANAGER), getTimeSheet)
    .get("/:id", requireRole(ROLE.ADMIN, ROLE.MANAGER), getTimeSheetById)
    .get(
        "/staff/:id",
        requireRole(ROLE.ADMIN, ROLE.MANAGER),
        getTimeSheetByStaffId,
    )
    .post("/", requireRole(ROLE.ADMIN), createTimeSheet)
    .put("/:id", requireRole(ROLE.ADMIN), updateTimeSheet)
    .delete("/:id", requireRole(ROLE.ADMIN), deleteTimeSheet);
