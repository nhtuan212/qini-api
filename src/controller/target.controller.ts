import { Request } from "express";
import { serviceHandler } from ".";
import {
    findAllTarget,
    findTargetById,
    insertTarget,
    removeTargetById,
    updateTargetById,
} from "../service";

export const getTarget = serviceHandler(
    async (req: Request) => await findAllTarget(req.query),
);

export const getTargetById = serviceHandler(
    async (req: Request) =>
        await findTargetById({
            id: req.params.id,
        }),
);

export const createTarget = serviceHandler(
    async (req: Request) =>
        await insertTarget({
            body: req.body,
        }),
);

export const updateTarget = serviceHandler(
    async (req: Request) =>
        await updateTargetById({
            id: req.params.id,
            body: req.body,
        }),
);

export const deleteTarget = serviceHandler(
    async (req: Request) =>
        await removeTargetById({
            id: req.params.id,
        }),
);
