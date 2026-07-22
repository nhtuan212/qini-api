import express, { Express } from "express";
import cors from "cors";
import { authMiddleware, requireRole } from "../middleware";
import { ROLE } from "../db/schema/enum.schema";
import { homeRouter } from "./home.router";
import { loginRouter } from "./login.router";
import { userRouter } from "./user.router";
import { employeeRouter } from "./employee.router";
import { shiftRouter } from "./shift.router";
import { targetRouter } from "./target.router";
import { targetShiftRouter } from "./targetShift.router";
import { timeSheetRouter } from "./timeSheet.router";
import { invoiceRouter } from "./invoice.router";
import { salaryRouter } from "./salary.router";

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

    //** Public routes — reachable without a token */
    app.use("/", homeRouter);
    app.use("/login", loginRouter);

    //** Auth Middleware */
    app.use(authMiddleware);

    //** Routes with their own per-role authorization */
    app.use("/target", targetRouter);
    app.use("/employee", employeeRouter);
    app.use("/shift", shiftRouter);
    app.use("/target-shift", targetShiftRouter);
    app.use("/time-sheet", timeSheetRouter);
    app.use("/invoice", invoiceRouter);
    app.use("/salary", salaryRouter);

    //** Permission role to call APIs */
    app.use(requireRole(ROLE.ADMIN));

    app.use("/user", userRouter);
};
