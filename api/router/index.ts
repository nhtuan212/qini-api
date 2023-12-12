import { homePage } from "./homePage";
// import { user, userSlug } from "./user";

export const router = (app: any) => {
    app.use("/", app.get("/", (req: any, res: any) => {
        console.log("=> ", "Database connected successfully!");
        res.send("Hello World!");
    }););

    app.use("/api", homePage);
    // app.use("/api/user", user);
    // app.use("/api/user/a", userSlug);
};
