import {
    Box,
    Toolbar,
  } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import Header from "../Header/Header";
import Transactions from "../Transactions/Transactions";

const ShowTransaction = () => {
  const drawerWidth = 240;
  
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Box sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Header
          title="Transacoes" 
          subtitle="Faca suas transacoes neste painel" 
        />
        <Transactions />
      </Box>
    </Box>
  )
}

export default ShowTransaction