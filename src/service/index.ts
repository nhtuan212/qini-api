import { PrismaClient } from "../../dist/generated/client";

export const client = new PrismaClient({
    datasources: {
        db: {
            url:
                process.env.NODE_ENV === "production"
                    ? process.env.PRODUCTION_DATABASE_URL
                    : process.env.DATABASE_URL,
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

export const dbConnection = async () => await client.$connect();

// //** Log all query events for debugging */
// client.$on("query", e => {
//     console.log("Query: " + e.query);
//     console.log("Params: " + e.params);
//     console.log("Duration: " + e.duration + "ms");
// });
