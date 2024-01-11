import express from "express";
import { Login } from "../controller/LoginController";

const router = express.Router();

export const login = router.post("/", Login);
