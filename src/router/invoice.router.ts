import express from "express";
import { getInvoice } from "../controller/invoice.controller";

const router = express.Router();

export const invoiceRouter = router.get("/", getInvoice);
