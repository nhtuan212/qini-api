"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Staff = void 0;
const staffService_1 = require("../service/staffService");
//** [GET]/user */
const Staff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    switch (req.method) {
        //** GET */
        case "GET":
            return yield (0, staffService_1.getStaff)({
                id: (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id,
            })
                .then(resData => {
                // Destructure data
                const { code, data } = resData;
                return res.status(code).json({
                    code,
                    data,
                });
            })
                .catch(err => {
                throw err;
            });
        //** POST */
        case "POST":
            return (0, staffService_1.createStaff)({
                body: req.body,
            })
                .then(resData => {
                // Destructure data
                const { code, message, data } = resData;
                return res.status(code).json({
                    code,
                    message,
                    data,
                });
            })
                .catch(err => {
                throw err;
            });
        //** PUT */
        case "PUT":
            return (0, staffService_1.editStaff)({
                id: req.params.id,
                body: req.body,
            })
                .then(resData => {
                // Destructure data
                const { code, message, data } = resData;
                return res.status(code).json({
                    code,
                    message,
                    data,
                });
            })
                .catch(err => {
                throw err;
            });
        //** DELETE */
        case "DELETE":
            return (0, staffService_1.deleteStaff)({
                body: req.body,
            })
                .then(resData => {
                // Destructure data
                const { code, message, data } = resData;
                return res.status(code).json({
                    code,
                    message,
                    data,
                });
            })
                .catch(err => {
                throw err;
            });
        //** Default */
        default:
            return res.json({
                message: "Sorry, something wrong method!",
            });
    }
});
exports.Staff = Staff;
