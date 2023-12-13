import { Request, Response } from "express";
import { createUser, queryUser } from "../service/getUser";
import { UserType } from "../types/users";

//** [GET]/user */
export const GetUser = async (req: Request, res: Response) => {
    const { offset, limit } = req.query;
    const { statusCode } = res;

    return await queryUser({ offset, limit })
        .then(data => {
            return res.status(statusCode).json({
                statusCode,
                data,
            });
        })
        .catch(err => {
            throw err;
        });
};

//** [GET]/user/create */
// "?username=Binayu1&password=123&email=mail1@gmail.com"
export const CreateUser = async (req: Request, res: Response) => {
    return createUser({
        query: req.query as Request["query"] & UserType,
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
};
