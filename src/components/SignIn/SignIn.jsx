
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
  Snackbar,
  Alert,
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
//theme
import { tokens } from '../../theme';
import { useTheme } from '@emotion/react';
//js
import { changeTextFieldStyles, topSnackbarPosition } from "../../util/util";


const SignIn = () => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const { 
    register, 
    handleSubmit,
    formState: {
      errors, isSubmitting
    }
  } = useForm();

  const navigate = useNavigate();

  const auth = useAuth();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const onSubmit = async (formData) => {

    try {
      const response = await auth.authenticate(formData.userName, formData.password);
      console.log(response);

      if(response && response.status === 200) {
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
    } 
    catch (error) {
      console.log("Erro ao fazer o login.", error);

      setSnackbar({ 
        open: true, 
        message: 'Erro ao fazer o login.', 
        severity: 'error' 
      });

      setError(true);
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
      justifyContent="center"
      component="main" 
      sx={{ 
        height: '100vh',
        background: 'linear-gradient(rgba(255, 255, 255, 0.1) 0%, rgb(0, 0, 0) 100%)',
        backgroundColor: colors.grey[900], 
        color: colors.grey[100],   
      }}
    >
      <CssBaseline />
      <Grid item xs={12} sm={8} md={4} 
        component={Paper} 
        elevation={6} 
        square 
        sx={{ 
          padding: "3em 2rem 0",
          backgroundColor: colors.grey[900], 
          color: colors.grey[100], 
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
          <Avatar sx={{ margin: 1, backgroundColor: colors.orangeAccent[500] }}>
            <LockClockOutlinedIcon />
          </Avatar>

          <Typography variant="h5" component="h1" align="center" m={3} gutterBottom>
            Acesse sua conta no <span style={{ fontSize: 24, fontWeight: 700 }}>
              StockMaster</span>
          </Typography>

          <form noValidate onSubmit={handleSubmit(onSubmit)} 
          style={{ marginTop: 1 }} autoComplete="off">

            <TextField
              margin="normal"
              required
              fullWidth
              id="userName"
              label="Nome de Usuário"
              name="userName"
              autoComplete="name"
              autoFocus
              sx={ changeTextFieldStyles(Boolean(errors?.userName?.message), colors.redAccent[500], colors.grey[400], colors.grey[100]) }
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
                ...changeTextFieldStyles(Boolean(errors?.password?.message), colors.redAccent[500], colors.grey[400], colors.grey[100]), 
                mt: 2, 
                width: '100%' 
              }} 
            >
              <InputLabel htmlFor="password" required>Senha</InputLabel>
              <OutlinedInput
                id="password"
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
              style={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 17,
                backgroundColor: colors.orangeAccent[500],
              }}
              disabled={isSubmitting}
            >
              {
                isSubmitting ? <CircularProgress color="inherit" size={25} /> : "Entrar"
              }
            </Button>

            <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={handleCloseSnackbar}
              anchorOrigin={topSnackbarPosition}>
              <Alert
                onClose={handleCloseSnackbar}
                severity={snackbar.severity}
                color ={snackbar.severity ? "error" : "success"}
                variant="filled"
                sx={{
                    width: "100%",
                }}
              >
                {snackbar.message}
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
                    color: colors.grey[100],
                    '&:hover': {
                      textDecoration: "underline",
                      color: colors.orangeAccent[400],
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