import express, { Express } from "express";
import cors from "cors";
import { home } from "./home";
import { login } from "./login";
import { user } from "./user";
import { staff } from "./staff";
import { report } from "./report";
import { reportOnStaff } from "./reportOnStaff";
import { shift } from "./shift";

export const router = (app: Express) => {
    app.use(
        //** Encoded type urlencoded for Post method */
        express.urlencoded({
            extended: false,
        }),
        //** Encoded type raw/json for Post method */
        express.json({
            type: "application/json",
        }),
    );

    if (process.env.NODE_ENV !== "production") {
        //** Cors */
        app.use(cors());
    }

    app.use("/", home);
    app.use("/login", login);
    app.use("/user", user);
    app.use("/staff", staff);
    app.use("/report", report);
    app.use("/report-on-staff", reportOnStaff);
    app.use("/shift", shift);
};
