import { Request, Response } from "express";

//** [GET]/ */
export const HomePageController = (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");

    res.json({
        message: "Hello, TypeScript Express!",
    });
};
