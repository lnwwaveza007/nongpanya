import { FormDataset } from "@/types";
import { axiosInstance } from "./axiosInstance";

export const getSymptoms = async () => {
    return await axiosInstance.get("/med/symptoms");
}

export const submitSymptoms = async (formData: FormDataset) => {
    return await axiosInstance.post("/med/form", formData);
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

export const getAllMedicines = async () => {
    return await axiosInstance.get("/med");
}

export const getMedInfo = async (detailId: number) => {
    return await axiosInstance.get(`/med/${detailId}/info`);
}