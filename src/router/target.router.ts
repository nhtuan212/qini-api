import express from "express";
import {
    createTarget,
    deleteTarget,
    getTarget,
    getTargetById,
    updateTarget,
} from "../controller";

const router = express.Router();

export const targetRouter = router
    .get("/", getTarget)
    .get("/:id", getTargetById)
    .post("/", createTarget)
    .put("/:id", updateTarget)
    .delete("/:id", deleteTarget);
