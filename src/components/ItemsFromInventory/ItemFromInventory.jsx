import { 
  Box,
  Toolbar
} from '@mui/material';
import { useTheme } from "@emotion/react";
import { getInventoryLocalStorage } from '../../hooks/Context/InventoryProvider/util';
import Navbar from "../Navbar/Navbar";
import Header from "../Header/Header";
import { tokens } from "../../theme";
import DataItems from '../DataItems/DataItems';

const ItemFromInventory = () => {

  const { name, description } = getInventoryLocalStorage();
  const drawerWidth = 240;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{ display: 'flex', }}>
      <Navbar />
      <Box sx={{ 
          flexGrow: 1, padding: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } 
        }}
      >
        <Toolbar />
        <Box  
          sx={{ 
            maxWidth: "65%",
            borderRadius: "10px 10px",
            padding: 3, 
            backgroundColor: colors.grey[800] 
          }}
        >
          <p style={{ color: colors.grey[400], marginBottom: 3, textTransform: "uppercase" }}>
            Itens
          </p>
          <Header title={name} subtitle={description} />
        </Box>
        <DataItems />
      </Box>
    </Box>
  )
}

export default ItemFromInventory