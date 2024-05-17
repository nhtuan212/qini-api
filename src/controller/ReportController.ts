import { Request, Response } from "express";
import {
    createReport,
    deleteReport,
    getReport,
    updateReport,
} from "../service/reportService";

//** [Method]/report */
export const Report = async (req: Request, res: Response) => {
    switch (req.method) {
        //** GET */
        case "GET":
            return await getReport({
                params: req.params,
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

        //** PUT */
        case "PUT":
            return await updateReport({
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
            return await deleteReport({
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
