import express, { Express } from "express";
import { home } from "./home";
import { login } from "./login";
import { user } from "./user";
import { staff } from "./staff";
import { report } from "./report";
import { reportOnStaff } from "./reportOnStaff";
import { shift } from "./shift";

export const router = (app: Express) => {
    // //** Cors */
    // app.use((res: Response, next: NextFunction) => {
    //     res.setHeader("Content-Type", "text/html");
    //     res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
    //     next();
    // });

    // // Add headers before the routes are defined
    // app.use((req: any, res: any, next: any) => {
    //     // Website you wish to allow to connect
    //     res.setHeader("Access-Control-Allow-Origin", "*");

    //     // Request methods you wish to allow
    //     res.setHeader(
    //         "Access-Control-Allow-Methods",
    //         "GET, POST, OPTIONS, PUT, PATCH, DELETE",
    //     );

    //     // Request headers you wish to allow
    //     res.setHeader(
    //         "Access-Control-Allow-Headers",
    //         "X-Requested-With,content-type",
    //     );

    //     // Set to true if you need the website to include cookies in the requests sent
    //     // to the API (e.g. in case you use sessions)
    //     res.setHeader("Access-Control-Allow-Credentials", 1);

    //     // Pass to next layer of middleware
    //     next();
    // });

    app.use(
        // Encoded type urlencoded for Post method
        express.urlencoded({
            extended: false,
        }),
        // Encoded type raw/json for Post method
        express.json({
            type: "application/json",
        }),
    );

    app.use("/", home);
    app.use("/login", login);
    app.use("/user", user);
    app.use("/staff", staff);
    app.use("/report", report);
    app.use("/report-on-staff", reportOnStaff);
    app.use("/shift", shift);
};
