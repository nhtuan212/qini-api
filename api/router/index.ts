import { NextFunction, Response } from "express";
import { homePage } from "./homePage";
import { user } from "./user";

export const router = (app: any) => {
    // //** Cors */
    // app.use((res: Response, next: NextFunction) => {
    //     res.setHeader("Content-Type", "text/html");
    //     res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
    //     next();
    // });

    app.use("/api", homePage);
    app.use("/api/user", user);
};
