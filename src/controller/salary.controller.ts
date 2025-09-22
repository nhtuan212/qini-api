import { Request } from "express";
import { serviceHandler } from ".";
import {
    findAllSalary,
    findSalaryByStaffId,
    insertSalary,
    updateSalaryById,
    deleteSalaryById,
} from "../service";

export const getSalary = serviceHandler((req: Request) =>
    findAllSalary({
        query: req.query,
    }),
);

export const getSalaryByStaffId = serviceHandler((req: Request) =>
    findSalaryByStaffId({
        id: req?.params?.id,
        query: req.query,
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

export const deleteSalary = serviceHandler((req: Request) =>
    deleteSalaryById({
        id: req.params.id,
    }),
);
