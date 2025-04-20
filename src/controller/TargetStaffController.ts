import { Request, Response } from "express";
import { getTargetStaffByQueryRaw } from "../service/targetStaffService";

//** [Method]/targetStaff */
export const TargetStaff = async (req: Request, res: Response) => {
    switch (req.method) {
        case "GET":
            return await getTargetStaffByQueryRaw(req).then(resData => {
                const { code, message, data } = resData;

                return res.status(code).json({
                    code,
                    message,
                    data,
                });
            });

        default:
            return res.json({
                message: "Sorry, something wrong method!",
            });
    }
};
