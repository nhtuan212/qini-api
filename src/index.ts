import "dotenv/config";
import express from "express";
import { router } from "./router";
import { dbConnection } from "./service";
import { createTarget } from "./service/targetService";
import cron from "node-cron";

const app = express();
const port = process.env.PORT || 8000;

router(app);

cron.schedule("0 7 * * *", async () => {
    //** Create target at 7:00 AM every day */
    await createTarget({
        body: {
            name: "Doanh số",
            target_at: new Date(),
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
