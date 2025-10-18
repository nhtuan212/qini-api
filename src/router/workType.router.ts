import express from "express";
import {
    getWorkType,
    getWorkTypeById,
    createWorkType,
    updateWorkType,
    deleteWorkType,
} from "../controller";

const router = express.Router();

export const workTypeRouter = router
    .get("/", getWorkType)
    .get("/:id", getWorkTypeById)
    .post("/", createWorkType)
    .put("/:id", updateWorkType)
    .delete("/:id", deleteWorkType);
