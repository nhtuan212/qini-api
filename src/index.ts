import "dotenv/config";
import express from "express";
import { router } from "./router";
import { dbConnection } from "./service";

const app = express();
const port = process.env.PORT || 8000;

router(app);

app.use(express.static("public"));

app.listen(port, () => {
    dbConnection()
        .then(() => {
            console.log("Database connected successfully!");
        })
        .then(() => {
            console.log(`Example app listening on port ${port}`);
        })
        .catch(err => {
            throw err;
        });

    // console.log(`Example app listening on port ${port}`);
});
