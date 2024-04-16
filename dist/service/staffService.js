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
exports.deleteStaff = exports.editStaff = exports.createStaff = exports.getStaff = void 0;
const _1 = require(".");
const getStaff = ({ id }) => __awaiter(void 0, void 0, void 0, function* () {
    if (id) {
        return yield _1.client.staffs
            .findUnique({
            where: { id },
        })
            .then((res) => {
            return {
                code: 200,
                message: "Get Staff id successfully!",
                data: res,
            };
        })
            .catch((err) => {
            throw err;
        });
    }
    return yield _1.client.staffs
        .findMany({
        orderBy: {
            createAt: "desc",
        },
    })
        .then((res) => {
        return {
            code: 200,
            message: "Get Staff successfully!",
            data: res,
        };
    })
        .catch((err) => {
        throw err;
    });
});
exports.getStaff = getStaff;
const createStaff = ({ body }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _1.client.staffs
        .create({
        data: Object.assign({}, body),
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
exports.createStaff = createStaff;
const editStaff = ({ id, body }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _1.client.staffs
        .update({
        where: { id },
        data: Object.assign(Object.assign({}, body), { updateAt: new Date().toISOString() }),
    })
        .then(res => {
        return {
            code: 200,
            message: "Get staff successfully!",
            data: res,
        };
    })
        .catch(err => {
        var _a;
        if (err.code === "P2002") {
            return {
                code: 404,
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
exports.editStaff = editStaff;
const deleteStaff = ({ body }) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = body;
    return yield _1.client.staffs
        .delete({
        where: {
            id,
        },
    })
        .then(res => {
        return {
            code: 200,
            message: "Delete staff successfully!",
            data: res,
        };
    })
        .catch(err => {
        return {
            code: 404,
            message: err.message,
            data: [],
        };
    });
});
exports.deleteStaff = deleteStaff;
