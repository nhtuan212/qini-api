import { Request, Response } from "express";

export const getHome = async (_: Request, res: Response) => {
    res.json({
        message: "Hello, TypeScript Express!",
    });
};
