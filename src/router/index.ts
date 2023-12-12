import { homePage } from "./homePage";
import { user, userSlug } from "./user";

export const router = (app: any) => {
    app.use("/api/home", homePage);
    app.use("/api/user", user);
    app.use("/api/user/a", userSlug);
};
