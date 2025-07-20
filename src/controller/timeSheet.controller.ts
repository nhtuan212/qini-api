import { Request } from "express";
import {
    deleteTimeSheetById,
    findAllTimeSheet,
    findTimeSheetById,
    findTimeSheetByStaffId,
    insertTimeSheet,
    updateTimeSheetById,
} from "../service";
import { serviceHandler } from ".";

export const getTimeSheet = serviceHandler(findAllTimeSheet);

export const getTimeSheetById = serviceHandler(
    async (req: Request) => await findTimeSheetById(req.params.id),
);

export const getTimeSheetByStaffId = serviceHandler(
    async (req: Request) =>
        await findTimeSheetByStaffId(req.params.id, req.query),
);

export const createTimeSheet = serviceHandler(
    async (req: Request) => await insertTimeSheet(req.body),
);

export const updateTimeSheet = serviceHandler(
    async (req: Request) => await updateTimeSheetById(req.params.id, req.body),
);

export const deleteTimeSheet = serviceHandler(
    async (req: Request) => await deleteTimeSheetById(req.params.id),
);
