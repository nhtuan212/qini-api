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

cron.schedule("30 9 * * *", async () => {
    console.log("Create target at 9:30 AM every day", formatDate(new Date()));
    //** Create target at 5:00 AM every day */
    await createTarget({
        body: {
            name: "Doanh số",
            target_at: formatDate(new Date()),
        } as any,
    });
});

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
