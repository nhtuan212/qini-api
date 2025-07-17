import { Request } from "express";
import { serviceHandler } from ".";
import {
    deleteTargetShiftById,
    findAllTargetShift,
    findTargetShiftById,
    insertTargetShift,
    updateTargetShiftById,
} from "../service";

export const getTargetShift = serviceHandler(findAllTargetShift);
export const getTargetShiftById = serviceHandler(
    async (req: Request) =>
        await findTargetShiftById({
            id: req.params.id,
        }),
);
export const createTargetShift = serviceHandler(
    async (req: Request) =>
        await insertTargetShift({
            body: req.body,
        }),
);
export const updateTargetShift = serviceHandler(
    async (req: Request) =>
        await updateTargetShiftById({
            id: req.params.id,
            body: req.body,
        }),
);
export const deleteTargetShift = serviceHandler(
    async (req: Request) =>
        await deleteTargetShiftById({
            id: req.params.id,
        }),
);
