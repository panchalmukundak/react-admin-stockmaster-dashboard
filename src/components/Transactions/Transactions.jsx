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
import { useNavigate  } from "react-router-dom";
import { useAuth } from "../../hooks/Context/AuthProvider/useAuth";
import { changeTextFieldStyles, createEntryTransaction, createOutputTransaction, getAllItems, getAllTransactions } from '../../util/util';
import { getUserLocalStorage } from "../../hooks/Context/AuthProvider/util";
import { tokens } from '../../theme';
import { useTheme } from '@emotion/react';
import CustomAlert from '../CustomAlert/CustomAlert';
import { getInventoryLocalStorage } from '../../hooks/Context/InventoryProvider/util';
import CustomItemField from '../CustomItemTextField/CustomItemField';

const Transactions = () => {
  
  const [transactionType, setTransactionType] = useState("");
  const [showItemsList, setShowItemsList] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });
  const [transactions, setTransactions] = useState(null);

  /*const handleChange = (event) => {
    //setTransactionType(event.target.value);
  }; */

  const { 
    control,
    register, 
    handleSubmit,
    formState: {
      errors, isSubmitting
    },
    watch
  } = useForm({
    defaultValues: {
      transactionType: "",
    },
  });

  console.log(control);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const auth = useAuth();

  
  const handleItemChange = (item) => {
    // Encontrar o item selecionado a partir do ID
    //const item = allItems.find(item => item.id === selectedItemId);
    // Atualizar o estado do item selecionado
    setSelectedItem(item);
  };

  const onSubmit = async (formData) => {

    try {

      if (transactionType === "Entrada") {
        const response = await createEntryTransaction(formData);
        setTransactions(response);
        console.log(transactions);
      }
      else{
        const response = await createOutputTransaction(formData);
        setTransactions(response);
        console.log(transactions);
      }

      /*if(transactions && transactions.status === 200) {
        setSnackbar({ 
          open: true, 
          message: 'Login feito sucesso.', 
          severity: 'success' 
        });
      }
      setSnackbar({ 
        open: true, 
        message: 'Email ou senhas invalidas.', 
        severity: 'error' 
      });
      
      navigate('/home');
    } */
    } catch (error) {
      console.log("Erro ao fazer a transacao.", error);

      setSnackbar({ 
        open: true, 
        message: 'Erro ao fazer a transacao.', 
        severity: 'error' 
      });

      setError(true);
    }
  }

 
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
          //setLoading(true);
          const response = await getAllItems(id, headersConfig);
          if (response && response.status === 200) {
            setAllItems(response.data);
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
    }
    if(transactionType === "Saida") {
      getItems();
    }
  },[auth, transactionType]);


  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

 /*
  const getTransactions = useCallback(async () => {
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
        const response = await getAllTransactions(id, headersConfig);
        if (response && response.status === 200) {
          console.log(response);
          //setRows(response.data);
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
    getTransactions();
  },[getTransactions]);
  
  */

 
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
          name="transactionType"
          control={control}
          rules={{ required: "Tipo da Transacao é obrigatória." }}
          render={({ field }) => (
            <Select
              {...field}
              labelId="transaction-type-select"
              id="transaction-type-select"
              label="Tipo da Transacao *"
              autoComplete="transactionType"
              onChange={(e) => {
                setTransactionType(e.target.value);
                field.onChange(e);
              }}
            >
              <MenuItem value={"Entrada"}>Entrada</MenuItem>
              <MenuItem value={"Saida"}>Saida</MenuItem>
            </Select>
          )}
        />
        {errors?.transactionType && (
          <FormHelperText sx={{ ml: 2 }} error>{errors?.transactionType?.message}</FormHelperText>
        )}
      </FormControl>

      {transactionType === "Saida" && (
        <FormControl 
          sx={{ 
            ...changeTextFieldStyles(Boolean(errors?.listItems?.message), colors.redAccent[500], colors.grey[400], colors.grey[100]),
            mt: 2, 
            width: '100%' 
          }} 
        >
          <InputLabel htmlFor="listItems">Itens</InputLabel>
          <Controller
          name="listItems"
          control={control}
          rules={{ required: "A escolha do item é obrigatória." }}
          render={({ field }) => (
            <Select
              {...field}
              labelId="listItems-select"
              id="listItems-select"
              label="Itens *"
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

       {transactionType === "Saida" && (
          <CustomItemField transactionType={transactionType} selectedItem={selectedItem} />
        )}

        {/*<Stack>
          <Typography component="h2" variant="h5" 
              sx={{ margin: "1.5rem 0", color: colors.purpleAccent[300] }}
          >
            Preenche informacoes do Item
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nome do Item"
            name="name"
            autoComplete="name"
            sx={ changeTextFieldStyles(Boolean(errors?.name?.message), colors.redAccent[500], colors.grey[400], colors.grey[100]) }
            error={Boolean(errors?.name?.message)}
            helperText={errors?.name?.message}
            {...register("name", 
              { 
                required: {
                  value: true,
                  message: "Nome do Item é obrigatório.",
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
            required
            fullWidth
            label="Imagem"
            name="poster"
            autoComplete="poster"
            sx={ changeTextFieldStyles(Boolean(errors?.poster?.message), colors.redAccent[500], colors.grey[400], colors.grey[100]) }
            error={Boolean(errors?.poster)}
            helperText={errors?.poster?.message}
            {...register("poster", 
              {
                required: {
                  value: true,
                  message: "Imagem é obrigatória." 
                },
              }
            )}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="unitPrice"
            label="Preco do Item"
            name="unitPrice"
            type="number"
            autoComplete="unitPrice"
            sx={ changeTextFieldStyles(Boolean(errors?.unitPrice?.message), colors.redAccent[500], colors.grey[400], colors.grey[100]) }
            error={Boolean(errors?.unitPrice?.message)}
            helperText={errors?.unitPrice?.message}
            {...register("unitPrice", 
              { 
                required: {
                  value: true,
                  message: "Preco do Item é obrigatório.",
                },
              })
            }
          />
          <TextField
            fullWidth
            required
            margin="normal"
            label="Quantidade do Item"
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

        </Stack>)} */}

        {/*<Button
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
            backgroundColor: "#c64c01",
          }}
          disabled={isSubmitting}
        >
          {
            isSubmitting ? <CircularProgress color="inherit" size={24} /> : "Enviar"
          }
        </Button> 
        */}

      </form>

      <CustomAlert snackbar={snackbar} handleClose={handleCloseSnackbar} />
    </Stack>
  );
}

export default Transactions