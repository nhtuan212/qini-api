import express from "express";
const app = express();
import { router } from "../src/router";

// app.get("/api", (req, res) => {
//     res.setHeader("Content-Type", "text/html");
//     res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
//     res.json({ message: "Hello World" });
// });

router(app);
app.use(express.static("public"));

module.exports = app;
