import { useForm } from 'react-hook-form';
import { useState } from 'react';
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
import { 
  Visibility, 
  VisibilityOff,
} from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { NavLink, useNavigate  } from "react-router-dom";
import { useAuth } from "../../hooks/Context/AuthProvider/useAuth";
import imgLeft from "../../assets/pexels-selim-can-ik-5860937.jpg";
import CustomAlert from '../CustomAlert/CustomAlert';


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
    color: isErrorMessageExists ? '#f44336' : '#f2f0f0',
  }
});


const SignUp = () => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [showSecondPassword, setShowSecondPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });
  
  const { 
    register, 
    handleSubmit,
    formState: {
      errors, isSubmitting
    },
    watch
  } = useForm();

  const password = watch("password");

  const navigate = useNavigate();

  const auth = useAuth();


  const onSubmit = async (formData) => {

    try {      
      const response = await auth.register(
        formData.name,
        formData.userName,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      
      if( response.status === 201 ){
        setSnackbar({ 
          open: true, 
          message: "Cadastro realizado com sucesso.", 
          severity: "success"
        });
        navigate('/');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Seus dados não são válidos. Tente novamente.",
        severity: "error",
      });
    }
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setSnackbar({ ...snackbar, open: false });
};


  return (
    <Grid container 
      component="main" 
      sx={{ 
        height: '100vh', 
        backgroundColor: "#141414", 
      }}
    >
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${imgLeft})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} 
        component={Paper} 
        elevation={6} 
        square 
        sx={{ 
          padding: "0 2rem 0",
          backgroundColor: "#141414", 
          color: "#f2f0f0",
        }}
      >
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, backgroundColor: "#F75F01" }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography variant="h5" component="h1" align="center" mt={3} gutterBottom>
            Crie sua conta no <span style={{ fontWeight: 'bold' }}>StockMaster</span>
          </Typography>

          <form noValidate onSubmit={handleSubmit(onSubmit)} style={{ mt: 1 }} autoComplete="off">
            <TextField
              fullWidth
              required
              margin="normal"
              label="Nome"
              name="name"
              autoComplete="name"
              autoFocus
              sx={ changeTextFieldStyles(Boolean(errors?.name?.message)) }
              error={Boolean(errors?.name?.message)}
              helperText={errors?.name?.message}
              {...register("name", 
                { 
                  required: {
                    value: true,
                    message: "Nome é obrigatório.",
                  },
                  minLength: {
                    value: 3,
                    message: "Nome não pode ser pequeno ou muito grande."
                  },
                  maxLength: {
                    value: 40,
                    message: "Nome não pode ser pequeno ou muito grande."
                  },
                })
              }
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="userName"
              label="Nome de Usuário"
              name="userName"
              autoComplete="name"
              sx={ changeTextFieldStyles(Boolean(errors?.userName?.message)) }
              error={Boolean(errors?.userName?.message)}
              helperText={errors?.userName?.message}
              {...register("userName", 
                { 
                  required: {
                    value: true,
                    message: "Nome de Usuário é obrigatório.",
                  },
                  minLength: {
                    value: 3,
                    message: "Nome de Usuário não pode ser pequeno ou muito grande."
                  },
                  maxLength: {
                    value: 40,
                    message: "Nome de Usuário não pode ser pequeno ou muito grande."
                  },
                  
                })
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
              autoComplete="new-password"
              sx={ changeTextFieldStyles(Boolean(errors?.email?.message)) }
              error={Boolean(errors?.email)}
              helperText={errors?.email?.message}
              {...register("email", 
                {
                  required: {
                    value: true,
                    message: "Email é obrigatório." 
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/,
                    message: "Email não é válido. O email digitado precisa ser como exemplo@email.com",
                  },
                  
                }
            )}
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
                  required: "Senha é obrigatória.",
                  minLength: { 
                    value: 6, 
                    message: "Senha deve ter a quantidade necessaria de caracteres." 
                  },
                  maxLength: { 
                    value: 15,
                    message: "Senha deve ter a quantidade necessaria de caracteres."
                  }
                })}
              />
            </FormControl>
            {errors?.password && (
              <FormHelperText sx={{ ml: 2 }} error>{errors?.password?.message}</FormHelperText>
            )}
            <FormControl 
              sx={{ 
                ...changeTextFieldStyles(Boolean(errors?.confirmPassword?.message)), 
                mt: 2, 
                width: '100%' 
              }} 
              variant="outlined"  
            >
              <InputLabel htmlFor="outlined-adornment-newpassword" required>Confirmar Senha</InputLabel>
              <OutlinedInput
                id="outlined-adornment-newpassword"
                type={showSecondPassword ? 'text' : 'password'}
                name="confirmPassword"
                label="Confirmar Senha"
                autoComplete="new-password"
                error={Boolean(errors?.confirmPassword)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowSecondPassword(!showSecondPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showSecondPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                {...register("confirmPassword", { 
                  required: {
                    value: true ,
                    message: "Confirmação de Senha é obrigatória.",
                  },
                  validate: value => value === password || "As senhas não coincidem."
                })}
              />
            </FormControl>
            {errors?.confirmPassword && (
              <FormHelperText sx={{ ml: 2 }} error>{errors?.confirmPassword?.message}</FormHelperText>
            )}

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
                isSubmitting ? <CircularProgress color="inherit" size={24} /> : "Cadastrar"
              }
            </Button>
            <Stack mt={2}>
              <Typography variant="p" align="center" gutterBottom>
                Já tem uma conta? 
                <Button
                  component={NavLink}
                  to="/"
                  sx={{
                    textDecoration: "underline",
                    textTransform: 'none', 
                    color: '#f2f0f0',
                    '&:hover': {
                      textDecoration: "underline",
                      color: '#f75f01',
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  Entrar
                </Button>
              </Typography>
            </Stack>
          <CustomAlert snackbar={snackbar} handleClose={handleCloseSnackbar} />
          </form>
        </Box>
      </Grid>
    </Grid>
  );
}

export default SignUp;