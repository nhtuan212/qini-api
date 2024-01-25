import express from "express";
import { User } from "../controller/UserController";

const router = express.Router();

export const user = router.get("/", User);
router.post("/", User);
