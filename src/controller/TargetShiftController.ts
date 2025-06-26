import { Request, Response } from "express";
import {
    createTargetShift,
    getTargetShift,
    updateTargetShift,
} from "../service/targetShiftService";

//** [Method]/report */
export const TargetShift = async (req: Request, res: Response) => {
    switch (req.method) {
        case "GET":
            return await getTargetShift(req).then((resData: any) => {
                // Destructure data
                const { code, message, data, pagination } = resData;

                return res.status(code).json({
                    code,
                    message,
                    data,
                    pagination,
                });
            });

        case "POST":
            return await createTargetShift({
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

        case "PUT":
            return await updateTargetShift({
                id: req.params.id,
                body: req.body,
            })
                .then(resData => {
                    return res.status(resData.code).json(resData);
                })
                .catch(err => {
                    throw err;
                });

        case "DELETE":
            return;

        //** Default */
        default:
            return res.json({
                message: "Sorry, something wrong method!",
            });
    }
};
