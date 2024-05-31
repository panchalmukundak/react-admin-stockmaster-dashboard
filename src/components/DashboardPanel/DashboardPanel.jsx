import Navbar from "../Navbar/Navbar";
import Header from "../Header/Header";
import { Box, Toolbar, } from '@mui/material';
import BarChartApp from "../BarChart/BarChartApp";
import LineChartApp from "../LineChart/LineChartApp";
import PieChartApp from "../PieChart/PieChartApp";

const DashboardPanel = () => {

  const drawerWidth = 240;

  return (
    
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Box sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Header title="Dashboard" subtitle="Veja suas movimentações via gráficos" />
        <Box sx={{ display:"flex", flexWrap: "wrap" , flexDirection:"row", justifyContent:"space-around" }}>
          <BarChartApp />
          <LineChartApp />
          <PieChartApp />
        </Box>
      </Box>
    </Box>
    
  )
}

export default DashboardPanel;