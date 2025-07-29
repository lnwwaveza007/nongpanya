import { axiosInstance } from "./axiosInstance";

export const getUser = async () => {
    return await axiosInstance.get("/user");
}

export const getUserQuota = async () => {
    return await axiosInstance.get("/user/quota");
}

export const getUserHistory = async () => {
    return await axiosInstance.get("/user/req/history");
}

export const getUserLogs = async (startDate: string, endDate?: string) => {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    if (endDate) {
        params.append('endDate', endDate);
    }
    return await axiosInstance.get(`/med/req/history?${params.toString()}`);
}