import { Request, Response } from "express";

//** [GET]/ */
export const HomeController = (req: Request, res: Response) => {
    res.json({
        message: "Hello, TypeScript Express!",
    });
};
