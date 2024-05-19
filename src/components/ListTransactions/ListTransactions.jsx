import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Toolbar,
} from "@mui/material";
import {
  DataGrid,
} from '@mui/x-data-grid';
import { useAuth } from "../../hooks/Context/AuthProvider/useAuth";
import { getUserLocalStorage } from "../../hooks/Context/AuthProvider/util";
import { getInventoryLocalStorage } from '../../hooks/Context/InventoryProvider/util';
import { getAllTransactions } from '../../util/util';
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import CustomAlert from '../CustomAlert/CustomAlert';
import Navbar from "../Navbar/Navbar";
import Header from "../Header/Header";
import * as XLSX from "xlsx";

const ListTransactions = () => {
  const drawerWidth = 240;

  const [rows, setRows] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });
  const [sheetData, setSheetData] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const auth = useAuth();

  const columns = [
    { 
      field: "id", 
      headerName: "ID",
      headerAlign: "center",
      align: "center",
      type: "number",
      width: 80, 
    },
    { 
      field: "transactionType", 
      headerName: "Tipo da Transacao",
      headerAlign: "center",
      align: "center",
      type: "string",
      width: 220,
      valueFormatter: (params) => {
        <div style={{ wordWrap: "break-word" }}>
          {params.value}
        </div>
        return (params.value);
      }
    },
    {
      field: 'quantityItem',
      headerName: 'Quantidade de Itens',
      headerAlign: "center",
      align: "center",
      type: 'number',
      width: 120,
    },
    {
        field: 'commercialTypeEntity',
        headerName: 'Entitade',
        headerAlign: "center",
        align: "center",
        type: 'string',
        width: 180,
    },
    {
        field: 'date',
        headerName: 'Data',
        headerAlign: "center",
        align: "center",
        type: 'Date',
        width: 180,
    },
    {
      field: 'observation',
      headerName: 'Observacao',
      headerAlign: "center",
      align: "center",
      type: 'string',
      width: 120,
      valueFormatter: (params) => {
        <div style={{ wordWrap: "break-word" }}>
          {params.value}
        </div>
        return (params.value);
      }
    },
    {
        field: 'links',
        headerName: 'Links',
        headerAlign: "center",
        align: "center",
        type: 'array',
        width: 180,
      },
    ];
  

  const getAll = useCallback(async () => {
    try {
      if(auth.isValidToken(auth.token)) {
        const { token } = getUserLocalStorage();
        const { id } = getInventoryLocalStorage();
        const headersConfig = {
          headers: {
              Authorization: `Bearer ${token}`,
          },
        };
        const response = await getAllTransactions(id, headersConfig);
        if (response && response.status === 200) {
          setRows(response.data);
          setSheetData(response.data);
        } else {
          setSnackbar({ 
            open: true, 
            message: "Error ao listar os itens.", 
            severity: "error" 
          });
        }
      }
    } catch (error) {
      console.log("Error interno ao listar os itens.");
      setSnackbar({ 
        open: true, 
        message: "Erro interno. Tente novamente mais tarde.", 
        severity: "error"
      });
    } 
  }, [auth]);

  
  useEffect(() => {
    getAll();
  },[getAll]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOnArrExport = () => {
    if (!rows || !columns) {
      console.error("rows or columns are undefined");
      return;
    }
    const data = rows.map(row =>
      columns.reduce((acc, column) => {
        acc[column.headerName] = row[column.field];
        return acc;
      }, {})
    );

    const ws = XLSX.utils.json_to_sheet(data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");

    XLSX.writeFile(wb, "Transactions.xlsx");
  };



  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Box sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Header
          title="Historico de Transacoes" 
          subtitle="Confira suas transacoes neste painel" 
        />
        <div>
          <Button 
            onClick={handleOnArrExport} 
            sx={{ 
              marginTop: 3, 
              padding: "0.25rem 1.5rem",
              fontSize: "1rem", 
              fontWeight: "600", 
              color: colors.grey[800], 
              backgroundColor: colors.greenAccent[600], 
              textTransform: "none",
              borderRadius: "25px", 
              "&:hover": { 
                color: colors.grey[100], 
                backgroundColor: colors.purpleAccent[500] 
              } 
            }}
          >
            Export To Excel
          </Button>
        </div>
        <Box
            sx={{
            height: 500,
            marginTop: "2rem",
            width: '100%',
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderTop: `1px solid ${colors.grey[600]}`,
                borderBottom: `1px solid ${colors.grey[700]}`,
              },
              "& .name-column--cell": {
                color: colors.orangeAccent[400],
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                textTransform: "uppercase",
                color: colors.orangeAccent[400],
                fontWeight: 300,
              },
              "& .MuiDataGrid-columnHeaders": {
                color: colors.blueAccent[100],
                backgroundColor: colors.grey[800],
                border: "none",
              },
              "& .MuiDataGrid-columnSeparator": {
                color: "transparent",
                border: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.grey[800],
                color: colors.grey[200],
              },
              "& .MuiDataGrid-footerContainer": {
                border: "none",
                color: colors.grey[100],
                backgroundColor: colors.grey[900],
              },
              "& .MuiCheckbox-root": {
                color: `${colors.grey[200]} !important`,
              },
              "& .MuiDataGrid-cell--editing": {
                color: "black",
                backgroundColor: `${colors.grey[500]} !important`,
              },
              "& .MuiIconButton-root": {
                color: `${colors.grey[200]} !important`,
              },
              "& .MuiIconButton-root:hover": {
                color: `${colors.grey[800]} !important`,
                backgroundColor: colors.orangeAccent[400],
              },
              "& .MuiInputBase-input": {
                padding: 0,
              },
              "& .MuiDataGrid-actionsCell": {
                color: "transparent",
              },
              "& .MuiButton-colorPrimary": {
                color: "#f2f2f2",
              },
              "& .MuiDataGrid-pinnedColumnHeaders": {
                boxShadow: "none",
                backgroundColor: "transparent"
              },
              "& .MuiDataGrid-pinnedColumns": {
                boxShadow: "none",
                backgroundColor: "transparent",
              },
            }}
          >
          <Box>
            <CustomAlert snackbar={snackbar} handleClose={handleCloseSnackbar} />
          </Box>
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
          />
        </Box>

      </Box>
    </Box>
  );
}

export default ListTransactions;