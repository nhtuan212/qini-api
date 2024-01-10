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

    app.use("/", home);
    app.use("/user", user);
};
