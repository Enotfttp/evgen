import { TableCell, TableRow } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React from "react";
import {
  addAct,
  deleteAct,
  editAct,
  getActs,
  getActsAdm,
  getStatusesCi,
  getStatusesCp,
  getTypeWork,
  getUsers,
} from "../../controllers/ActsController";
import TableData from "../../UI/Table/TableData";
import {
  checkIsArrayDataFromModal,
  uniqArrayForModal,
} from "../../utills/dataUtil";
import { dateConverter } from "../../utills/dateUtills";
import { roles } from "../../utills/roleUtills";
import Header from "../Header/Header";
import styles from "./Acts.module.sass";

const columns: GridColDef[] = [
  { field: "id_act", headerName: "№ Акт", type: "number" },
  { field: "num_document", headerName: "Договор", type: "number" },
  { field: "organization", headerName: "Организация", type: "string" },
  { field: "date_input", headerName: "Дата приёма", type: "date" },
  { field: "date_export", headerName: "Дата сдачи", type: "date" },
  { field: "name_status_cp", headerName: "Работа СП" },
  { field: "name_status_ci", headerName: "Работа СИ" },
  { field: "name_type", headerName: "Вид работ" },
  { field: "name_status_cpSelect", headerName: "Работа СП", type: "select" },
  { field: "name_status_ciSelect", headerName: "Работа СИ", type: "select" },
  { field: "name_typeSelect", headerName: "Вид работ", type: "select" },
  { field: "fio_user", headerName: "ФИО заказчика" },
  { field: "fio_userSelect", headerName: "ФИО заказчика", type: "select" },
];
const Acts: React.FC = () => {
  const [data, setData] = React.useState([]);
  const [dataStatusesCp, setDataStatusesCp] = React.useState<any>([]);
  const [dataStatusesCi, setDataStatusesCi] = React.useState<any>([]);
  const [dataTypeWork, setDataTypeWork] = React.useState<any>([]);
  const [dataUsers, setDataUsers] = React.useState<any>([]);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState<string | undefined>(undefined);
  const [editData, setEditData] = React.useState<any>(null);

  const fetchDataUsers = React.useCallback(async () => {
    const users = await getUsers();
    if (users.length) {
      const res = users.map((el: any) => ({
        id: el.id_user,
        name: el.fio_user,
      }));
      setDataUsers(res);
    } else {
      setDataUsers([]);
    }
  }, []);

  const fetchDataStatusesCp = React.useCallback(async () => {
    const statusesCp = await getStatusesCp();
    if (statusesCp.length) {
      const res = statusesCp.map((el: any) => ({
        id: el.id_status_cp,
        name: el.name_status_cp,
      }));
      setDataStatusesCp(res);
    } else {
      setDataStatusesCp([]);
    }
  }, []);

  const fetchDataStatusesCi = React.useCallback(async () => {
    const statusesCi = await getStatusesCi();
    if (statusesCi.length) {
      const res = statusesCi.map((el: any) => ({
        id: el.id_status_ci,
        name: el.name_status_ci,
      }));
      setDataStatusesCi(res);
    } else {
      setDataStatusesCi([]);
    }
  }, []);
  const fetchTypeWork = React.useCallback(async () => {
    const typeWork = await getTypeWork();
    if (typeWork.length) {
      const res = typeWork.map((el: any) => ({
        id: el.id_type,
        name: el.name_type,
      }));
      setDataTypeWork(res);
    } else {
      setDataTypeWork([]);
    }
  }, []);

  const fetchData = React.useCallback(async () => {
    let dataTable;
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("id");
    if (role === roles.customer) dataTable = await getActs(Number(id));
    else dataTable = await getActsAdm();
    fetchDataStatusesCp();
    fetchDataStatusesCi();
    fetchDataUsers();
    fetchTypeWork();
    if (dataTable.length) {
      setData(dataTable);
    } else {
      setData([]);
    }
  }, [fetchDataStatusesCi, fetchDataStatusesCp, fetchDataUsers, fetchTypeWork]);

  const handleOpen = React.useCallback((id?: string) => {
    setOpen((openModal) => !openModal);
    setId(id);
  }, []);

  const handleSetCurrentData = React.useCallback(
    (currentData: any) => {
      let newObj = uniqArrayForModal(
        dataStatusesCi,
        currentData,
        "name_status_ci"
      );
      newObj = uniqArrayForModal(dataStatusesCp, newObj, "name_status_cp");
      newObj = uniqArrayForModal(dataTypeWork, newObj, "type_work");
      newObj = uniqArrayForModal(dataUsers, newObj, "fio_user");

      setEditData(newObj);
    },
    [dataStatusesCi, dataStatusesCp, dataTypeWork, dataUsers]
  );

  const handleAdd = React.useCallback(
    (data: any) => {
      console.log("data123 = ", data);
      addAct(
        data.id_act,
        data.num_document,
        data.organization,
        dateConverter(data.date_input, "date"),
        dateConverter(data.date_export, "date"),
        checkIsArrayDataFromModal(data.name_typeSelect),
        checkIsArrayDataFromModal(data.name_status_cpSelect),
        checkIsArrayDataFromModal(data.name_status_ciSelect),
        data.fio_userSelect.id
      ).then(() => {
        fetchData();
        setOpen(false);
      });
    },
    [fetchData]
  );

  const handleEdit = React.useCallback(
    (data: any) => {
      editAct(
        data.id_act,
        data.num_document,
        data.organization,
        dateConverter(data.date_input, "date"),
        dateConverter(data.date_export, "date"),
        checkIsArrayDataFromModal(data.type_workSelect),
        checkIsArrayDataFromModal(data.name_status_cpSelect),
        checkIsArrayDataFromModal(data.name_status_ciSelect)
      ).then(() => {
        fetchData();
        setOpen(false);
      });
    },
    [fetchData]
  );

  const handleDelete = React.useCallback(async () => {
    if (id) {
      const data = await deleteAct(id);
      await fetchData();
      if (data) setOpen(false);
    }
  }, [fetchData, id]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Header />
      <h2 className={styles.employees_title}>Акты</h2>
      <TableData
        columns={columns}
        openModal={open}
        data={
          editData || {
            name_typeSelect: dataTypeWork,
            name_status_ciSelect: dataStatusesCi,
            name_status_cpSelect: dataStatusesCp,
            fio_userSelect: dataUsers,
          }
        }
        handleClose={handleOpen}
        handleEdit={handleEdit}
        handleAdd={handleAdd}
        handleDelete={handleDelete}>
        {!!data.length &&
          data.map((row: any) => (
            <TableRow
              key={row.id_act}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              className={styles.table_cell}
              onClick={() => {
                handleOpen(row.id_act);
                handleSetCurrentData(row);
              }}>
              <TableCell align="left">{row.id_act}</TableCell>
              <TableCell align="left">{row.num_document}</TableCell>
              <TableCell align="left">{row.organization}</TableCell>
              <TableCell align="left">{row.date_input}</TableCell>
              <TableCell align="left">{row.date_export}</TableCell>
              <TableCell align="left">{row.name_status_cp}</TableCell>
              <TableCell align="left">{row.name_status_ci}</TableCell>
              <TableCell align="left">{row.name_type}</TableCell>
              <TableCell align="left">{row.fio_user}</TableCell>
            </TableRow>
          ))}
      </TableData>
    </>
  );
};
export default Acts;
