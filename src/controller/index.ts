import { Request, Response } from "express";

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
        return await service(req, res).then(resData => {
            return res.status(resData.code).json({
                ...resData,
            });
        });
    };
};

export * from "./staff.controller";
export * from "./home.controller";
export * from "./shift.controller";
export * from "./user.controller";
export * from "./target.controller";
export * from "./targetShift.controller";
export * from "./timeSheet.controller";
export * from "./login.controller";
export * from "./invoice.controller";
