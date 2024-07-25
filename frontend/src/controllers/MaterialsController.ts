import { deleteRequest, getRequest, postRequest, putRequest } from "../axios/http";

export const getMaterials = async () => {
    const data = await getRequest("/api/materials");
    if (data) {
        return data;
    } else {
        return "Данных нет";
    }
};

export const deleteMaterial = async (id: string) => {
    const data = await deleteRequest(`/api/material/delete/${id}`, {}, { id });
    if (data) {
        return data;
    } else {
        return "Не получилось удалить";
    }
};

export const editMaterial = async (id: string, name_material: string, count_material: number, price_material: number) => {
    const data = await putRequest(`/api/material/edit/${id}`, {}, { id, name_material, count_material, price_material });
    if (data) {
        return data;
    } else {
        return "Не получилось отредактировать";
    }
};

export const addMaterial = async (name_material: string, count_material: number, price_material: number) => {
    const res = await postRequest(`/api/material/add`, {}, { name_material, count_material, price_material });
    if (res) {
        const res2 = await getMaterials()
        return res2;
    } else {
        return "Не получилось добавить новый материал";
    }
};
