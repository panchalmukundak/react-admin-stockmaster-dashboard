import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  DataGrid,
  GridRowModes,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { useAuth } from "../../hooks/Context/AuthProvider/useAuth";
import { getUserLocalStorage } from "../../hooks/Context/AuthProvider/util";
import { getInventoryLocalStorage } from '../../hooks/Context/InventoryProvider/util';
import { createItem, deleteItem, getAllItems } from '../../util/util';
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import PropTypes from 'prop-types';
import CustomAlert from '../CustomAlert/CustomAlert';
import CustomDialog from '../CustomDialog/CustomDialog';


const DataItems = () => {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" }); 
  const [openDialog, setOpenDialog] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isNewRow, setIsNewRow] = useState(false);

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
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: "100",
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <>
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: 'primary.main',
                }}
                onClick={handleSaveClick(id)}
                />,
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
                />,
            </>
          ];
        }

        return [
          <>
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
              />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
              />,
          </>
        ];
      },
    },
    { 
      field: "name", 
      headerName: "Nome",
      headerAlign: "center",
      align: "center",
      type: "string",
      width: 200, 
      editable: true,
    },
    {
      field: 'unitPrice',
      headerName: 'Preco Unitario',
      headerAlign: "center",
      align: "center",
      type: 'number',
      width: 150,
      editable: true,
    },
    {
      field: 'amount',
      headerName: 'Quantidade',
      headerAlign: "center",
      align: "center",
      type: 'number',
      width: 150,
      editable: true,
    },
    {
      field: 'poster',
      headerName: 'Imagem',
      headerAlign: "center",
      align: "center",
      type: 'string',
      width: 180,
      editable: true,
    },
    {
      field: 'type',
      headerName: 'Tipo de Transacao',
      headerAlign: "center",
      align: "center",
      type: "singleSelect",
      width: 180,
      editable: true,
      renderCell: (params) => {
        
        if (params.row.mode === 'edit' || params.row.mode === '') {
          return (
            <TextField
              value={params.value || ''}
              onChange={(e) => handleEditRow(params.id, 'name', e.target.value)}
              inputProps={{ style: { textAlign: 'center' } }}
            />
          );
        }
        (
        <Select
          value={params.value || ''}
          onChange={(e) => handleEditRow(params.id, 'type', e.target.value)}
          displayEmpty
        >
          {isNewRow ? (
            [<MenuItem key="Entrada" value="Entrada">Entrada</MenuItem>]
          ) : (
            [
              <MenuItem key="Entrada" value="Entrada">Entrada</MenuItem>,
              <MenuItem key="Saida" value="Saida">Saida</MenuItem>
            ]
          )}
        </Select>
      )},
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


  function EditToolbar (props) {
    
    const { setRows } = props;

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleAddRow= () => {

      console.log("Cliquei!");

      const id = rows.length+1;
      const newRowData = { id: id, name: '', unitPrice: '', amount: '', poster: '', type: '' };
      // Adicione a nova linha ao estado local
      setRows((oldRows) => [...oldRows, newRowData]);
      // Ative o modo de edição para a nova linha
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit },
      }));

      setIsNewRow(true);
    };

    const handleCloseSnackbar = (event, reason) => {
      if (reason === "clickaway") {
          return;
      }
      setSnackbar({ ...snackbar, open: false });
    };

    return (
      <GridToolbarContainer>
         { snackbar.severity !== "" && <CustomAlert snackbar={snackbar} handleClose={handleCloseSnackbar} /> }
        <Button
          color="primary"
          sx={{ 
            padding: "0.35rem 1rem",
            marginBottom: 3,
            borderRadius: "25px",
            fontSize: "1rem",
            fontWeight: 600,
            textTransform: "none", 
            backgroundColor: colors.purpleAccent[500],
            "&:hover":{
              backgroundColor: colors.orangeAccent[600],
            } 
          }}
          startIcon={<AddIcon />} onClick={(e) => handleAddRow(e)}>
          Criar Item
        </Button>
      </GridToolbarContainer>
    );
    
  }
  EditToolbar.propTypes = {
    setRows: PropTypes.string.isRequired,
  };


  const createRow = async (newRowData) => {
    const { token } = getUserLocalStorage();
    try {
      const { id } = getInventoryLocalStorage();
      const headersConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      };
      const response = await createItem(id, newRowData, headersConfig);
      if (response.status === 201) {
        const updatedTableData = await getAllItems(id, headersConfig);
        setRows(updatedTableData);
        setSnackbar({ open: true, message: "Item criado com sucesso.", severity: "success" });
      } else {
        setSnackbar({ open: true, message: "Erro ao criar item.", severity: "error" });
      }
    } catch (error) {
      console.error("Erro ao criar item:", error);
      setSnackbar({ open: true, message: "Houve um erro de rede. Tente novamente mais tarde", severity: "error" });
    }
  };

  const removeItem = async(itemId) => {
    
    try{
      const { token } = getUserLocalStorage();
      const headersConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      };
      if(auth.isValidToken(token)) {
        //setOpenDialog(true)
        const response = await deleteItem(itemId, headersConfig);
        console.log(response);
        if (response && response.status === 204) {
          const updatedItems = rows.filter(item => item.id !== itemId);
          setRows(updatedItems);
          setSnackbar({ 
            open: true, 
            message: "Item excluido com sucesso.", 
            severity: "success" 
          });
        } 
        else {
          console.log(response);
          setSnackbar({ 
            open: true, 
            message: "Erro ao excluir o item.", 
            severity: "error" 
          });
        }
      }
    } catch(error) {
      console.log(error);
      setSnackbar({ 
        open: true, 
        message: "Erro de rede ao excluir o item.", 
        severity: "error" 
      });
    }

    setOpenDialog(false);
  };

  const handleDeleteClick = (id) => () => {
    setOpenDialog(true);
    setItemToDeleteId(id);
    console.log(id);
  };

  const handleEditRow = (id, field, value) => {
    const updatedRows = rows.map(row => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setRows(updatedRows);
  };



  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };


  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
        return;
    }
    setSnackbar({ ...snackbar, open: false });
  };


  const handleSaveClick = (id) => () => {
    
    const row = rows.find((row) => row.id === id);

    // Verifique se todos os campos estão preenchidos
    if (!row.name || !row.unitPrice || !row.amount || !row.poster) {
      console.log(row);
      setSnackbar({ open: true, message: "Preencha todos os campos.", severity: "error" });
      return;
    }
    
    console.log(row);
    //setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    setEditingId(null);
    // Defina isNewRow como false
    setIsNewRow(false);
  }


  const handleCancelClick = (id) => () => {
    
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  
    const editedRow = rows.find((row) => row.id === id);
    if (!editedRow.name && !editedRow.unitPrice && !editedRow.amount && !editedRow.poster) {
      setIsNewRow(true);
      setRows(rows.filter((row) => row.id !== id));
    }

  };



  const processRowUpdate = (newRow) => {
    console.log("nova linha: ", newRow);
    createRow(newRow);
    setRowModesModel(newRow);
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    console.log(rowModesModel);
    setRowModesModel(newRowModesModel);
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
          borderTop: `1px solid ${colors.grey[700]}`,
          borderBottom: `1px solid ${colors.grey[700]}`,
        },
        "& .name-column--cell": {
          color: colors.orangeAccent[400],
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          textTransform: "uppercase",
          color: colors.grey[300],
          fontWeight: 300,
        },
        "& .MuiDataGrid-columnHeaders": {
          color: colors.blueAccent[100],
          backgroundColor: colors.grey[900],
          border: "none",
        },
        "& .MuiDataGrid-columnSeparator": {
          color: "transparent",
          border: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.grey[600],
          color: colors.grey[200],
        },
        "& .MuiDataGrid-footerContainer": {
          border: "none",
          color: colors.grey[100],
          backgroundColor: colors.grey[900],
        },
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
          //color: `${colors.grey[100]} !important`,
        },
        "& .MuiCheckbox-root": {
          color: `${colors.grey[200]} !important`,
        },
        "& .MuiDataGrid-cell--editing": {
          color: "black",
          backgroundColor: `${colors.grey[500]} !important`,
        },
        ".MuiDataGrid-row.Mui-selected": {
          backgroundColor: `rgba(20,80,180,0.2) !important`,
        },
        "& .MuiIconButton-root": {
          color: `${colors.grey[200]} !important`,
        },
        "& .MuiIconButton-root:hover": {
          color: `${colors.grey[800]} !important`,
          backgroundColor: colors.orangeAccent[400],
        },
        "& .MuiOutlinedInput-input": {
        },
        "& .MuiInputBase-input": {
          //backgroundColor: colors.orangeAccent[400],
          padding: 0,
        },
        "& .MuiDataGrid-withBorderColor": {
          //color: colors.grey[100],
        },
        "& .MuiButtonBase-root-MuiButton-root": {
          //color: colors.primary[100],
          //color: "orange"
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
          "& .MuiDataGrid-cell": {
            color:"red",
          }
        },
      }}
    >
      <Box>
         <CustomAlert snackbar={snackbar} handleClose={handleCloseSnackbar} />
        {openDialog && 
          <CustomDialog openDialog={openDialog}  
            itemToDeleteId={itemToDeleteId} 
            removeItem={removeItem} setOpenDialog={setOpenDialog}
          />
        }
      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        editRowsModel={{
          [editingId]: {
            type: { value: 'Entrada' },
          },
        }}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}

        slots={{ toolbar: EditToolbar }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        //loading={loading}
        onEditCellChangeCommitted={(params) => handleEditRow(params.id, params.field, params.props.value)}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
export default DataItems;