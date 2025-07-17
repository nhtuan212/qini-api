import { Request } from "express";
import { serviceHandler } from ".";
import { findAllUser, insertUser, removeUserById } from "../service";

export const getUser = serviceHandler(findAllUser);
export const createUser = serviceHandler(insertUser);
export const deleteUser = serviceHandler((req: Request) =>
    removeUserById({
        id: req.params.id,
    }),
);
