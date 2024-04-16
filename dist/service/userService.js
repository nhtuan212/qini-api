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
exports.createUser = exports.getUser = void 0;
const _1 = require(".");
const utils_1 = require("../utils");
const getUser = ({ offset, limit }) => __awaiter(void 0, void 0, void 0, function* () {
    const pagination = Object.assign(Object.assign({}, (offset && { skip: Number(offset) })), (limit && { take: Number(limit) }));
    return yield _1.client.users
        .findMany(pagination)
        .then((res) => {
        return res;
    })
        .catch((err) => {
        throw err;
    });
});
exports.getUser = getUser;
const createUser = ({ body }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _1.client.users
        .create({
        data: Object.assign(Object.assign({}, body), { password: yield (0, utils_1.hashPassword)(body.password) }),
    })
        .then(res => {
        return {
            code: 200,
            message: "Create success!",
            data: res,
        };
    })
        .catch(err => {
        var _a;
        if (err.code === "P2002") {
            return {
                code: 400,
                message: `Create failed because "${(_a = err === null || err === void 0 ? void 0 : err.meta) === null || _a === void 0 ? void 0 : _a.target}" already exists!`,
                data: [],
            };
        }
        return {
            code: 404,
            message: err.message,
            data: [],
        };
    });
});
exports.createUser = createUser;
