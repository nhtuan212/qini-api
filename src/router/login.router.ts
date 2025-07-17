import express from "express";
import { login } from "../controller/login.controller";

const router = express.Router();

export const loginRouter = router.post("/", login);
