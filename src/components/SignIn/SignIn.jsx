
//forms
import { useForm } from 'react-hook-form';
import { useState } from 'react';
//mui
import { 
  Typography,
  Button, 
  TextField,
  FormControl,
  FormHelperText,
  InputLabel, 
  OutlinedInput, 
  IconButton, 
  InputAdornment,
  CssBaseline,
  Avatar,
  Paper,
  Box,
  Stack,
  Grid,
  CircularProgress,
} from '@mui/material';
//icons
import { 
  Visibility, 
  VisibilityOff,
} from '@mui/icons-material';
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined';
// route
import { NavLink, useNavigate  } from "react-router-dom";
//authenticate
import { useAuth } from "../../hooks/Context/AuthProvider/useAuth";
//alert
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


const changeTextFieldStyles = (isErrorMessageExists) => ({
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: isErrorMessageExists ? '#f44336' : '#858585',
  },
  "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: isErrorMessageExists ? '#f44336' : '#f2f0f0',
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: isErrorMessageExists ? '#f44336' : '#f2f0f0',
  },
  "& .MuiInputLabel-outlined.Mui-focused": {
    color: isErrorMessageExists ? '#f44336' : '#f2f0f0',
  },
  "& .MuiFormHelperText-root.Mui-focused": {
    color: isErrorMessageExists ? '#f44336' : '#f2f0f0',
  },
  "& .MuiInputLabel-asterisk": {
    color: isErrorMessageExists ? '#f44336' : '#f2f0f0',
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: isErrorMessageExists ? '#f44336' : '#f2f0f0',
  },
  "& .MuiInputBase-input.MuiOutlinedInput-input": {
    color: isErrorMessageExists ? '#f44336' : '#f2f0f0',
  },
  "& .MuiInputBase-input::placeholder": {
    color: isErrorMessageExists ? '#f44336' : '#f2f0f0',
  },
  "& .MuiInputLabel-formControl" : {
    color: isErrorMessageExists ? '#f44336' : '#f2f0f0',
  },
  "& .MuiSvgIcon-root": {
    color: isErrorMessageExists ? '#f44336' : '#f2f0f0', // cor dos icones
  }
});

const topSnackbarPosition = {
  vertical: 'top',
  horizontal: 'center',
};

const SignIn = () => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);        

  const { 
    register, 
    handleSubmit,
    formState: {
      errors, isSubmitting
    }
  } = useForm();

  const navigate = useNavigate();

  const auth = useAuth();

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const onSubmit = async (formData) => {

    try {
      //const response = await api.post('/api/v1/auth/login', formData);
      await auth.authenticate(formData.userName, formData.password);
      //localStorage.setItem('username', formData.userName);
      //localStorage.setItem('a', response.data.token);
      //console.log(response.config);

      navigate('/home');
    } catch(error){
      console.log("Erro ao fazer o login.", error);
      setError(true);
      //navigate('/error');
    }
  }


  return (
    <Grid container
      justifyContent="center"
      component="main" 
      sx={{ 
        height: '100vh',
        background: 'linear-gradient(rgba(255, 255, 255, 0.1) 0%, rgb(0, 0, 0) 100%)',
        backgroundColor: "#141414", 
        color: "#f2f0f0"   
      }}
    >
      <CssBaseline />
      <Grid item xs={12} sm={8} md={4} 
        component={Paper} 
        elevation={6} 
        square 
        sx={{ 
          padding: "3em 2rem 0",
          backgroundColor: "#141414", 
          color: "#f2f0f0",
        }}
      >
        <Box
          sx={{
            my: 8,
            mx: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, backgroundColor: "#F75F01" }}>
            <LockClockOutlinedIcon />
          </Avatar>

          <Typography variant="h5" component="h1" align="center" m={3} gutterBottom>
            Acesse sua conta no <span style={{ fontWeight: 'bold' }}>StockMaster</span>
          </Typography>

          <form noValidate onSubmit={handleSubmit(onSubmit)} style={{ mt: 1 }} autoComplete="off">

            <TextField
              margin="normal"
              required
              fullWidth
              id="userName"
              label="Nome de Usuário"
              name="userName"
              autoComplete="name"
              autoFocus
              sx={ changeTextFieldStyles(Boolean(errors?.userName?.message)) }
              error={Boolean(errors?.userName?.message)}
              helperText={errors?.userName?.message}
              {...register("userName", 
                { 
                  required: {
                    value: true,
                    message: "Nome de Usuário é obrigatório.",
                  },
                })
              }
            />
            
            <FormControl 
              sx={{ 
                ...changeTextFieldStyles(Boolean(errors?.password?.message)), 
                mt: 2, 
                width: '100%' 
              }} 
            >
              <InputLabel htmlFor="outlined-adornment-password" required>Senha</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                label="Senha"
                name="password"
                autoComplete="password"
                error={Boolean(errors?.password)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                {...register("password", { 
                  required: {
                    value: true,
                    message: "Senha é obrigatória.",
                  },
                })}
              />
            </FormControl>
            {errors?.password && (
              <FormHelperText sx={{ ml: 2 }} error>{errors?.password?.message}</FormHelperText>
            )}

            <Button
              sx={{ 
                mt: 3, 
                mb: 2,
              }}
              variant="contained"
              fullWidth
              type="submit"
              onClick={handleClick}
              style={{
                textTransform: 'none',
                fontWeight: 'bold',
                backgroundColor: "#E07D15",
              }}
              disabled={isSubmitting}
            >
              {
                isSubmitting ? <CircularProgress color="inherit" size={24} /> : "Entrar"
              }
            </Button>
            <Snackbar open={open} autoHideDuration={8000} onClose={handleClose}
            anchorOrigin={topSnackbarPosition}>
              <Alert
                onClose={handleClose}
                severity={error ? "error" : "success"}
                color ={error ? "error" : "success"}
                variant="filled"
                sx={{ width: '100%' }}
              >
                { error ? "Erro ao fazer o login!" : "Voce esta sendo redirecionado com scuesso!" }
              </Alert>
            </Snackbar>

            <Stack mt={2}>
              <Typography variant="p" align="center" gutterBottom>
                Não tem uma conta? 
                <Button
                  component={NavLink}
                  to="/register"
                  sx={{
                    textDecoration: "underline",
                    textTransform: 'none', 
                    color: '#f2f0f0',
                    '&:hover': {
                      textDecoration: "underline",
                      color: '#E07D15',
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  Criar conta
                </Button>
              </Typography>
            </Stack>

          </form>
        </Box>
      </Grid>
    </Grid>
  );
}

export default SignIn;