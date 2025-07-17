import express from "express";
import { login } from "../controller";

const router = express.Router();

export const loginRouter = router.post("/", login);
