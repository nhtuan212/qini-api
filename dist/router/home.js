"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.home = void 0;
const express_1 = __importDefault(require("express"));
const HomeController_1 = require("../controller/HomeController");
const router = express_1.default.Router();
exports.home = router.get("/", HomeController_1.HomeController);
