import Picture from "../entity/Picture";
import axiosClient from "../restClient/axiosClient";

const endpoint = "/pictures";

export const findAllPictures = async (): Promise<Picture[]> => {
    const response = await axiosClient.get<Picture[]>(endpoint);
    return response.data;
};

export const findPictureById = async (id: string): Promise<Picture> => {
    const response = await axiosClient.get<Picture>(`${endpoint}/${id}`);
    return response.data;
};

export const createPicture = async (picture: Picture): Promise<void> => {
    const requestBody = JSON.stringify(picture);
    await axiosClient.post<Picture>(endpoint, requestBody);
};

export const deletePictureById = async (id: string): Promise<void> => {
    await axiosClient.delete<Picture>(`${endpoint}/${id}`);
};

export const deleteAll = async (): Promise<void> => {
    await axiosClient.delete<Picture>(`${endpoint}/all`);
};