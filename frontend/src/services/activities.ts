import axiosInstance from "./getApi.ts";
import type {Activity} from "../@types/activity";


// Fonctions qui gèrent les activités
export const getActivites= async(): Promise<Activity[]> => {
    const res = await axiosInstance.get('/activities');
    return res.data;
}