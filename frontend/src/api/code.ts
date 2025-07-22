import { axiosInstance } from "./axiosInstance";

export const getCode = async () => {
    return await axiosInstance.get('/code');
}

export const validateCode = async (code: string) => {
    return await axiosInstance.get(`/code/validate?code=${code}`);
}