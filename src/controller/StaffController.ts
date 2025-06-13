import { Request, Response } from "express";
import {
    createStaff,
    deleteStaff,
    updateStaff,
    getStaff,
    validateStaffPassword,
} from "../service/staffService";

//** [GET]/user */
export const Staff = async (req: Request, res: Response) => {
    switch (req.method) {
        //** GET */
        case "GET":
            return await getStaff({
                id: req?.params?.id,
            })
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
            if (req.path.includes("/validate-password")) {
                return await validateStaffPassword({
                    id: req.params.id,
                    password: req.body.password,
                }).then(resData => {
                    const { code, message, data } = resData;

                    return res.status(code).json({
                        code,
                        message,
                        data,
                    });
                });
            }

            return createStaff({
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
            return updateStaff({
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
            return deleteStaff({
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
