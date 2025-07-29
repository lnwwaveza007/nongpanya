import { axiosInstance } from "./axiosInstance";

export const auth = async() => {
    return await axiosInstance.get("/auth");
}

export const signOut = async() => {
    return await axiosInstance.get("/auth/signout");
}

export const redirectAuth = async(code: string) => {
    return await axiosInstance.get("/auth/microsoft/callback", {
        params: { code: code },
    });
}

export const localSignin = async(email: string, password: string) => {
    return await axiosInstance.post("/auth/signin", {
        email,
        password
    });
}