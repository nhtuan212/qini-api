import express from "express";
import { login, changePassword, createPassword } from "../controller";

const router = express.Router();

export const loginRouter = router
    .post("/", login)
    .post("/create-password", createPassword)
    .post("/change-password", changePassword);
