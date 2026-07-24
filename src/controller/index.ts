import { Request, Response } from "express";
import { STATUS_CODE } from "../constants";

export const serviceHandler = (service: {
    (
        req: Request,
        res: Response,
    ): Promise<{
        code: number;
        message: string;
        data?: object;
    }>;
}) => {
    return async (req: Request, res: Response) => {
        try {
            const resData = await service(req, res);
            return res.status(resData.code).json({
                ...resData,
            });
        } catch (error) {
            return res.status(STATUS_CODE.ERROR).json({
                code: STATUS_CODE.ERROR,
                message:
                    error instanceof Error
                        ? error.message
                        : "Internal Server Error",
            });
        }
    };
};

export * from "./employee.controller";
export * from "./home.controller";
export * from "./shift.controller";
export * from "./user.controller";
export * from "./target.controller";
export * from "./targetShift.controller";
export * from "./timeSheet.controller";
export * from "./login.controller";
export * from "./invoice.controller";
export * from "./salary.controller";
export * from "./location.controller";
