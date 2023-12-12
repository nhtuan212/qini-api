import "dotenv/config";
import express from "express";
import { router } from "../src/router";
import { dbConnection } from "../src/service";

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

// import express from "express";
// import { v4 } from "uuid";
// const app = express();

// app.get("/api", (req, res) => {
//     const path = `/api/item/${v4()}`;
//     res.setHeader("Content-Type", "text/html");
//     res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
//     res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
// });

// app.get("/api/item/:slug", (req, res) => {
//     const { slug } = req.params;
//     res.end(`Item: ${slug}`);
// });

// module.exports = app;
