import { Request } from "express";
import { serviceHandler } from ".";
import { getInvoiceByDate } from "../service/invoice.service";

export const getInvoice = serviceHandler(
    async (req: Request) => await getInvoiceByDate(req),
);
