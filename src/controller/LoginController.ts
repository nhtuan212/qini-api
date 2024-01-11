import { Request, Response } from "express";
import { login } from "../service/loginService";

//** [POST]/login */
export const Login = async (req: Request, res: Response) => {
    // console.log({
    //     req: req.body,
    // });

    return await login({
        username: req.body.username,
        password: req.body.password,
    })
        .then(resData => {
            // Destructure data
            const { code, message, data } = resData as any;

            console.log({ resData });

            return res.status(code).json({
                code,
                message,
                data,
            });
        })
        .catch(err => {
            throw err;
        });
};
