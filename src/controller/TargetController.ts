import { Request, Response } from "express";
import {
    getTarget,
    createTarget,
    deleteTarget,
    updateTarget,
} from "../service/targetService";

//** [Method]/report */
export const Target = async (req: Request, res: Response) => {
    switch (req.method) {
        case "GET":
            return await getTarget(req).then(resData => {
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
            return await createTarget({
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
            return await updateTarget({
                id: req.params.id,
                body: req.body,
            })
                .then(resData => {
                    if (!resData) {
                        return res
                            .status(404)
                            .json({ message: "Target not found!" });
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

        case "DELETE":
            return await deleteTarget({
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
