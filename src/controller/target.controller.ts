import { Request } from "express";
import { serviceHandler } from ".";
import {
    findAllTarget,
    findTargetById,
    findTargetWithFilter,
    insertTarget,
    removeTargetById,
    updateTargetById,
} from "../service";

export const getTarget = serviceHandler(async (req: Request) => {
    const { startDate, endDate } = req.query;

    if (startDate || endDate) {
        return await findTargetWithFilter({
            startDate: new Date(startDate as string) || null,
            endDate: new Date(endDate as string) || null,
        });
    }

    return await findAllTarget();
});

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
