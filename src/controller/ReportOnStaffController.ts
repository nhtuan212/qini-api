import { Request, Response } from "express";
import {
    createReport,
    getReportOnStaff,
} from "../service/reportOnStaffService";

//** [Method]/report */
export const ReportOnStaff = async (req: Request, res: Response) => {
    switch (req.method) {
        //** GET */
        case "GET":
            return await getReportOnStaff({
                query: req.query,
            }).then(resData => {
                // Destructure data
                const { code, message, data } = resData;

                return res.status(code).json({
                    code,
                    message,
                    data,
                });
            });

        //** POST */
        case "POST":
            return await createReport({
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

        //** Default */
        default:
            return res.json({
                message: "Sorry, something wrong method!",
            });
    }
};
