import { useCallback, useEffect, useState } from 'react';
import {
  Box,
} from "@mui/material";
import {
  DataGrid,
} from '@mui/x-data-grid';
import { useAuth } from "../../hooks/Context/AuthProvider/useAuth";
import { getUserLocalStorage } from "../../hooks/Context/AuthProvider/util";
import { getInventoryLocalStorage } from '../../hooks/Context/InventoryProvider/util';
import { getAllItems } from '../../util/util';
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import CustomAlert from '../CustomAlert/CustomAlert';


const DataItems = () => {
  const [rows, setRows] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" }); 

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
      field: "name", 
      headerName: "Nome",
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
      field: 'unitPrice',
      headerName: 'Preco Unitario',
      headerAlign: "center",
      align: "center",
      type: 'number',
      width: 120,
    },
    {
      field: 'amount',
      headerName: 'Quantidade',
      headerAlign: "center",
      align: "center",
      type: 'number',
      width: 120,
    },
    {
      field: 'poster',
      headerName: 'Imagem',
      headerAlign: "center",
      align: "center",
      type: 'string',
      width: 180,
      valueFormatter: (params) => {
        <div style={{ wordWrap: "break-word" }}>
          {params.value}
        </div>
        return (params.value);
      }
    },
  ];
  

  const getItems = useCallback(async () => {
    try {
      if(auth.isValidToken(auth.token)) {
        const { token } = getUserLocalStorage();
        const { id } = getInventoryLocalStorage();
        const headersConfig = {
          headers: {
              Authorization: `Bearer ${token}`,
          },
        };
        //setLoading(true);
        const response = await getAllItems(id, headersConfig);
        if (response && response.status === 200) {
          setRows(response.data);
          //setLoading(false);
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
        //setLoading(false);
        setSnackbar({ 
          open: true, 
          message: "Erro interno. Tente novamente mais tarde.", 
          severity: "error"
        });
    } 
  }, [auth]);

  
  useEffect(() => {
    getItems();
  },[getItems]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
        return;
    }
    setSnackbar({ ...snackbar, open: false });
  };


  return (
    <Box
      sx={{
      height: 500,
      marginTop: 6,
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
  );
}
export default DataItems;