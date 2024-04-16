"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.report = void 0;
const express_1 = __importDefault(require("express"));
const ReportController_1 = require("../controller/ReportController");
const router = express_1.default.Router();
exports.report = router.get("/", ReportController_1.Report);
router.get("/revenue/:id", ReportController_1.Report);
router.get("/staff/:id", ReportController_1.Report);
router.get("/salary/", ReportController_1.Report);
router.post("/", ReportController_1.Report);
