import express, { Express } from "express";
import cors from "cors";
import { homeRouter } from "./home.router";
import { loginRouter } from "./login.router";
import { userRouter } from "./user.router";
import { staffRouter } from "./staff.router";
import { shiftRouter } from "./shift.router";
import { targetRouter } from "./target.router";
import { targetShift } from "./targetShift";
import { timeSheet } from "./timeSheet";
import { invoiceRouter } from "./invoice.router";

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
    app.use("/login", loginRouter);
    app.use("/user", userRouter);
    app.use("/staff", staffRouter);
    app.use("/shift", shiftRouter);
    app.use("/target", targetRouter);
    app.use("/target-shift", targetShift);
    app.use("/time-sheet", timeSheet);
    app.use("/invoice", invoiceRouter);
};
