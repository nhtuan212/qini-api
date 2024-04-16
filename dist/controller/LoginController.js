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
exports.Login = void 0;
const loginService_1 = require("../service/loginService");
//** [POST]/login */
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    switch (req.method) {
        //** POST */
        case "POST":
            return yield (0, loginService_1.login)({
                username: req.body.username,
                password: req.body.password,
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
exports.Login = Login;
