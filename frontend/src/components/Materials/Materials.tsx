import { TableCell, TableRow } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React from "react";
import TableData from "../../UI/Table/TableData";
import {
  addMaterial,
  deleteMaterial,
  editMaterial,
  getMaterials,
} from "../../controllers/MaterialsController";
import Header from "../Header/Header";
import styles from "./Materials.module.sass";

const columns: GridColDef[] = [
  { field: "name_material", headerName: "Name Material", type: "string" },
  { field: "count_material", headerName: "Count Material", type: "number" },
  { field: "price_material", headerName: "Price Material", type: "number" },
];

const Materials: React.FC = () => {
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState<string | undefined>(undefined);
  const [editData, setEditData] = React.useState<any>(null);
  const fetchData = React.useCallback(async () => {
    const dataTable = await getMaterials();
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
    const dataTable = await addMaterial(
      data.name_material,
      data.count_material,
      data.price_material
    );
    setData(dataTable);
    setOpen(false);
  }, []);

  const handleEdit = React.useCallback(
    (data: any) => {
      editMaterial(
        data.id,
        data.name_material,
        data.count_material,
        data.price_material
      );
      fetchData();
      setOpen(false);
    },
    [fetchData]
  );

  const handleDelete = React.useCallback(async () => {
    if (id) {
      const data = await deleteMaterial(id);
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
      <h2 className={styles.airlines_title}>Materials</h2>
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
              key={`${row.id_material}${index}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              className={styles.table_cell}
              onClick={() => {
                handleOpen(row.id);
                handleSetCurrentData(row);
              }}>
              <TableCell align="left">{row.name_material}</TableCell>
              <TableCell align="left">{row.count_material}</TableCell>
              <TableCell align="left">{row.price_material}</TableCell>
            </TableRow>
          ))}
      </TableData>
    </>
  );
};
export default Materials;
