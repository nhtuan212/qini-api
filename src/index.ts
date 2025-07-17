import "dotenv/config";
import express from "express";
import cron from "node-cron";
import { router } from "./router";
// import { createTarget } from "./controller";
import { dbConnection } from "./service";
// import { formatDate } from "./utils";

const app = express();
const port = process.env.PORT || 8000;

router(app);

cron.schedule(
    "0 5 * * *",
    async () => {
        // //** Create target at 5:00 AM every day */
        // await createTarget({
        //     body: {
        //         targetAt: formatDate(new Date()),
        //     },
        // });
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
