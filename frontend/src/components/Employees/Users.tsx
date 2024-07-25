import { TableCell, TableRow } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React from "react";
import TableData from "../../UI/Table/TableData";
import {
  deleteEmployee,
  editEmployee,
  getEmployees,
  getRoles,
} from "../../controllers/UserController";
import {
  checkIsArrayDataFromModal,
  uniqArrayForModal,
} from "../../utills/dataUtil";
import Header from "../Header/Header";
import styles from "./Users.module.sass";

const columns: GridColDef[] = [
  { field: "fio_user", headerName: "FIO", type: "string" },
  { field: "phone_user", headerName: "Phone Number", type: "number" },
  { field: "name_role", headerName: "Role" },
  { field: "roleSelect", headerName: "Role", type: "select" },
];

const Users: React.FC = () => {
  const [data, setData] = React.useState([]);
  const [dataRoles, setDataRoles] = React.useState<any>([]);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState<string | undefined>(undefined);
  const [editData, setEditData] = React.useState<any>(null);

  const fetchDataRoles = React.useCallback(async () => {
    const roles = await getRoles();
    if (roles.length) {
      setDataRoles(roles);
    } else {
      setDataRoles([]);
    }
  }, []);

  const fetchData = React.useCallback(async () => {
    const dataTable = await getEmployees();
    fetchDataRoles();
    if (dataTable.length) {
      setData(dataTable);
    } else {
      setData([]);
    }
  }, [fetchDataRoles]);

  const handleOpen = React.useCallback((id?: string) => {
    setOpen((openModal) => !openModal);
    setId(id);
  }, []);

  const handleSetCurrentData = React.useCallback(
    (currentData: any) => {
      const newObj = uniqArrayForModal(dataRoles, currentData, "role");
      setEditData(newObj);
    },
    [dataRoles]
  );

  const handleEdit = React.useCallback(
    (data: any) => {
      editEmployee(
        data.id,
        data.fio,
        checkIsArrayDataFromModal(data.roleSelect),
        data.phone
      );
      setOpen(false);
      fetchData();
    },
    [fetchData]
  );

  const handleDelete = React.useCallback(async () => {
    if (id) {
      const data = await deleteEmployee(id);
      await fetchData();
      if (data) setOpen(false);
    }
  }, [fetchData, id]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData, open]);

  return (
    <>
      <Header />
      <h2 className={styles.employees_title}>Users</h2>
      <TableData
        columns={columns}
        openModal={open}
        data={editData}
        handleClose={handleOpen}
        handleEdit={handleEdit}
        handleDelete={handleDelete}>
        {data.length &&
          data.map((row: any) => (
            <TableRow
              key={row.id_user}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              className={styles.table_cell}
              onClick={() => {
                handleOpen(row.id);
                handleSetCurrentData(row);
              }}>
              <TableCell align="left">{row.fio_user}</TableCell>
              <TableCell align="left">{row.phone_user}</TableCell>
              <TableCell align="left">{row.name_role}</TableCell>
            </TableRow>
          ))}
      </TableData>
    </>
  );
};
export default Users;
