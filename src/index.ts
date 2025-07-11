import "dotenv/config";
import express from "express";
import cron from "node-cron";
import { router } from "./router";
import { dbConnection } from "./service";
import { createTarget } from "./service/targetService";
import { formatDate } from "./utils";

const app = express();
const port = process.env.PORT || 8000;

router(app);

cron.schedule(
    "0 10 * * *",
    async () => {
        console.log("Create target at 10:00 AM every day");
        //** Create target at 5:00 AM every day */
        await createTarget({
            body: {
                name: "Doanh số",
                target_at: formatDate(new Date()),
            } as any,
        });
    },
    {
        timezone: "Asia/Ho_Chi_Minh",
    },
);

cron.schedule(
    "0 8 * * *",
    async () => {
        console.log("Create target at 8:00 AM every day");
        //** Create target at 5:00 AM every day */
        await createTarget({
            body: {
                name: "Doanh số",
                target_at: formatDate(new Date()),
            } as any,
        });
    },
    {
        timezone: "Asia/Ho_Chi_Minh",
    },
);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    dbConnection()
        .then(() => {
            console.log("Database connected successfully!");
        })
        .then(() => {
            console.log(`Example app listening on port ${port}`);
        });
});
