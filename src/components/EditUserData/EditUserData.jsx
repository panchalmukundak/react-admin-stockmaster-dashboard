import { 
  Box,
  Toolbar,
} from '@mui/material';
import Navbar from "../Navbar/Navbar";
import Header from "../Header/Header";
import UserFormData from '../UserFormData/UserFormData';

const EditUserData = () => {
  const drawerWidth = 240;
  
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Box sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Header 
          title="Configuracoes" 
          subtitle="Altere seus dados neste painel" 
        />
        <UserFormData />
      </Box>
    </Box>
  )
}

export default EditUserData