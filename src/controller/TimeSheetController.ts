import { Request, Response } from "express";
import { createTimeSheet, getTimeSheet } from "../service/timeSheetService";

//** [GET]/timeSheet */
export const TimeSheet = async (req: Request, res: Response) => {
    const { offset, limit } = req.query;
    const { statusCode } = res;

    switch (req.method) {
        //** GET */
        case "GET":
            return await getTimeSheet({ offset, limit })
                .then(data => {
                    return res.status(statusCode).json({
                        statusCode,
                        data,
                    });
                })
                .catch(err => {
                    throw err;
                });

        //** POST */
        case "POST":
            return createTimeSheet({
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
