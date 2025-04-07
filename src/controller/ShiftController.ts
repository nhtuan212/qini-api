import { Request, Response } from "express";
import { getShift, createShift, updateShift } from "../service/shiftService";

//** [GET]/user */
export const Shift = async (req: Request, res: Response) => {
    switch (req.method) {
        //** GET */
        case "GET":
            return await getShift()
                .then(resData => {
                    // Destructure data
                    const { code, data } = resData;

                    return res.status(code).json({
                        code,
                        data,
                    });
                })
                .catch(err => {
                    throw err;
                });

        //** POST */
        case "POST":
            return await createShift(req.body)
                .then(resData => {
                    // Destructure data
                    const { code, data } = resData;

                    return res.status(code).json({
                        code,
                        data,
                    });
                })
                .catch(err => {
                    throw err;
                });

        //** PUT */
        case "PUT":
            return await updateShift({
                id: req.params.id,
                body: req.body,
            })
                .then(resData => {
                    if (!resData) {
                        return res
                            .status(404)
                            .json({ message: "Shift not found!" });
                    }

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
