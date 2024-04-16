"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const home_1 = require("./home");
const login_1 = require("./login");
const user_1 = require("./user");
const staff_1 = require("./staff");
const report_1 = require("./report");
const revenue_1 = require("./revenue");
const router = (app) => {
    // //** Cors */
    // app.use((res: Response, next: NextFunction) => {
    //     res.setHeader("Content-Type", "text/html");
    //     res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
    //     next();
    // });
    // Add headers before the routes are defined
    app.use((req, res, next) => {
        // Website you wish to allow to connect
        res.setHeader("Access-Control-Allow-Origin", "*");
        // Request methods you wish to allow
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
        // Request headers you wish to allow
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader("Access-Control-Allow-Credentials", 1);
        // Pass to next layer of middleware
        next();
    });
    app.use(
    // Encoded type urlencoded for Post method
    express_1.default.urlencoded({
        extended: false,
    }), 
    // Encoded type raw/json for Post method
    express_1.default.json({
        type: "application/json",
    }));
    app.use("/", home_1.home);
    app.use("/login", login_1.login);
    app.use("/user", user_1.user);
    app.use("/staff", staff_1.staff);
    app.use("/report", report_1.report);
    app.use("/revenue", revenue_1.revenue);
};
exports.router = router;
