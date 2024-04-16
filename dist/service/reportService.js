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
exports.createReport = exports.getReport = void 0;
const _1 = require(".");
const utils_1 = require("../utils");
// Get method
const getReport = ({ path, id, query, }) => __awaiter(void 0, void 0, void 0, function* () {
    const whereByDate = Object.assign({}, (Object.keys(query).length > 0 && Object.assign(Object.assign({}, (query.staffId && { staffId: query.staffId })), ((0, utils_1.isDateValid)(query.startDate) &&
        (0, utils_1.isDateValid)(query.endDate) && {
        createAt: {
            gte: new Date(query.startDate),
            lte: new Date(`${query.endDate}T23:59:59.999Z`), // End of day
        },
    }))));
    if (path.includes("salary")) {
        const staff = yield _1.client.staffs.findMany();
        return yield _1.client.reports
            .groupBy({
            by: ["staffId"],
            _sum: {
                target: true,
                timeWorked: true,
            },
            where: Object.assign({}, whereByDate),
        })
            .then(res => {
            const maxTarget = Math.max(...res.map(item => item._sum.target /
                item._sum.timeWorked));
            const secondMaxTarget = Math.max(...res
                .map(item => item._sum.target /
                item._sum.timeWorked)
                .filter(item => item !== maxTarget));
            return {
                code: 200,
                message: "Get report by staff successfully!",
                data: res.map(item => {
                    var _a, _b;
                    const staffName = (_a = staff.find(staffItem => staffItem.id === item.staffId)) === null || _a === void 0 ? void 0 : _a.name;
                    const salary = ((_b = staff.find(staffItem => staffItem.id === item.staffId)) === null || _b === void 0 ? void 0 : _b.salary) || 0;
                    const totalTarget = item._sum.target;
                    const totalTime = item._sum.timeWorked;
                    const salaryByTime = totalTime * salary;
                    const performance = totalTarget / totalTime;
                    let rank = "";
                    let rate = 0;
                    let total = 0;
                    switch (performance) {
                        case maxTarget:
                            rank = "A";
                            rate = 0.012;
                            total = salaryByTime + totalTarget * rate;
                            break;
                        case secondMaxTarget:
                            rank = "B";
                            rate = 0.011;
                            total = salaryByTime + totalTarget * rate;
                            break;
                        default:
                            rank = "normal";
                            rate = 0.01;
                            total = salaryByTime + totalTarget * rate;
                            break;
                    }
                    return Object.assign({ staffName,
                        salary,
                        rank,
                        rate,
                        totalTarget,
                        totalTime,
                        total,
                        performance }, item);
                }),
            };
        });
    }
    return yield _1.client.reports
        .findMany({
        orderBy: {
            createAt: "desc",
        },
        where: Object.assign(Object.assign(Object.assign({}, (path.includes("revenue") && { revenueId: id })), (path.includes("staff") && { staffId: id })), whereByDate),
        include: {
            staff: {
                select: {
                    // id: true,
                    name: true,
                },
            },
        },
    })
        .then(res => {
        return {
            code: 200,
            message: "Get report successfully!",
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
exports.getReport = getReport;
// Post method
const createReport = ({ body }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _1.client.reports
        .createMany({
        data: body,
    })
        .then(res => {
        return {
            code: 200,
            message: "Add report successfully!",
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
exports.createReport = createReport;
