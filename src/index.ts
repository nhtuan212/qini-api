// import express from "express";
// const app = express();

// app.get("/", (req, res) => {
//     const ipAddress = req.socket.remoteAddress || "";
//     console.log({ ipAddress });
//     res.send("Hello from App Engine!");
// });

// // Listen to the App Engine-specified port, or 8080 otherwise
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}...`);
// });

import "dotenv/config";
import express from "express";
import { router } from "./router";
import { dbConnection } from "./service";

const app = express();
const port = process.env.PORT || 8000;

router(app);

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
