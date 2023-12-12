import express from "express";
import { GetUser, CreateUser } from "../controller/UserController";

const router = express.Router();

export const user = router.get("/", GetUser);
export const userSlug = router.get("/create", CreateUser);
