"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeController = void 0;
//** [GET]/ */
const HomeController = (req, res) => {
    res.json({
        message: "Hello, TypeScript Express!",
    });
};
exports.HomeController = HomeController;
