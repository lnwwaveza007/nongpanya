import { axiosInstance } from "./axiosInstance";

export const getSymptoms = async () => {
    return await axiosInstance.get("/med/symptoms");
}

export const submitSymptoms = async (formData: FormData) => {
    return await axiosInstance.post("/med/symptoms/submit", formData);
}

export const getMedStock = async () => {
    return await axiosInstance.get("/med/stock?expired=true");
}

export const getMedRanking = async () => {
    return await axiosInstance.get("/med/req/rank");
}

export const getMedRequest = async (date: string) => {
    return await axiosInstance.get(`/med/req/timeseries?date=${date}`);
}