import { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  Typography,
  Button, 
  TextField,
  FormControl,
  FormHelperText,
  InputLabel, 
  MenuItem,
  Select,
  Stack,
  CircularProgress,
} from '@mui/material';
import { useAuth } from "../../hooks/Context/AuthProvider/useAuth";
import { 
  changeTextFieldStyles, 
  createEntryTransaction, 
  createOutputTransaction, 
  getAllItems, 
  getItem, 
} from '../../util/util';
import { getUserLocalStorage } from "../../hooks/Context/AuthProvider/util";
import { tokens } from '../../theme';
import { useTheme } from '@emotion/react';
import CustomAlert from '../CustomAlert/CustomAlert';
import { getInventoryLocalStorage } from "../../hooks/Context/InventoryProvider/util";

const Transactions = () => {
  
  const [transactionType, setTransactionType] = useState("");
  const [itemField, setItemField] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });

  const { 
    control,
    register, 
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      unitPrice:"",
      poster:"",
      quantityItem: "",
      observation: "",
    },
  });


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const auth = useAuth();

 
  useEffect(() => {
    const getItems = async () => {
      try {
        if(auth.isValidToken(auth.token)) {
          const { token } = getUserLocalStorage();
          const { id } = getInventoryLocalStorage();
          const headersConfig = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
          };
          const response = await getAllItems(id, headersConfig);
          if (response && response.status === 200) {
            setAllItems(response.data);
          } else {
            setSnackbar({ 
              open: true, 
              message: "Error ao listar os itens.", 
              severity: "error" 
            });
          }
        }
      } catch (error) {
        setSnackbar({ 
          open: true, 
          message: "Erro interno. Tente novamente mais tarde.", 
          severity: "error"
        });
      } 
    }
    if(transactionType === "SAIDA") {
      getItems();
    }
  },[auth, transactionType]);


  const onSubmit = async (formData) => {

    try {
      
      if(auth.isValidToken(auth.token)) {
        const { token } = getUserLocalStorage();
        const { id } = getInventoryLocalStorage();
        const headersConfig = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        if (transactionType === "ENTRADA"){
          const { name, unitPrice, poster, quantityItem, observation } = formData;
          const data = {
            transactionType,
            quantityItem: Number(quantityItem),
            observation,
            item: {
              name,
              unitPrice: Number(unitPrice),
              poster
            }
          };
          const response = await createEntryTransaction(id, data, headersConfig);
          if(response.status === 201) {
            setSnackbar({ 
            open: true, 
            message: 'Transacao feita com sucesso.', 
            severity: 'success' 
            });
          }
          else{
            setSnackbar({ 
              open: true, 
              message: 'Erro na transacao. Tente novamente.', 
              severity: 'error' 
            });
          }
        }
        if (transactionType === "SAIDA"){
          const { amount, name, poster, unitPrice } = selectedItem;
          const { quantityItem, observation } = formData;
          const data = {
            transactionType,
            quantityItem: Number(quantityItem),
            observation,
            item: {
              amount,
              name,
              unitPrice: Number(unitPrice),
              poster
            }
          };
          const response = await createOutputTransaction(id, data, headersConfig);
          if(response.status === 201) {
            setSnackbar({ 
            open: true, 
            message: 'Transacao feita com sucesso.', 
            severity: 'success' 
            });
          }
          else{
            setSnackbar({ 
              open: true, 
              message: 'Erro na transacao. Tente novamente.', 
              severity: 'error' 
            });
          }
        }
      }
    } 
    catch (error) {
        setSnackbar({ 
        open: true, 
        message: 'Erro na transacao. Tente novamente mais tarde', 
        severity: 'error' 
        });
    }
    reset();
    setSelectedItem({});
    setAllItems([]);
  } 


  const getSelectedItem = useCallback( async (id) => {
    try {
      if(auth.isValidToken(auth.token)) {
        const { token } = getUserLocalStorage();
        const headersConfig = {
          headers: {
              Authorization: `Bearer ${token}`,
          },
        };
        const response = await getItem(id, headersConfig);
        if (response && response.status === 200) {
          setItemField(response.data);
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
  },[auth]);

  useEffect(()=> {
    if (selectedItem.id) {
      getSelectedItem(selectedItem.id);
    }
  },[selectedItem.id, getSelectedItem]);


  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };
 


  return (

    <Stack spacing={3} 
      sx={{ 
        maxWidth: 800, 
        margin: "3rem 0rem",
        textAlign: "left",
        padding: 4,
        borderRadius: "20px 20px",
        backgroundColor: colors.grey[800],
      }}
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} style={{ mt: 1 }} autoComplete="off">
        <FormControl 
          sx={{ 
            ...changeTextFieldStyles(Boolean(errors?.transactionType?.message), colors.redAccent[500], colors.grey[400], colors.grey[100]),
            mt: 2, 
            width: '100%' 
          }} 
        >
          <InputLabel htmlFor="transaction-type-select">Tipo da Transacao</InputLabel>
          <Controller
          name="transactionType-select"
          control={control}
          rules={{ required: transactionType === "" ? "Tipo da Transacao é obrigatória." : ""}}
          render={({ field }) => (
            <Select
              {...field}
              labelId="transaction-type-select"
              id="transaction-type-select"
              label="Tipo da Transacao *"
              autoComplete="transactionType"
              //name="transactionType"
              //value={transactionType || "ENTRADA"}
              onChange={(e) => {
                setTransactionType(e.target.value);
                field.onChange(e);
                reset();
              }}
            >
              <MenuItem value={"ENTRADA"}>ENTRADA</MenuItem>
              <MenuItem value={"SAIDA"}>SAIDA</MenuItem>
            </Select>
          )}
        />
        {errors?.transactionType && (
          <FormHelperText sx={{ ml: 2 }} error>{errors?.transactionType?.message}</FormHelperText>
        )}
        </FormControl>

        {transactionType === "SAIDA" && (
          <FormControl 
            sx={{ 
              ...changeTextFieldStyles(Boolean(errors?.listItems?.message), colors.redAccent[500], colors.grey[400], colors.grey[100]),
              mt: 2, 
              width: '100%' 
            }} 
          >
            <InputLabel htmlFor="listItems">Itens</InputLabel>
            <Controller
            name="items"
            control={control}
            rules={{ required: "A escolha do item é obrigatória." }}
            render={({ field }) => (
              <Select
                {...field}
                labelId="listItems"
                id="listItems"
                label="Itens"
                autoComplete="off"
              >
                {allItems.map((item) => (
                <MenuItem
                  key={item.id}
                  value={item.name}
                  onClick={() => handleItemClick(item)}
                >
                  {item.name}
                </MenuItem>
            ))}
              </Select>
            )}
          />
          {errors?.listItems && (
            <FormHelperText sx={{ ml: 2 }} error>{errors?.listItems?.message}</FormHelperText>
          )}
        </FormControl>
        )}
        <Typography component="h2" variant="h5" 
            sx={{ margin: "1.5rem 0", color: colors.purpleAccent[300] }}
        >
          {transactionType === "SAIDA" ? "Seus itens estao de saída" : "Preenche as informacoes do Item" }
        </Typography>
        <TextField
        fullWidth
        id="name"
        label={selectedItem.name ? "" : "Nome do Item"}
        name="name"
        autoComplete="off"
        value={selectedItem.name}
        disabled={transactionType === "SAIDA"}
        sx={ changeTextFieldStyles(Boolean(errors?.poster?.message), colors.redAccent[500], colors.grey[400], colors.grey[100]) }
        error={Boolean(errors?.name?.message)}
        helperText={errors?.name?.message}
        {...register("name", 
            { 
              required: {
                value: transactionType === "ENTRADA",
                message: "Nome é obrigatorio."
              },
              minLength: {
                value: 3,
                message: "Nome do Item precisa ter mais de 3 letras."
              },
              maxLength: {
                  value: 50,
                  message: "Nome do Item ultrapassou o limite de caracteres."
              },
            })
        }
      />
        <TextField
        margin="normal"
        fullWidth
        autoComplete="off"
        value={selectedItem.poster}
        disabled={transactionType === "SAIDA"}
        label={selectedItem.poster ? "" : "Imagem"}
        name="poster"
        sx={ changeTextFieldStyles(Boolean(errors?.poster?.message), colors.redAccent[500], colors.grey[400], colors.grey[100]) }
        error={Boolean(errors?.poster)}
        helperText={errors?.poster?.message}
        {...register("poster", 
            {
              required: {
                value: transactionType === "ENTRADA",
                message: "Nome obrigatorio."
              },
              minLength: {
                value: 3,
                message: "Imagem precisa ter mais de 3 letras."
              },
              maxLength: {
                value: 50,
                message: "Imagem ultrapassou o limite de caracteres."
              },
            }
        )}
        />
        <TextField
        margin="normal"
        fullWidth
        id="unitPrice"
        value={selectedItem.unitPrice}
        disabled={transactionType === "SAIDA"}
        label={selectedItem.unitPrice ? "" : "Preco do Item"}
        name="unitPrice"
        type="number"
        autoComplete="off"
        sx={ changeTextFieldStyles(Boolean(errors?.unitPrice?.message), colors.redAccent[500], colors.grey[400], colors.grey[100]) }
        error={Boolean(errors?.unitPrice?.message)}
        helperText={errors?.unitPrice?.message}
        {...register("unitPrice", 
            { 
              required: {
                value: transactionType === "ENTRADA",
                message: "Preco do Item é obrigatorio."
              },
            })
        }
        />
        <TextField
        fullWidth
        required
        margin="normal"
        label="Quantidade"
        name="quantityItem"
        autoComplete="quantityItem"
        type="number"
        sx={ changeTextFieldStyles(Boolean(errors?.quantityItem?.message), colors.redAccent[500], colors.grey[400], colors.grey[100]) }
        error={Boolean(errors?.quantityItem?.message)}
        helperText={errors?.quantityItem?.message}
        {...register("quantityItem", 
          { 
            required: {
              value: true,
              message: "Quantidade é obrigatória.",
            },
            validate: (value) => {
              if(value <= 0|| value > selectedItem.amount) {
                return "A quantidade atual é insuficiente para esta transacao."
              }
            }
          })
        }
        />
        <TextField
        fullWidth
        margin="normal"
        label="Observacao"
        name="observation"
        autoComplete="observation"
        sx={ changeTextFieldStyles(Boolean(errors?.observation?.message), colors.redAccent[500], colors.grey[400], colors.grey[100]) }
        error={Boolean(errors?.observation?.message)}
        helperText={errors?.observation?.message}
        {...register("observation",)}
        />
          <Button
          sx={{ 
              mt: 3, 
              mb: 2,
          }}
          variant="contained"
          fullWidth
          type="submit"
          style={{
              textTransform: 'none',
              fontSize: "1.1rem",
              fontWeight: 'bold',
              backgroundColor: colors.orangeAccent[500],
          }}
          disabled={isSubmitting}
          >
          {
              isSubmitting ? <CircularProgress color="inherit" size={24} /> : "Enviar"
          }
        </Button>
        <CustomAlert snackbar={snackbar} handleClose={handleCloseSnackbar} />

      </form>
    </Stack>
  );
}

export default Transactions;