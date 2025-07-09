import { CLIENT_ID, CLIENT_SECRET } from "../constants";
import { dataFetching } from "../utils/dataFetching";

// Token state in RAM
let access_token = "";
let expiresAt = 0;

export const TOKEN_API_URL = process.env.TOKEN_API_URL!;

export const getToken = async (): Promise<string> => {
    //** Refresh token if it's expired in 5 minutes */
    if (Date.now() >= expiresAt - 300000) {
        return refreshToken();
    }

    return access_token;
};

const refreshToken = async (): Promise<string> => {
    const formData = new URLSearchParams({
        scopes: "PublicApi.Access",
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
    });

    return await dataFetching(TOKEN_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
    }).then(res => {
        access_token = res.access_token;
        expiresAt = Date.now() + res.expires_in * 1000;

        return access_token;
    });
};
