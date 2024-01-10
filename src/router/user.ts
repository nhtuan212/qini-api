import express from "express";
import { GetUser, CreateUser } from "../controller/UserController";

const router = express.Router();

export const user = router.get("/", GetUser);
router.post("/create", CreateUser);
