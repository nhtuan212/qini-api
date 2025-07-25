import { Request } from "express";
import { serviceHandler } from ".";
import { getInvoiceByDate } from "../service";

export const getInvoice = serviceHandler(
    async (req: Request) => await getInvoiceByDate(req),
);
