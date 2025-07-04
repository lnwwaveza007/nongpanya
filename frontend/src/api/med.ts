import { axiosInstance } from "./axiosInstance";

export const getSymptoms = async () => {
    return await axiosInstance.get("/med/symptoms");
}

export const submitSymptoms = async (formData: FormData) => {
    return await axiosInstance.post("/med/symptoms/submit", formData);
}
