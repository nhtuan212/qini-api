import express from "express";
import { v4 } from "uuid";
const app = express();
import { router } from "../src/router";
import { dbConnection } from "../src/service";

app.get("/api", (req, res) => {
    const path = `/api/item/${v4()}`;
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
    res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get("/api/item/:slug", (req, res) => {
    const { slug } = req.params;
    res.end(`Item: ${slug}`);
});

app.use(express.static("public"));

router(app);

console.log("Database connected successfully!");

// dbConnection()
//     .then(() => {
//         console.log("Database connected successfully!");
//     })
//     .catch(err => {
//         throw err;
//     });

module.exports = app;
