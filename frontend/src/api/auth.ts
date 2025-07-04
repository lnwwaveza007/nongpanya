import { axiosInstance } from "./axiosInstance";

export const auth = async() => {
    return await axiosInstance.get("/auth");
}

export const redirectAuth = async(code: string) => {
    return await axiosInstance.get("/auth/microsoft/callback", {
        params: { code: code },
    });
}