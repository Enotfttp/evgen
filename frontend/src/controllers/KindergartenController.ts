import { deleteRequest, getRequest, postRequest, putRequest } from "../axios/http"


export const getKindergartens = async () => {
    const data = await getRequest('/api/kindergartens');
    if (data) {
        return data
    } else {
        return 'Данных нет'
    }
}

export const deleteKindergarten = async (id: string) => {
    const data = await deleteRequest(`/api/kindergarten/delete/${id}`, {}, { id });
    if (data) {
        return data;
    } else {
        return "Не получилось удалить";
    }
};

export const editKindergarten = async (id: string, kindergarten: string) => {
    const res = await putRequest(`/api/kindergarten/edit/${id}`, {}, { id, kindergarten });
    if (res) {
        return res;
    } else {
        return "Не получилось отредактировать";
    }
};

export const addKindergarten = async (kindergarten: string) => {
    const res = await postRequest(`/api/kindergarten/add`, {}, { kindergarten });
    if (res) {
        const res2 = await getKindergartens()
        return res2;
    } else {
        return "Не получилось добавить новый садик";
    }
};
