import { Request } from "express";
import { serviceHandler } from ".";
import {
    findAllWorkType,
    findWorkTypeById,
    insertWorkType,
    updateWorkTypeById,
    removeWorkTypeById,
} from "../service";

export const getWorkType = serviceHandler(findAllWorkType);
export const getWorkTypeById = serviceHandler(
    async (req: Request) => await findWorkTypeById({ id: req.params.id }),
);
export const createWorkType = serviceHandler(insertWorkType);
export const updateWorkType = serviceHandler(
    async (req: Request) =>
        await updateWorkTypeById({
            id: req.params.id,
            body: req.body,
        }),
);
export const deleteWorkType = serviceHandler(
    async (req: Request) =>
        await removeWorkTypeById({
            id: req.params.id,
        }),
);
