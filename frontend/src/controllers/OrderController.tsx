import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "../axios/http";

export const getOrders = async () => {
  const data = await getRequest("/api/orders");
  if (data) {
    return data;
  } else {
    return "Данных нет";
  }
};

export const deleteOrder = async (id: string) => {
  const data = await deleteRequest(`/api/order/delete/${id}`, {}, { id });
  if (data) {
    return data;
  } else {
    return "Не получилось удалить";
  }
};

export const editOrder = async (
  id: string,
  name_material: string,
  count_material: number,
  price_material: number
) => {
  const data = await putRequest(
    `/api/order/edit/${id}`,
    {},
    { id, name_material, count_material, price_material }
  );
  if (data) {
    return data;
  } else {
    return "Не получилось отредактировать";
  }
};

export const addOrder = async (
  name_material: string,
  count_material: number,
  price_material: number
) => {
  const res = await postRequest(
    `/api/order/add`,
    {},
    { name_material, count_material, price_material }
  );
  if (res) {
    const res2 = await getOrders();
    return res2;
  } else {
    return "Не получилось добавить новый материал";
  }
};
