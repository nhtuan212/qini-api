import { Request } from "express";
import { serviceHandler } from ".";
import {
    findAllUser,
    insertUser,
    removeUserById,
} from "../service/user.service";

export const getUser = serviceHandler(findAllUser);
export const createUser = serviceHandler(insertUser);
export const deleteUser = serviceHandler((req: Request) =>
    removeUserById({
        id: req.params.id,
    }),
);
