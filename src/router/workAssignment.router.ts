import express from "express";
import {
    getWorkAssignment,
    getWorkAssignmentById,
    createWorkAssignment,
    updateWorkAssignment,
    deleteWorkAssignment,
} from "../controller";

const router = express.Router();

export const workAssignmentRouter = router
    .get("/", getWorkAssignment)
    .get("/:id", getWorkAssignmentById)
    .post("/", createWorkAssignment)
    .put("/:id", updateWorkAssignment)
    .delete("/:id", deleteWorkAssignment);
