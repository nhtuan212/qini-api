import { homePage } from "./homePage";
import { user, userSlug } from "./user";

export const router = (app: any) => {
    app.use("/", homePage);
    app.use("/user", user);
    app.use("/user/a", userSlug);
};
