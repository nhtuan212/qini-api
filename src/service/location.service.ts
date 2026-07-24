import { asc, eq } from "drizzle-orm";
import { locationTable, LocationType, db } from "../db";
import { STATUS_CODE } from "../constants";

export type LocationBody = {
    name?: string;
    lat?: number;
    lng?: number;
    radius?: number;
    isActive?: boolean;
};

const MAX_RADIUS_M = 1000;

const isValidCoord = (lat: unknown, lng: unknown): boolean =>
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180;

const validateBody = (body: LocationBody, isCreate: boolean): string | null => {
    if (isCreate || body.name !== undefined) {
        if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
            return "name is required and must be a non-empty string.";
        }
    }

    if (isCreate || body.lat !== undefined || body.lng !== undefined) {
        if (!isValidCoord(body.lat, body.lng)) {
            return "lat must be in [-90, 90] and lng in [-180, 180] (send both).";
        }
    }

    if (body.radius !== undefined) {
        if (
            typeof body.radius !== "number" ||
            !Number.isFinite(body.radius) ||
            body.radius <= 0 ||
            body.radius > MAX_RADIUS_M
        ) {
            return `radius must be a number in (0, ${MAX_RADIUS_M}] meters.`;
        }
    }

    if (body.isActive !== undefined && typeof body.isActive !== "boolean") {
        return "isActive must be a boolean.";
    }

    return null;
};

export const findAllLocation = async () => {
    return await db
        .select()
        .from(locationTable)
        .orderBy(asc(locationTable.name))
        .then(res => ({
            code: STATUS_CODE.SUCCESS,
            message: "Get locations successfully!",
            data: res,
        }));
};

export const insertLocation = async ({ body }: { body: LocationBody }) => {
    const error = validateBody(body, true);
    if (error) {
        return { code: STATUS_CODE.BAD_REQUEST, message: error };
    }

    return await db
        .insert(locationTable)
        .values({
            name: body.name!.trim(),
            lat: body.lat!,
            lng: body.lng!,
            radius: body.radius,
            isActive: body.isActive,
        })
        .returning()
        .then(res => ({
            code: STATUS_CODE.SUCCESS,
            message: "Create location successfully!",
            data: res[0],
        }));
};

export const updateLocationById = async ({
    id,
    body,
}: {
    id: LocationType["id"];
    body: LocationBody;
}) => {
    const error = validateBody(body, false);
    if (error) {
        return { code: STATUS_CODE.BAD_REQUEST, message: error };
    }

    const updated = await db
        .update(locationTable)
        .set({
            ...body,
            name: body.name?.trim() ?? body.name,
            updatedAt: new Date().toISOString(),
        })
        .where(eq(locationTable.id, id))
        .returning();

    if (updated.length === 0) {
        return {
            code: STATUS_CODE.NOT_FOUND,
            message: "Location not found",
        };
    }

    return {
        code: STATUS_CODE.SUCCESS,
        message: "Update location successfully!",
        data: updated[0],
    };
};

export const deleteLocationById = async ({
    id,
}: {
    id: LocationType["id"];
}) => {
    const deleted = await db
        .delete(locationTable)
        .where(eq(locationTable.id, id))
        .returning();

    if (deleted.length === 0) {
        return {
            code: STATUS_CODE.NOT_FOUND,
            message: "Location not found",
        };
    }

    return {
        code: STATUS_CODE.SUCCESS,
        message: "Delete location successfully!",
        data: deleted[0],
    };
};
