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
import { changeTextFieldStyles, createEntryTransaction, createOutputTransaction, getAllItems, getItem, getAllTransactions } from '../../util/util';
import { getUserLocalStorage } from "../../hooks/Context/AuthProvider/util";
import { tokens } from '../../theme';
import { useTheme } from '@emotion/react';
import CustomAlert from '../CustomAlert/CustomAlert';
import { getInventoryLocalStorage } from '../../hooks/Context/InventoryProvider/util';
import {
    topSnackbarPosition
} from '../../util/util';
import PropTypes from 'prop-types';


const CustomItemField = ({ transactionType, selectedItem }) => {

    //const [transactionType, setTransactionType] = useState("");
    //const [showItemsList, setShowItemsList] = useState(false);
    //const [items, setItems] = useState([]);
    const [itemField, setItemField] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });
    const [transactions, setTransactions] = useState(null);
    const [allItems, setAllItems] = useState([]);
  
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
    

    console.log(selectedItem);
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const auth = useAuth();
  

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
          console.log("Erro ao fazer o login.", error);
    
          setSnackbar({ 
            open: true, 
            message: 'Erro ao fazer o login.', 
            severity: 'error' 
          });
    
          //setError(true);
        }
    }


    const getSelectedItem = useCallback ( async (id) => {
        try {
          if(auth.isValidToken(auth.token)) {
            const { token } = getUserLocalStorage();
            const headersConfig = {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
            };
            //setLoading(true);
            const response = await getItem(id, headersConfig);
            if (response && response.status === 200) {
              setItemField(response.data);
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
    },[auth]);

    useEffect(()=> {
        if (selectedItem.id) {
            getSelectedItem(selectedItem.id);
        }
    },[selectedItem.id, getSelectedItem]);
    


    if (transactionType === "Saida" && selectedItem) 

    return (

        <Stack>
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
            value={selectedItem.name}
            disabled
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
            value={selectedItem.poster}
            disabled
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
            value={selectedItem.unitPrice}
            disabled
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
            value={selectedItem.quantityItem}
            disabled
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
            value={selectedItem.observation}
            disabled
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
                backgroundColor: "#c64c01",
            }}
            disabled={isSubmitting}
            >
            {
                isSubmitting ? <CircularProgress color="inherit" size={24} /> : "Enviar"
            }
            </Button>


        </Stack>

  )
}

CustomItemField.propTypes = {
    transactionType: PropTypes.string.isRequired,
    selectedItem: PropTypes.object.isRequired,
};

export default CustomItemField