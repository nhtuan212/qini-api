import { Request, Response } from "express";
import {
    createTimeSheet,
    deleteTimeSheet,
    updateTimeSheet,
    getTimeSheet,
} from "../service/timeSheetService";

//** [GET]/timeSheet */
export const TimeSheet = async (req: Request, res: Response) => {
    switch (req.method) {
        //** GET */
        case "GET":
            return await getTimeSheet(req)
                .then(resData => {
                    // Destructure data
                    const {
                        code,
                        message,
                        data,
                        pagination,
                        total_working_hours,
                    } = resData;

                    return res.status(code).json({
                        code,
                        message,
                        data,
                        total_working_hours,
                        pagination,
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

        //** PUT */
        case "PUT":
            return updateTimeSheet({
                id: req.params.id,
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

        //** DELETE */
        case "DELETE":
            return deleteTimeSheet(req.params.id)
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
