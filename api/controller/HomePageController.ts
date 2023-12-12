import { Request, Response } from "express";

//** [GET]/ */
export const HomePageController = (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");

    console.log("=> ", "Database connected successfully!");

    res.json({
        message: "Hello, TypeScript Express!",
    });
};
