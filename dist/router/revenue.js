"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revenue = void 0;
const express_1 = __importDefault(require("express"));
const RevenueController_1 = require("../controller/RevenueController");
const router = express_1.default.Router();
exports.revenue = router.get("/", RevenueController_1.Revenue);
router.post("/", RevenueController_1.Revenue);
router.delete("/", RevenueController_1.Revenue);
