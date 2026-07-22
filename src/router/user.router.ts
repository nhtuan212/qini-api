import express from "express";
import {
    getUser,
    createUser,
    deleteUser,
    deactivateUser,
    updateUser,
    resetPassword,
} from "../controller";
import { requireRole } from "../middleware";
import { ROLE } from "../db";

const router = express.Router();

export const userRouter = router
    .get("/", requireRole(ROLE.ADMIN), getUser)
    .post("/", requireRole(ROLE.ADMIN), createUser)
    .put("/:id", requireRole(ROLE.ADMIN), updateUser)
    .post("/:id/reset-password", requireRole(ROLE.ADMIN), resetPassword)
    .put("/:id/in-active", requireRole(ROLE.ADMIN), deactivateUser)
    .delete("/:id", requireRole(ROLE.ADMIN), deleteUser);
