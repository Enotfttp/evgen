import { deleteRequest, getRequest, putRequest, postRequest } from "../axios/http";

export const getActs = async (id: number) => {
    const data = await getRequest("/api/acts", {}, { id });
    if (data) {
        return data;
    } else {
        return "Данных нет";
    }
};

export const getActsAdm = async () => {
    const data = await getRequest("/api/acts_adm");
    if (data) {
        return data;
    } else {
        return "Данных нет";
    }
};
export const getUsers = async () => {
    const data = await getRequest("/api/users");
    if (data) {
        return data;
    } else {
        return "Данных нет";
    }
};

export const getStatusesCp = async () => {
    const data = await getRequest("/api/statuses_cp");
    if (data) {
        return data;
    } else {
        return "Данных нет";
    }
};

export const getStatusesCi = async () => {
    const data = await getRequest("/api/statuses_ci");
    if (data) {
        return data;
    } else {
        return "Данных нет";
    }
};

export const getTypeWork = async () => {
    const data = await getRequest("/api/type_work");
    if (data) {
        return data;
    } else {
        return "Данных нет";
    }
};

export const deleteAct = async (id: string) => {
    const data = await deleteRequest(`/api/act/delete/${id}`, {}, { id });
    if (data) {
        return data;
    } else {
        return "Не получилось удалить";
    }
};

export const editAct = async (id: string, num_document: string, organization: string, date_input: string, date_export: string, id_type: number, id_status_cp: number, id_status_ci: number) => {

    const data = await putRequest(`/api/act/edit/${id}`, {}, {
        id,
        num_document,
        organization,
        date_input,
        date_export,
        id_type,
        id_status_cp,
        id_status_ci,
    });
    if (data) {
        return data;
    } else {
        return "Не получилось отредактировать";
    }
};

export const addAct = async (num_document: string, organization: string, date_input: string, date_export: string, id_type: number, id_status_cp: number, id_status_ci: number, id_user: number) => {

    const data = await postRequest(`/api/act/add`, {}, {
        num_document,
        organization,
        date_input,
        date_export,
        id_type,
        id_status_cp,
        id_status_ci,
        id_user
    });
    if (data) {
        return data;
    } else {
        return "Не получилось отредактировать";
    }
};
