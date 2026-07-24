import express from "express";
import {
    getUser,
    createUser,
    deleteUser,
    deactivateUser,
    updateUser,
    resetPassword,
} from "../controller";

const router = express.Router();

export const userRouter = router
    .get("/", getUser)
    .post("/", createUser)
    .put("/:id", updateUser)
    .post("/:id/reset-password", resetPassword)
    .put("/:id/in-active", deactivateUser)
    .delete("/:id", deleteUser);
