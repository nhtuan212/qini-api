import express from "express";
import {
    getShift,
    createShift,
    updateShift,
    deleteShift,
} from "../controller/shift.controller";

const router = express.Router();

export const shiftRouter = router
    .get("/", getShift)
    .post("/", createShift)
    .put("/:id", updateShift)
    .delete("/:id", deleteShift);
