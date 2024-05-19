import { useState } from 'react';
import {
    Button, 
    TextField,
    Typography,
    FormControl,
    FormHelperText,
    InputLabel, 
    OutlinedInput, 
    IconButton, 
    InputAdornment,
    Stack,
    CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { changeTextFieldStyles, updateUserData } from '../../util/util';
import { tokens } from '../../theme';
import { useTheme } from '@emotion/react';
import CustomAlert from '../CustomAlert/CustomAlert';
import { useAuth } from '../../hooks/Context/AuthProvider/useAuth';
import { getUserLocalStorage } from '../../hooks/Context/AuthProvider/util';

const UserFormData = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showSecondPassword, setShowSecondPassword] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" }); 

      
    const { 
        register, 
        handleSubmit, 
        reset,
        formState: { errors, isSubmitting }, 
        watch   
    } = useForm();

    const password = watch("password");
    const auth = useAuth();

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const onSubmitForm = async (formData) => {
        const user = getUserLocalStorage();
        if(auth.isValidToken(user.token)) {
            const headersConfig = { 
                headers: { 
                    Authorization: `Bearer ${user.token}`,
                } 
            };
            try {
                
                const response = await updateUserData(user.id, formData, headersConfig);
                if (response.status === 200) {
                    setSnackbar({ 
                        open: true, 
                        message: "Seus dados foram atualizados com sucesso!", 
                        severity: "success"
                    });
                } 
                else {
                    setSnackbar({
                        open: true,
                        message:
                            "Erro ao fazer a atualização dos seus dados. Tente novamente mais tarde.",
                        severity: "error",
                    });
                }
            } 
            catch (error) {
                setSnackbar({
                    open: true,
                    message: "Ocorreu um erro. Tente novamente mais tarde.",
                    severity: "error",
                });
            }
            reset();
        }
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
            <form noValidate onSubmit={handleSubmit(onSubmitForm)} style={{ marginTop: 1, }} autoComplete="off">
                <TextField
                    size="small"
                    fullWidth
                    required
                    margin="normal"
                    label="Nome"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    sx={ changeTextFieldStyles(Boolean(errors?.name?.message), colors.redAccent[500], colors.grey[400], colors.grey[100]) }
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
                            message: "Nome precisa ter mais de 3 letras."
                        },
                        maxLength: {
                            value: 40,
                            message: "Nome ultrapassou o limite de caracteres."
                        },
                        })
                    }
                />

                <Typography component="h2" variant="h5" 
                    sx={{ margin: "1rem 0", color: colors.purpleAccent[300] }}
                >
                    Senha e Seguranca
                </Typography>

                <FormControl 
                
                    sx={{ 
                    ...changeTextFieldStyles(Boolean(errors?.password?.message), colors.redAccent[500], colors.grey[400], colors.grey[100]), 
                    pt: 1,
                    width: '100%' 
                    }} 
                >
                    <InputLabel htmlFor="password" required>Senha</InputLabel>
                    <OutlinedInput
                        size="small"
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
                        required: "Senha é obrigatória.",
                        minLength: { 
                            value: 6, 
                            message: "Senha deve ter no mínimo 6 caracteres." 
                        },
                        maxLength: { 
                            value: 15,
                            message: "Senha deve ter no máximo 15 caracteres."
                        }
                        })}
                    />
                </FormControl>
                {errors?.password && (
                <FormHelperText sx={{ ml: 2 }} error>{errors?.password?.message}</FormHelperText>
                )}
                <FormControl 
                    sx={{ 
                    ...changeTextFieldStyles(Boolean(errors?.confirmPassword?.message), colors.redAccent[500], colors.grey[400], colors.grey[100]),
                    pt: 1,
                    mt:2, 
                    width: '100%' 
                }} 
                variant="outlined"  
                >
                    <InputLabel htmlFor="confirmPassword" required>Confirmar Senha</InputLabel>
                    <OutlinedInput
                        size="small"
                        id="confirmPassword"
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
                sx={{ marginTop: 5, 
                    marginBottom: 2,
                    "&:hover":{
                        backgroundColor: colors.orangeAccent[600],
                      } 
                }}
                variant="contained"
                fullWidth
                type="submit"
                style={{
                    textTransform: 'none',
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    backgroundColor: colors.orangeAccent[500],
                }}
                disabled={isSubmitting}
                >
                {
                    isSubmitting ? <CircularProgress color="inherit" size={24} /> : "Salvar"
                }
                </Button>
                
                <CustomAlert snackbar={snackbar} handleClose={handleCloseSnackbar} />
            </form>
        </Stack>
    );
}

export default UserFormData;