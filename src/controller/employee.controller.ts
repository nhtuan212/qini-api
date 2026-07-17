import { Request } from "express";
import { serviceHandler } from ".";
import {
    findAllEmployee,
    findEmployeeById,
    insertEmployee,
    removeEmployeeById,
    softDeleteEmployeeById,
    updateEmployeeById,
} from "../service";

export const getEmployee = serviceHandler(findAllEmployee);

export const getEmployeeById = serviceHandler((req: Request) =>
    findEmployeeById({
        id: req?.params?.id,
    }),
);
export const createEmployee = serviceHandler((req: Request) =>
    insertEmployee({
        body: req.body,
    }),
);

export const updateEmployee = serviceHandler((req: Request) =>
    updateEmployeeById({
        id: req.params.id,
        body: req.body,
    }),
);

export const softDeleteEmployee = serviceHandler((req: Request) =>
    softDeleteEmployeeById({
        id: req.params.id,
    }),
);

export const deleteEmployee = serviceHandler((req: Request) =>
    removeEmployeeById({
        id: req.params.id,
    }),
);
