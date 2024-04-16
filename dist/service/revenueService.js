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
exports.deleteRevenue = exports.createRevenue = exports.getRevenue = void 0;
const _1 = require(".");
// Get method
const getRevenue = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield _1.client.revenues
        .findMany({
        orderBy: {
            createAt: "desc",
        },
    })
        .then(res => {
        return {
            code: 200,
            message: "Get revenue successfully!",
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
exports.getRevenue = getRevenue;
//** Post method */
// Create
const createRevenue = ({ body }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _1.client.revenues
        .create({
        data: body,
    })
        .then(res => {
        return {
            code: 200,
            message: "Add revenue successfully!",
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
exports.createRevenue = createRevenue;
// Delete method
const deleteRevenue = ({ body }) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = body;
    return yield _1.client.revenues
        .delete({
        where: {
            id,
        },
    })
        .then(res => {
        return {
            code: 200,
            message: "Delete revenue successfully!",
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
exports.deleteRevenue = deleteRevenue;
