import { Request } from "express";
import { serviceHandler } from ".";
import {
    findAllUser,
    insertUser,
    removeUserById,
    updateUserById,
} from "../service";

export const getUser = serviceHandler(findAllUser);
export const createUser = serviceHandler(insertUser);
export const updateUser = serviceHandler((req: Request) =>
    updateUserById({
        id: req.params.id,
        body: req.body,
    }),
);
export const deleteUser = serviceHandler((req: Request) =>
    removeUserById({
        id: req.params.id,
    }),
);
