import { deleteRequest, getRequest, putRequest } from "../axios/http";

export const getEmployees = async () => {
    const data = await getRequest("/api/users");
    if (data) {
        const id = localStorage.getItem("id");
        console.log('data = ', data);
        const res = data.filter((el: any) => el.id !== Number(id));
        return res;
    } else {
        return "Данных нет";
    }
};

export const getRoles = async () => {
    const data = await getRequest("/api/roles");
    if (data) {
        const res = data.map((el: any) => ({ id: el.id, name: el.role }))
        return res;
    } else {
        return "Данных нет";
    }
};

export const deleteEmployee = async (id: string) => {
    const data = await deleteRequest(`/api/user/delete/${id}`, {}, { id });
    if (data) {
        return data;
    } else {
        return "Не получилось удалить";
    }
};

export const editEmployee = async (id: string, fio: string, idRole: number, phoneNumber: number) => {
    const data = await putRequest(`/api/user/edit/${id}`, {}, { id, fio, idRole, phoneNumber });
    if (data) {
        return data;
    } else {
        return "Не получилось отредактировать";
    }
};
