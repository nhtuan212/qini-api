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
exports.login = void 0;
const _1 = require(".");
const utils_1 = require("../utils");
const login = ({ username, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield _1.client.users.findUnique({
        where: { username },
    });
    if (!user) {
        return {
            code: 401,
            message: "User or Password incorrectly!",
        };
    }
    const passwordValid = yield (0, utils_1.passwordCompare)(password, user.password);
    if (!passwordValid) {
        return {
            code: 401,
            message: "User or Password incorrectly!",
        };
    }
    return {
        code: 200,
        message: "Create success!",
        data: user,
    };
});
exports.login = login;
