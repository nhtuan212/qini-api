// import { NextFunction, Response } from "express";
import { home } from "./home";
import { user } from "./user";

export const router = (app: any) => {
    // //** Cors */
    // app.use((res: Response, next: NextFunction) => {
    //     res.setHeader("Content-Type", "text/html");
    //     res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
    //     next();
    // });

    // Add headers before the routes are defined
    app.use((req: any, res: any, next: any) => {
        // Website you wish to allow to connect
        res.setHeader("Access-Control-Allow-Origin", "*");

        // Request methods you wish to allow
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS, PUT, PATCH, DELETE",
        );

        // Request headers you wish to allow
        res.setHeader(
            "Access-Control-Allow-Headers",
            "X-Requested-With,content-type",
        );

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader("Access-Control-Allow-Credentials", 1);

        // Pass to next layer of middleware
        next();
    });

    app.use("/", home);
    app.use("/user", user);
};
