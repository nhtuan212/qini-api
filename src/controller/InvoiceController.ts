import { Request, Response } from "express";
import { getInvoice } from "../service/invoiceService";

//** [GET]/user */
export const Invoice = async (req: Request, res: Response) => {
    const { statusCode } = res;

    switch (req.method) {
        //** GET */
        case "GET":
            return await getInvoice(req)
                .then(data => {
                    return res.status(statusCode).json({
                        statusCode,
                        ...data,
                    });
                })
                .catch(err => {
                    throw err;
                });

        //** Default */
        default:
            return res.json({
                message: "Sorry, something wrong method!",
            });
    }
};
