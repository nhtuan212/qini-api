import { Request } from "express";
import { serviceHandler } from ".";
import {
    findAllStaff,
    findStaffById,
    insertStaff,
    removeStaffById,
    softDeleteStaffById,
    updateStaffById,
    validateStaffPasswordById,
} from "../service";

export const getStaff = serviceHandler(findAllStaff);

export const getStaffById = serviceHandler((req: Request) =>
    findStaffById({
        id: req?.params?.id,
    }),
);
export const createStaff = serviceHandler((req: Request) =>
    insertStaff({
        body: req.body,
    }),
);

export const updateStaff = serviceHandler((req: Request) =>
    updateStaffById({
        id: req.params.id,
        body: req.body,
    }),
);

export const softDeleteStaff = serviceHandler((req: Request) =>
    softDeleteStaffById({
        id: req.params.id,
    }),
);

export const deleteStaff = serviceHandler((req: Request) =>
    removeStaffById({
        id: req.params.id,
    }),
);

export const validateStaffPassword = serviceHandler((req: Request) =>
    validateStaffPasswordById({
        id: req.params.id,
        password: req.body.password,
    }),
);
