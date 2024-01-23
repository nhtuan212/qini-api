import { Request, Response } from "express";
import { addReport } from "../service/reportService";

//** [GET]/report */
export const AddReport = async (req: Request, res: Response) => {
    return addReport({
        body: req.body,
    })
        .then(resData => {
            // Destructure data
            const { code, message, data } = resData;

            return res.status(code).json({
                code,
                message,
                data,
            });
        })
        .catch(err => {
            throw err;
        });
};
