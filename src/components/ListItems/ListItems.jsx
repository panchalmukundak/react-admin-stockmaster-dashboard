import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from "@mui/material/Typography";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import { NavLink } from 'react-router-dom';

const ListItems = () => {
  return (

  <List component="nav" style={{margin: 3,}} >
    <ListItemButton component={NavLink} to="/home/dashboard">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <Typography variant="h6" component="li">
        Dashboard
      </Typography>
    </ListItemButton>

    <ListItemButton component={NavLink} to="/home">
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <Typography variant="h6" component="li">
        Estoques
      </Typography>
    </ListItemButton>

    <ListItemButton component={NavLink} to="/home/item">
      <ListItemIcon>
        <AppRegistrationIcon />
      </ListItemIcon>
      <Typography variant="h6" component="li">
        Itens
      </Typography>
    </ListItemButton>

    <ListItemButton component={NavLink} to="/home/transaction">
      <ListItemIcon>
        <LocalAtmIcon />
      </ListItemIcon>
      <Typography variant="h6" component="li">
        Transacoes
      </Typography>
    </ListItemButton>

    <ListItemButton>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <Typography variant="h6" component="li">
        Reports
      </Typography>
    </ListItemButton>
  </List>
  )
}

export default ListItems;