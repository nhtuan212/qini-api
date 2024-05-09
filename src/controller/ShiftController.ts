import { Request, Response } from "express";
import { getShift } from "../service/shiftService";

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

        //** Default */
        default:
            return res.json({
                message: "Sorry, something wrong method!",
            });
    }
};
