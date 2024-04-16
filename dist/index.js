"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const router_1 = require("./router");
const service_1 = require("./service");
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
(0, router_1.router)(app);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    (0, service_1.dbConnection)()
        .then(() => {
        console.log("Database connected successfully!");
    })
        .then(() => {
        console.log(`Example app listening on port ${port}`);
    });
});
