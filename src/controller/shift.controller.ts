import { Request } from "express";
import { serviceHandler } from ".";
import {
    findAllShift,
    insertShift,
    updateShiftById,
    deleteShiftById,
} from "../service";

export const getShift = serviceHandler(findAllShift);
export const createShift = serviceHandler(insertShift);
export const updateShift = serviceHandler(
    async (req: Request) =>
        await updateShiftById({
            id: req.params.id,
            body: req.body,
        }),
);
export const deleteShift = serviceHandler(
    async (req: Request) =>
        await deleteShiftById({
            id: req.params.id,
        }),
);
