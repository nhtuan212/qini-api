import { readFileSync } from "fs";

export const RSA_PRIVATE_KEY = readFileSync("./rsa-private-key.pem", "utf8");

export const KIOT_URL = process.env.KIOT_API_URL;
export const RETAILER = process.env.RETAILER;
export const CLIENT_ID = process.env.CLIENT_ID || "";
export const CLIENT_SECRET = process.env.CLIENT_SECRET || "";

export const Pagination = {
    skip: 0,
    limit: 31,
};

export const STATUS_CODE = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    ERROR: 500,
};

export const LIMIT = 20;
