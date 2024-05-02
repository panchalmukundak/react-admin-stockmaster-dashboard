import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
//mui
import { 
    Typography,
    Fab,
    Box,
    Button,
    AppBar,
    Stack,
    Toolbar,
    Modal,
    TextField,
    useMediaQuery,
    Alert,
    AlertTitle,
} from '@mui/material';
// icon
import AddIcon from '@mui/icons-material/Add';
//import ListInventory from '../ListInventory/ListInventory';
import { addInventory, getUserLocalStorage } from '../../util/util';
import { useForm } from 'react-hook-form';
import ListInventory from '../ListInventory/ListInventory';



const changeTextFieldStyles = () => ({
  mt: 2,
  mb: 2,
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: '#f2f0f0',
  },
  "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: '#f2f0f0',
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: '#f2f0f0',
  },
  "& .MuiInputLabel-outlined.Mui-focused": {
    color: '#f2f0f0',
  },
  "& .MuiFormHelperText-root.Mui-focused": {
    color: '#f2f0f0',
  },
  "& .MuiInputLabel-asterisk": {
    color: '#f2f0f0',
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: '#f2f0f0',
  },
  "& .MuiInputBase-input.MuiOutlinedInput-input": {
    color: '#f2f0f0',
  },
  "& .MuiInputBase-input": {
    color: '#f2f0f0',
  },
  "& .MuiInputLabel-formControl": {
    color: '#f2f0f0',
  },
  "& .MuiSvgIcon-root": {
    color: '#f2f0f0',
  },
  "& .MuiOutlinedInput-root": {
    color: "#f2f0f0",
  },
  "& .MuiInputBase-root": {
    borderBottom: "2px solid #727681", // Define a cor da borda como branco
    '&:hover': {
      borderBottom: "2px solid #F75F01",
    },
    '&.Mui-active': {
      borderBottom: "2px solid #F75F01",
    },
    '&.MuiInputBase-root:focus': {
      borderBottom: "2px solid #F75F01",
    },
    "& .Mui-focusVisibl": {
      borderBottom: "2px solid #F75F01",
    }
  },
});



const UserInventory = () => {

  const [open, setOpen] = useState(false);
  const [error, setError] = useState(""); 

  const theme = useTheme();

    // Verificando se o tamanho da tela é xs ou sm
  const isXsOrSm = useMediaQuery(theme.breakpoints.down('sm')); 

  const { register, handleSubmit, reset } = useForm();

  const accessToken = getUserLocalStorage().token;
  const userId = getUserLocalStorage().id;

  const onSubmit = async(data) => {

    const headersConfig = { 
      headers: { 
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      } 
    };

    const response = await addInventory(userId, data, headersConfig);
    console.log(response);

    if (response.status !== 201) {
      console.error('Error ao criar inventario.', error);
      setError("Erro ao criar inventario"); // Armazenando a mensagem de erro no estado
    }
    setOpen(false);
    reset();
  }

  const resetModal = () => {
    setOpen(false);
    setError("");
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    // Ajustando a transformação com base no tamanho do tema
    transform: isXsOrSm ? 'translate(-50%, -50%)' : 'translate(-60%, -60%)',
    maxWidth: "380px",
    width: "90%", // Alterado para 90% da largura do viewport
    color: "#f2f0f0",
    bgcolor: '#292929',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  
  return (

    <div>
      <AppBar position="static" 
        sx={{ 
          backgroundColor: "#121212",
        }}>
        <Toolbar>
          <Typography variant="h5" component="h1" 
            sx={{ 
              flexGrow: 1,
            }}
          >
            StockMaster
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Stack
        component="section"
        sx={{ 
          height: '100vh',
          color: "#f2f0f0",
          backgroundColor: "#000",
        }}
      >
        <Stack component="section"
          sx={{
            my: 5,
            justifyContent: "center",
            alignSelf: "center",
            border: "1px solid #525252",
            borderRadius: "10px",
          }}
        >
          <Typography 
            variant="h3" 
            component="h2" 
            align="center"
            gutterBottom  
            sx={{
              fontWeight: "600",
              padding: "1rem",
            }}
          >
            Estoques
          </Typography>

          {/*<Divider variant="middle" sx={{ backgroundColor: "#525252", }} /> */}
          
          { /*<Typography 
            variant="h6" 
            component="p" 
            align="center" 
            sx={{
              p: 2,
              fontWeight: 300,
              color: "#a1a4ab",
            }} 
            gutterBottom
          >
            { isExistsInventory
              ? "Seus estoques estão diponiveis para uso."
              : "Você não possui estoque cadastrado." 
            }
          </Typography> */}

          <Box
            sx={{ 
              m: 2,
              justifyContent: "center",
              alignSelf: "center"
            }}
          >
            <Fab 
              sx={{ 
                backgroundColor: "#F75F01",
              }} 
              aria-label="add"
              onClick={() => setOpen(true)}
            >
              <AddIcon />
            </Fab>
          </Box>

          <Typography 
            variant="p" 
            component="p" 
            align="center"
            gutterBottom  
            sx={{
              margin: "2rem",
              fontWeight: "300",
            }}
          >
            Clique no botao e
            escolha<br/> um nome para seu estoque.
          </Typography>
        </Stack>

        <ListInventory />

      </Stack>
      
      <Modal
        open={open}
        onClose={resetModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>

          <form onSubmit={handleSubmit(onSubmit)}>
            
            <Typography id="modal-modal-title" 
              variant="h6" 
              component="h2"
              sx={{ pb: 2, }}
              >
              Dê um nome e uma descricao para seu estoque.
            </Typography>
            <TextField
              {...register("name")}
              margin="normal"
              required
              fullWidth
              name="name"
              autoComplete="off"
              placeholder="Meu Estoque"
              aria-label="Nome do estoque"
              variant="standard"
              sx={ changeTextFieldStyles() }
            />
            <TextField
              {...register("description")}
              margin="normal"
              required
              fullWidth
              name="description"
              autoComplete="off"
              placeholder="Descricao"
              aria-label="Descricao do estoque"
              variant="standard"
              sx={ changeTextFieldStyles() }
            />
            <Button
              type="submit"
              sx={{
                mt: 3,
                fontSize: "1rem",
                fontWeight: "600",
                color: "#f2f0f0",
                backgroundColor: "#F75F01",
                textTransform: "none",
                width: "120px",
                borderRadius: "25px",
                '&:hover': {
                  color:"#000",
                  backgroundColor: '#f2f0f0', // Altera a cor de fundo para branco ao passar o mouse
                },
              }}
              >
              Criar
            </Button>
          </form>

          {error.length > 0 && ( // Renderizar o alerta de erro se houver um erro
            <Alert severity="error" sx={{ mt: 3 }}>
              <AlertTitle>Error ao criar seu estoque</AlertTitle>
              {error}
            </Alert>
          )}

        </Box>
      </Modal>
    </div>
  )
}

export default UserInventory;