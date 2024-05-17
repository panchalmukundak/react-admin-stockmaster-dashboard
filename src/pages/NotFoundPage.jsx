import { useNavigate } from "react-router-dom";
import { Button, Stack, Typography } from "@mui/material";
import FindInPageIcon from '@mui/icons-material/FindInPage';

const NotFoundPage = () => {

    const navigate = useNavigate();
  
    const handleGoLogin = () => {
      navigate("/");
    };
  
    return (
    <>
      <Stack 
      sx={{ 
        display:"flex", 
        justifyContent:"center", 
        alignItems: "center", 
        height:"100vh"
    }}
    >  
        <FindInPageIcon sx={{ fontSize: 250, color: "#F75F00" }} />  
        <Typography variant="body1"sx={{ fontSize: 40 }}>
        404 Página não encontrada
        </Typography>
        <Button variant="contained" color="primary" 
        sx={{ mt: 4, fontSize: 16, backgroundColor: "#242528", }} 
        onClick={handleGoLogin}>
          Fazer login
        </Button>
      </Stack>
    </>
    );
};
  
export default NotFoundPage;