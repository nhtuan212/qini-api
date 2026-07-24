import express from "express";
import {
    getLocation,
    createLocation,
    updateLocation,
    deleteLocation,
} from "../controller";

const router = express.Router();

export const locationRouter = router
    .get("/", getLocation)
    .post("/", createLocation)
    .put("/:id", updateLocation)
    .delete("/:id", deleteLocation);
