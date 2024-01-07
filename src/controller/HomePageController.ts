import { Request, Response } from "express";

//** [GET]/ */
export const HomePageController = (req: Request, res: Response) => {
    res.json({
        message: "Hello, TypeScript Express!",
    });
};
