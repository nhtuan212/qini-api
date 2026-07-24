import { Request } from "express";
import { serviceHandler } from ".";
import {
    findAllLocation,
    insertLocation,
    updateLocationById,
    deleteLocationById,
} from "../service";

export const getLocation = serviceHandler(findAllLocation);

export const createLocation = serviceHandler(insertLocation);

export const updateLocation = serviceHandler(
    async (req: Request) =>
        await updateLocationById({
            id: req.params.id,
            body: req.body,
        }),
);

export const deleteLocation = serviceHandler(
    async (req: Request) =>
        await deleteLocationById({
            id: req.params.id,
        }),
);
