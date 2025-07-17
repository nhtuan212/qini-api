import { PrismaClient } from "../../dist/generated/client";
import { v4 as uuidv4 } from "uuid";

export const client = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
    log: [
        {
            emit: "event",
            level: "query",
        },
        {
            emit: "event",
            level: "error",
        },
        {
            emit: "event",
            level: "info",
        },
        {
            emit: "event",
            level: "warn",
        },
    ],
});

// const dbConnection = async () => await client.$connect();

// Middleware: generate UUID in code if not provided
const prisma = client.$extends({
    name: "autoUUID",

    query: {
        $allModels: {
            async create({ args, query }) {
                if (!args.data.id) {
                    args.data.id = uuidv4(); // generate UUID
                }
                return query(args);
            },
        },
    },
});

export default prisma;

export const dbConnection = async () => await client.$connect();

// //** Log all query events for debugging */
// client.$on("query", e => {
//     console.log("Query: " + e.query);
//     console.log("Params: " + e.params);
//     console.log("Duration: " + e.duration + "ms");
// });

export * from "./staff.service";
export * from "./shift.service";
export * from "./user.service";
export * from "./target.service";
export * from "./targetShift.service";
export * from "./invoice.service";
export * from "./login.service";
