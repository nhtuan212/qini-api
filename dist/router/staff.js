"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staff = void 0;
const express_1 = __importDefault(require("express"));
const StaffController_1 = require("../controller/StaffController");
const router = express_1.default.Router();
exports.staff = router.get("/", StaffController_1.Staff);
router.post("/", StaffController_1.Staff);
router.get("/:id", StaffController_1.Staff);
router.put("/:id", StaffController_1.Staff);
router.delete("/", StaffController_1.Staff);
