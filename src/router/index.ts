import express, { Express } from "express";
import cors from "cors";
import { homeRouter } from "./home.router";
import { login } from "./login";
import { user } from "./user";
import { staffRouter } from "./staff.router";
import { shift } from "./shift";
import { target } from "./target";
import { targetShift } from "./targetShift";
import { timeSheet } from "./timeSheet";
import { invoice } from "./invoice";

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

    app.use("/", homeRouter);
    app.use("/login", login);
    app.use("/user", user);
    app.use("/staff", staffRouter);
    app.use("/target", target);
    app.use("/shift", shift);
    app.use("/target-shift", targetShift);
    app.use("/time-sheet", timeSheet);
    app.use("/invoice", invoice);
};
