import { axiosInstance } from "./axiosInstance";

export const getUser = async () => {
    return await axiosInstance.get("/user");
}

export const getUserQuota = async () => {
    return await axiosInstance.get("/user/quota");
}