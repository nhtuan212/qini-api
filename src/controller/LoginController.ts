import { Request, Response } from "express";
import { login } from "../service/loginService";

//** [POST]/login */
export const Login = async (req: Request, res: Response) => {
    switch (req.method) {
        //** POST */
        case "POST":
            return await login({
                username: req.body.username,
                password: req.body.password,
            })
                .then(resData => {
                    // Destructure data
                    const { status, message, data } = resData;

                    return res.status(status).json({
                        status,
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
