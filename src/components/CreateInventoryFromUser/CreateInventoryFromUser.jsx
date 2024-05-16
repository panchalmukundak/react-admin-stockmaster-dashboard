import { useCallback, useEffect, useState } from "react";
import {
    Typography,
    Stack,
    Fab,
    Modal, 
    Box, 
    TextField,
    Button,
    IconButton,
    AppBar,
    Card,
    CardActions,
    CardContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LoginIcon from "@mui/icons-material/Login";
import AddIcon from "@mui/icons-material/Add";
import WidgetsIcon from '@mui/icons-material/Widgets';
import ApiIcon from '@mui/icons-material/Api';
import { tokens } from "../../theme";
import { useTheme } from "@emotion/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getUserLocalStorage } from "../../hooks/Context/AuthProvider/util";
import { useAuth } from "../../hooks/Context/AuthProvider/useAuth";
import { useInventory } from "../../hooks/Context/InventoryProvider/useInventory";
import { capitalize, createInventory, deleteInventory, getAllInventories } from "../../util/util";
import CustomAlert from "../CustomAlert/CustomAlert";
import CustomDialog from "../CustomDialog/CustomDialog";
import ProfileItem from "../ProfileItem/ProfileItem";

const CreateInventoryFromUser = () => {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inventories, setInventories] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" }); 
    const [openDialog, setOpenDialog] = useState(false);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { register, handleSubmit, 
        formState: {
            errors
        },
        reset 
    } = useForm();

    
    const navigate = useNavigate();
    
    
    const { userName } = useAuth();
    const inventory = useInventory();
    const auth = useAuth();

    const onSubmit = async (formData) => {
        const { id, token } = getUserLocalStorage();
        const headersConfig = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            if(auth.isValidToken(token)) {
                setLoading(true);
                const response = await createInventory(id, formData, headersConfig);
                if (response && response.status === 201) {
                    await getData(id, headersConfig); //getInventories
                    //setIsRequest(true);
                    setSnackbar({ 
                        open: true, 
                        message: "Estoque criado com sucesso.", 
                        severity: "success" 
                    });
                    setOpen(false);
                } 
                else {
                    console.log(response);
                    setSnackbar({ 
                        open: true, 
                        message: "Erro ao criar inventário.", 
                        severity: "error" 
                    });
                    setOpen(false);
                }
            }
        } catch (error) {
            console.error("Erro ao criar inventário:", error);
            setSnackbar({ 
                open: true, 
                message: "Houve um erro de rede. Tente novamente mais tarde", 
                severity: "error" 
            });
            setOpen(false);
        }
        finally{
            reset();
            setLoading(false);
        }
    };
    
    const getData = useCallback(async () => {
        try {
            if(auth.isValidToken(auth.token)) {
                const { id, token } = getUserLocalStorage();
                const headersConfig = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                };

                setLoading(true);
                const response = await getAllInventories(id, headersConfig);
                if (response && response.status === 200) {
                    console.log(response.status);
                    setInventories(response.data);
                setLoading(false);
                } else {
                setSnackbar({ 
                    open: true, 
                    message: "Error ao listar os estoques.", 
                    severity: "error" 
                });
                }
            }
        } catch (error) {
            console.log("Error interno ao listar os estoques.");
            setLoading(false);
            setSnackbar({ 
                open: true, 
                message: "Erro interno. Tente novamente mais tarde.", 
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    }, [auth]);

    useEffect(() => {
        getData();
    },[getData]);


    const removeInventory = async(inventoryId) => {
    
        
        try{
            const { token } = getUserLocalStorage();
            const headersConfig = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };
            if(auth.isValidToken(token)) {
                //setLoading(true);
                const response = await deleteInventory(inventoryId, headersConfig);
                console.log(response);
                if (response.status === 204) {
                    const updatedItems = inventories.filter(item => item.id !== inventoryId);
                    setInventories(updatedItems);
                    console.log(inventories);
                    setSnackbar({ 
                        open: true, 
                        message: "Estoque excluido com sucesso.", 
                        severity: "success" 
                    });
                    setOpen(false);
                } 
                else {
                    console.log(response);
                    setSnackbar({ 
                        open: true, 
                        message: "Erro ao excluir o inventário.", 
                        severity: "error" 
                    });
                    setOpen(false);
                }
            }
        } catch(error) {
          console.log(error);
          setSnackbar({ 
            open: true, 
            message: "Erro de rede ao excluir o inventário.", 
            severity: "error" 
            });
        }
        finally{
            setLoading(false);
        }
    };
      


    const goToItem = async (inventoryId) => {
        const { token } = getUserLocalStorage();
        const headersConfig = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        try {
            if(auth.isValidToken(token)) {
                await inventory.getInventory(inventoryId, headersConfig);
                navigate("/home/item");
            }
        } 
        catch (error) {
            console.error("Erro ao entrar no dashboard do estoque:", error);
            setSnackbar({ 
                open: true, 
                message: "Erro de rede ao excluir o inventário.", 
                severity: "error" 
            });
        }
    };
    
    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxWidth: "350px",
        width: "90%",
        color: colors.grey[100],
        backgroundColor: colors.grey[600],
        boxShadow: 24,
        p: 4,
    };

    
  return (
    <div style={{ backgroundColor: colors.grey[900] }}>
        <AppBar position="static" 
            sx={{ 
                display:"flex", 
                flexDirection:"row",
                justifyContent: "space-between",
                alignItems: "center",
                px: 3,
                width:"100%",
                backgroundColor: colors.grey[900]
            }}>
            <Box component="section" 
                sx={{ 
                    display:"flex", 
                    justifyContent: 'flex-start',
                    alignItems: "center",
                    border: "none",
                }}
            >
                <WidgetsIcon sx={{ color: colors.orangeAccent[500] }} />
                <Typography variant="h4" component="h1" 
                    sx={{ 
                        my: 3,
                        marginLeft: 1,
                        color: colors.orangeAccent[500], 
                        fontWeight: 600 
                    }}
                >
                    StockMaster
                </Typography>
            </Box>
            <Box>
                <ProfileItem />
            </Box>
        </AppBar>

        <Stack component="section" 
            sx={{ minHeight: "100vh", color: colors.grey[100], }}
        >
            <Stack component="section" 
                sx={{ 
                    width: "90%", 
                    maxWidth: "450px", 
                    my: 5, 
                    alignSelf:"center",
                    justifyContent: "center", 
                    backgroundColor: colors.grey[800], 
                    borderRadius: "10px",
                }}
            >
                <Typography variant="h3" component="h2" align="center" gutterBottom 
                    sx={{ fontWeight: "600", marginTop: "2rem" }}
                >
                    <span style={{ color: "#f97f34" }}>
                    {capitalize(userName)}
                    </span>, vamos iniciar os trabalhos?
                </Typography>

                <Stack component="section" 
                    sx={{ 
                        maxWidth: "320px", 
                        height:'100%',
                        width: "90%", 
                        margin: "auto", 
                        justifyContent: "center", 
                        alignSelf: "center",
                    }}
                >
                    
                    <Box sx={{ justifyContent: "center", marginTop: "1.75rem", alignSelf: "center" }}>
                        <Fab 
                            sx={{ color: colors.grey[100], backgroundColor: colors.purpleAccent[500],
                                "&:hover": { backgroundColor: colors.orangeAccent[600], }
                            }} 
                            aria-label="adicionar estoque" onClick={() => setOpen(true)}>
                            <AddIcon />
                        </Fab>
                    </Box>
                    <Typography variant="h5" 
                        component="p" 
                        align="center" gutterBottom 
                        sx={{ margin: "2rem", fontWeight: "300" }}>
                        Clique no botao e escolha um nome para seu estoque.
                    </Typography>
                </Stack>
                
                <Box>
                    <Modal
                        sx={{ 
                            "& > .MuiBackdrop-root" : {
                                backdropFilter: "blur(1px)",
                                backgroundColor: "rgb(0, 0, 0, 0.7)"
                            },
                            "& #transition-modal-titulo-helper-text, #transition-moddal-descricao-helper-text": {
                                paddingTop: 1,
                                fontSize: 14,
                                color: "#db4f4a",
                            },
                        }}
                        open={open}
                        onClose={() => {
                            setOpen(false);
                            reset();
                        }}
                        aria-labelledby="transition-modal-titulo"
                        aria-describedby="transition-moddal-descricao"
                        closeAfterTransition
                    >   
                        <Box sx={style} component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                            <Typography variant="h6" component="h2" sx={{ paddingBottom: 2 }}>
                            Dê um nome e uma descricao para seu estoque.
                            </Typography>
                            <TextField 
                                {...register("name", { maxLength: {
                                    value: 25,
                                    message: "Nome ultrapassou o limite de caracteres."
                                    },
                                    required: {
                                            value: true,
                                            message: "Campo obrigatorio", 
                                        },
                                    }
                                )} 
                                id="transition-modal-titulo" 
                                margin="normal" required 
                                fullWidth name="name" autoComplete="off"
                                placeholder="Nome do Estoque"
                                aria-label="Nome do estoque" 
                                variant="standard" 
                                error={Boolean(errors?.name?.message)}
                                helperText={errors?.name?.message}
                            />
                            <TextField {...register("description", 
                                { 
                                    maxLength: {
                                        value: 200,
                                        message: "Descricao ultrapassou o limite de caracteres."
                                    },
                                    required: {
                                        value: true,
                                        message: "Campo obrigatorio",
                                    },
                                })} 
                                id="transition-moddal-descricao" 
                                margin="normal" required fullWidth name="description" 
                                autoComplete="off" 
                                placeholder="Descricao" 
                                aria-label="Descricao do estoque" 
                                variant="standard" 
                                error={Boolean(errors?.description?.message)}
                                helperText={errors?.description?.message}
                            />
                            
                            <Button type="submit" 
                                sx={{ 
                                    marginTop: 3, 
                                    fontSize: "1rem", fontWeight: "600", 
                                    color: colors.grey[100], 
                                    backgroundColor: colors.orangeAccent[500], 
                                    textTransform: "none", width: "120px", 
                                    borderRadius: "25px", 
                                    "&:hover": { 
                                        color: colors.grey[100], 
                                        backgroundColor: colors.purpleAccent[500] 
                                    } 
                                }}
                            >
                                Criar
                            </Button>
                        </Box>
                    </Modal>
                </Box>

                
            </Stack>

            <Box sx={{ 
                display:"flex", 
                justifyContent: "center",
                alignItems: "flex-start",
                flexWrap:"wrap",
                margin: 2,
                boxShaddow: "0 0 10px rgba(255, 255, 255, 0.2)", 
            }}>
                { snackbar.severity !== "" && <CustomAlert snackbar={snackbar} handleClose={handleCloseSnackbar} /> }
                {inventories && inventories.map((inventory) => (
                    <Stack key={inventory.id} 
                        sx={{ 
                            padding: 2,
                        }}
                    >
                        <Card sx={{ 
                            padding: 1,
                            width: 320,
                            maxWidth:"100%",
                            height: 360,
                            display:"flex", 
                            flexDirection: "column",
                            justifyContent: 'space-between',
                            backgroundColor: colors.grey[700], 
                        }}>
                            <CardContent>
                                <ApiIcon fontSize="large" sx={{ color: colors.orangeAccent[600] }}/>
                                <Typography variant="h5" component="h3" 
                                    sx={{ 
                                        margin: "1rem 0", 
                                        color: colors.grey[300], 
                                        fontWeight: 700,
                                    }}>
                                {inventory.name}
                                </Typography>
                                <Typography variant="h6" component="h4" 
                                    sx={{  
                                        color: colors.grey[300], 
                                        overflowWrap: "break-word" 
                                    }}>
                                {inventory.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <IconButton aria-label="remover" onClick={() => setOpenDialog(true)}
                                >
                                    <DeleteIcon sx={{ "&:hover": { color: colors.orangeAccent[500] }}} />
                                </IconButton>
                                <IconButton aria-label="entrar-dashboard-do-estoque" 
                                    onClick={() => goToItem(inventory.id)}
                                >
                                    <LoginIcon sx={{ "&:hover": { color: colors.orangeAccent[500] }}}  />
                                </IconButton>
                            </CardActions>
                        </Card>
                        <CustomDialog 
                            openDialog={openDialog}
                            setOpenDialog={setOpenDialog}
                            itemToDeleteId={inventory.id}
                            removeItem={removeInventory} 
                        />
                    </Stack>))}
                </Box>
        </Stack>
    </div>
  )
}

export default CreateInventoryFromUser