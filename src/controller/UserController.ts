import { Request, Response } from "express";
import { createUser, getUser } from "../service/userService";

//** [GET]/user */
export const User = async (req: Request, res: Response) => {
    const { offset, limit } = req.query;
    const { statusCode } = res;

    switch (req.method) {
        //** GET */
        case "GET":
            return await getUser({ offset, limit })
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
            return createUser({
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
