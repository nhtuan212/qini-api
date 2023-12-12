import express from "express";
import { HomePageController } from "../controller/HomePageController";

const router = express.Router();

export const homePage = router.get("/", HomePageController);
