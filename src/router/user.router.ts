import express from "express";
import { getUser, createUser, deleteUser } from "../controller";

const router = express.Router();

export const userRouter = router
    .get("/", getUser)
    .post("/", createUser)
    .delete("/:id", deleteUser);
