import { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  Typography,
  Button, 
  TextField,
  Stack,
  CircularProgress,
} from '@mui/material';
import { useNavigate  } from "react-router-dom";
import { useAuth } from "../../hooks/Context/AuthProvider/useAuth";
import { changeTextFieldStyles, getAllItems, getItem, getAllTransactions, createTransaction } from '../../util/util';
import { getUserLocalStorage } from "../../hooks/Context/AuthProvider/util";
import { tokens } from '../../theme';
import { useTheme } from '@emotion/react';
import CustomAlert from '../CustomAlert/CustomAlert';
import { getInventoryLocalStorage } from "../../hooks/Context/InventoryProvider/util"
import {
    topSnackbarPosition
} from '../../util/util';
import PropTypes from 'prop-types';


const CustomItemField = ({ transactionType, selectedItem }) => {

    const [itemField, setItemField] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });
    const [transactions, setTransactions] = useState(null);
    //const [allItems, setAllItems] = useState([]);

    const { 
        control,
        register, 
        handleSubmit,
        reset,
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
    const auth = useAuth();
  

    const onSubmit = async (formData) => {

        try {
            let { name, unitPrice, poster } = selectedItem;
            const { quantityItem, observation } = formData;
            if(auth.isValidToken(auth.token)) {
                const { token } = getUserLocalStorage();
                const { id } = getInventoryLocalStorage();
                const headersConfig = {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
                };
                const response = await createTransaction(
                    id, 
                    { 
                        transactionType,
                        quantityItem,
                        observation,
                        item: {
                            name,
                            unitPrice,
                            poster
                        }
                    },
                    headersConfig, 
                    transactionType
                );
                console.log(response);
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
        catch (error) {
            console.log("Erro na transacao.", error);
            setSnackbar({ 
            open: true, 
            message: 'Erro na transacao. Tente novamente mais tarde', 
            severity: 'error' 
            });
        }
        reset();
        setSelectedItem({ name: '', unitPrice: '', poster: '' });
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
    

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setSnackbar({ ...snackbar, open: false });
    };
    
    return (

        <Stack>
            <form noValidate onSubmit={handleSubmit(onSubmit)} style={{ mt: 1 }} autoComplete="off">
                <Typography component="h2" variant="h5" 
                    sx={{ margin: "1.5rem 0", color: colors.purpleAccent[300] }}
                >
                    {selectedItem ? "Seus itens estao de saída" : "Preenche as informacoes do Item" }
                </Typography>
                <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label={selectedItem.name? "" : "Nome do Item"}
                name="name"
                autoComplete="name"
                value={selectedItem.name ? selectedItem.name : ""}
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
                        disabled: {
                            value: selectedItem.name ? true : false
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
                label={selectedItem.poster ? "" : "Imagem"}
                name="poster"
                autoComplete="poster"
                value={selectedItem.poster ? selectedItem.poster : ""}
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
                        minLength: {
                            value: 3,
                            message: "Imagem precisa ter mais de 3 letras."
                        },
                        maxLength: {
                            value: 50,
                            message: "Imagem ultrapassou o limite de caracteres."
                        },
                        disabled: {
                            value: selectedItem.poster ? true : false
                        },
                    }
                )}
                />
                <TextField
                margin="normal"
                required
                fullWidth
                id="unitPrice"
                label={selectedItem.unitPrice ? "" : "Preco do Item"}
                name="unitPrice"
                type="number"
                autoComplete="unitPrice"
                value={selectedItem.unitPrice ? selectedItem.unitPrice : ""}
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
                        minLength: { 
                            value: 1, 
                            message: "Preco do Item deve ter no mínimo 1 digito." 
                        },
                        disabled: {
                            value: selectedItem.poster ? true : false
                        }
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
                        minLength: { 
                            value: 1, 
                            message: "Quantidade deve ter no mínimo 1 caracteres." 
                        },
                        validate: value => value < selectedItem.amount || "A quantidade atual do item é insuficiente para esta transacao."
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
                    backgroundColor: "#c64c01",
                }}
                disabled={isSubmitting}
                >
                {
                    isSubmitting ? <CircularProgress color="inherit" size={24} /> : "Enviar"
                }
                </Button>
            </form>
            <CustomAlert snackbar={snackbar} handleClose={handleCloseSnackbar} />
        </Stack>
        

    )
    
}

CustomItemField.propTypes = {
    transactionType: PropTypes.string.isRequired,
    selectedItem: PropTypes.object.isRequired,
};

export default CustomItemField