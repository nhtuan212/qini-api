"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const express_1 = __importDefault(require("express"));
const LoginController_1 = require("../controller/LoginController");
const router = express_1.default.Router();
exports.login = router.post("/", LoginController_1.Login);
