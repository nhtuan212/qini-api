import express from "express";
import { getHome } from "../controller";

const router = express.Router();

export const homeRouter = router.get("/", getHome);
