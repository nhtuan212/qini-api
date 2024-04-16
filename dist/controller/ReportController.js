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
exports.Report = void 0;
const reportService_1 = require("../service/reportService");
//** [Method]/report */
const Report = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    switch (req.method) {
        //** GET */
        case "GET":
            return yield (0, reportService_1.getReport)({
                path: req.route.path,
                id: req.params.id,
                query: req.query,
            }).then(resData => {
                // Destructure data
                const { code, message, data } = resData;
                return res.status(code).json({
                    code,
                    message,
                    data,
                });
            });
        //** POST */
        case "POST":
            return yield (0, reportService_1.createReport)({
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
exports.Report = Report;
