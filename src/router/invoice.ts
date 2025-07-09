import express from "express";
import { Invoice } from "../controller/InvoiceController";

const router = express.Router();

export const invoice = router.get("/", Invoice);
