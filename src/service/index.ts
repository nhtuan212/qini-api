import { PrismaClient } from "@prisma/client";
// import { PrismaClient } from "../../prisma/generated/client";
// generator client {
//     provider = "prisma-client-js"
//     output   = "./generated/client"
// }

export const client = new PrismaClient({
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

// // Log all query events for debugging
// prisma.$on("query", e => {
//     console.log("Query: " + e.query);
//     console.log("Params: " + e.params);
//     console.log("Duration: " + e.duration + "ms");
// });
