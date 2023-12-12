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
export const CreateUser = async (req: Request, res: Response) => {
    // Example params: http://localhost:8000/user/create
    // "?username=Binayu1&password=123&email=mail1@gmail.com&active=true"

    const { statusCode } = res;

    return await createUser({
        query: req.query as Request["query"] & UserType,
    })
        .then(data => {
            // Case unique fields
            if (data?.code === "P2002") {
                return res.status(statusCode).json({
                    code: data.code,
                    message: `Create failed because "${data?.meta?.target}" already exists!`,
                });
            }

            // Case PrismaClientValidationError
            if (data?.name === "PrismaClientValidationError") {
                console.error({ data });
                return res.status(statusCode).json({
                    code: 404,
                    message: data?.name,
                });
            }

            // Success
            return res.status(statusCode).json({
                code: statusCode,
                message: "Create successfully!",
                data,
            });
        })
        .catch(err => {
            throw err;
        });
};
