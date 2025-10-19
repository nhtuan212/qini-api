import { Request } from "express";
import { serviceHandler } from ".";
import {
    findAllWorkAssignment,
    findWorkAssignmentById,
    updateWorkAssignmentById,
    removeWorkAssignmentById,
    insertWorkAssignment,
} from "../service";

export const getWorkAssignment = serviceHandler(findAllWorkAssignment);
export const getWorkAssignmentById = serviceHandler(
    async (req: Request) => await findWorkAssignmentById({ id: req.params.id }),
);
export const createWorkAssignment = serviceHandler(insertWorkAssignment);
export const updateWorkAssignment = serviceHandler(
    async (req: Request) =>
        await updateWorkAssignmentById({
            id: req.params.id,
            body: req.body,
        }),
);
export const deleteWorkAssignment = serviceHandler(
    async (req: Request) =>
        await removeWorkAssignmentById({
            id: req.params.id,
        }),
);
