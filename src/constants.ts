import { readFileSync } from "fs";

export const RSA_PRIVATE_KEY = readFileSync("./rsa-private-key.pem", "utf8");

export const Pagination = {
    skip: 0,
    limit: 31,
};
