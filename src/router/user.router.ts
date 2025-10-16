import express from "express";
import { getUser, createUser, deleteUser, updateUser } from "../controller";

const router = express.Router();

export const userRouter = router
    .get("/", getUser)
    .post("/", createUser)
    .put("/:id", updateUser)
    .delete("/:id", deleteUser);
