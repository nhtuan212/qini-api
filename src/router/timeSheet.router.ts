import express from "express";
import {
    getTimeSheet,
    createTimeSheet,
    updateTimeSheet,
    deleteTimeSheet,
    getTimeSheetById,
    getTimeSheetByUserId,
} from "../controller";
import { requireRole, requireSelfOrRole } from "../middleware";
import { ROLE } from "../db/schema/enum.schema";
import { findTimeSheetOwnerId } from "../service";

const router = express.Router();
export const timeSheetRouter = router
    .get("/", requireRole(ROLE.ADMIN, ROLE.MANAGER), getTimeSheet)
    .get("/:id", requireRole(ROLE.ADMIN, ROLE.MANAGER), getTimeSheetById)
    .get("/user/:id", requireSelfOrRole("id", ROLE.ADMIN), getTimeSheetByUserId)
    .post(
        "/",
        requireSelfOrRole(req => req.body?.userId, ROLE.ADMIN),
        createTimeSheet,
    )
    .put(
        "/:id",
        requireSelfOrRole(
            req => findTimeSheetOwnerId(req.params.id),
            ROLE.ADMIN,
        ),
        updateTimeSheet,
    )
    .delete("/:id", requireRole(ROLE.ADMIN), deleteTimeSheet);
