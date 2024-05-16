import Navbar from "../Navbar/Navbar";
import Header from "../Header/Header";
import { 
  Box,
  Toolbar,
} from '@mui/material';

const DashboardPanel = () => {

  const drawerWidth = 240;

  return (
    
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Box sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Header title="Dashboard" subtitle="Veja suas movimentacoes via graficos" />
      </Box>
    </Box>
    
  )
}

export default DashboardPanel;