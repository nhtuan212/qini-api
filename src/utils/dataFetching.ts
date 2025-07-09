import { getToken, TOKEN_API_URL } from "../libs/token";
import { RETAILER } from "../constants";

export const dataFetching = async (
    url: string,
    options: RequestInit = {},
): Promise<any> => {
    const token = !url.includes(TOKEN_API_URL) ? await getToken() : null;

    return await fetch(url, {
        method: "GET",

        ...options,

        headers: {
            "Content-Type": "application/json",
            ...options.headers,

            ...(!url.includes(TOKEN_API_URL) && {
                Retailer: RETAILER,
            }),

            ...(token && {
                Authorization: `Bearer ${token}`,
            }),
        },
    }).then(async res => {
        if (!res.ok) {
            throw new Error(`Fetch failed: ${res.status}`);
        }

        return res.json();
    });
};
