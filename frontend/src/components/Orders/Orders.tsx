import { TableCell, TableRow } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React from "react";
import TableData from "../../UI/Table/TableData";
import { deleteOrder, getOrders } from "../../controllers/OrderController";
import Header from "../Header/Header";
import styles from "./Orders.module.sass";

const columns: GridColDef[] = [
  { field: "id_order", headerName: "Number Order", type: "number" },
  {
    field: "date_order",
    headerName: "Date Order",
    type: "string",
  },
  {
    field: "name_kindergarten",
    headerName: "Name Kindergarte",
    type: "string",
  },
  { field: "name_status", headerName: "Name Status", type: "string" },  
  { field: "full_price", headerName: "Full Price", type: "string" },
  { field: "comment", headerName: "Сomment", type: "string" },
];

const Orders: React.FC = () => {
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState<string | undefined>(undefined);
  const [editData, setEditData] = React.useState<any>(null);
  const fetchData = React.useCallback(async () => {
    const dataTable = await getOrders();
    if (dataTable.length) {
      setData(dataTable);
    } else {
      setData([]);
    }
  }, []);

  const handleOpen = React.useCallback((id?: string) => {
    setOpen((openModal) => !openModal);
    setId(id);
  }, []);

  const handleSetCurrentData = React.useCallback((currentData: any) => {
    setEditData(currentData);
  }, []);

  const handleAdd = React.useCallback(async (data: any) => {
    //const dataTable = await addOrder(data.name_kindergarten);
    //setData(dataTable);
    //setOpen(false);
  }, []);

  const handleEdit = React.useCallback(
    (data: any) => {
      //  editOrder(data.id, data.name_kindergarten);
      fetchData();
      setOpen(false);
    },
    [fetchData]
  );

  const handleDelete = React.useCallback(async () => {
    if (id) {
      const data = await deleteOrder(id);
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
      <h2 className={styles.orders_title}>Orders</h2>
      <TableData
        columns={columns}
        openModal={open}
        data={editData}
        handleEdit={handleEdit}
        handleAdd={handleAdd}
        handleClose={handleOpen}
        handleDelete={handleDelete}>
        {data.length &&
          data.map((row: any, index: number) => (
            <TableRow
              key={`${row.id}${index}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              className={styles.table_cell}
              onClick={() => {
                handleOpen(row.id);
                handleSetCurrentData(row);
              }}>
              <TableCell align="left">{row.id_order || ""}</TableCell>
              <TableCell align="left">{row.date_order || ""}</TableCell>
              <TableCell align="left">{row.name_kindergarten}</TableCell>
              <TableCell align="left">{row.name_status || ""}</TableCell>
              <TableCell align="left">{row.full_price}</TableCell>
              <TableCell align="left">{row.comment || ""}</TableCell>
            </TableRow>
          ))}
      </TableData>
    </>
  );
};
export default Orders;
