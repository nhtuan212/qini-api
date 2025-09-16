import { Request } from "express";
import { serviceHandler } from ".";
import {
    findAllSalary,
    findSalaryById,
    insertSalary,
    updateSalaryById,
} from "../service";

export const getSalary = serviceHandler(findAllSalary);

export const getSalaryById = serviceHandler((req: Request) =>
    findSalaryById({
        id: req?.params?.id,
    }),
);

export const createSalary = serviceHandler((req: Request) =>
    insertSalary({
        body: req.body,
    }),
);

export const updateSalary = serviceHandler((req: Request) =>
    updateSalaryById({
        id: req?.params?.id,
        body: req.body,
    }),
);
