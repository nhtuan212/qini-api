import express from "express";
import { HomeController } from "../controller/HomeController";

const router = express.Router();

export const home = router.get("/", HomeController);
