import { Request, Response } from "express";
import {
    createRevenue,
    deleteRevenue,
    getRevenue,
} from "../service/revenueService";

//** [Method]/revenue */
export const Revenue = async (req: Request, res: Response) => {
    switch (req.method) {
        //** GET */
        case "GET":
            return await getRevenue().then(resData => {
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
            return await createRevenue({
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
            return await deleteRevenue({
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
