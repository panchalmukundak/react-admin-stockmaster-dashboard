import {
  List,
  ListItemButton,
  ListItemIcon,
  Typography,
} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import LayersIcon from '@mui/icons-material/Layers';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
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
        Estoque
      </Typography>
    </ListItemButton>
    <ListItemButton component={NavLink} to="/home/item">
      <ListItemIcon>
        <AppRegistrationIcon />
      </ListItemIcon>
      <Typography variant="h6" component="li">
        Item
      </Typography>
    </ListItemButton>
    <ListItemButton component={NavLink} to="/home/transaction">
      <ListItemIcon>
        <LocalAtmIcon />
      </ListItemIcon>
      <Typography variant="h6" component="li">
        Transacao
      </Typography>
    </ListItemButton>
    <ListItemButton component={NavLink} to="/home/history">
      <ListItemIcon>
        <HistoryIcon />
      </ListItemIcon>
      <Typography variant="h6" component="li">
        Historico
      </Typography>
    </ListItemButton>
    <ListItemButton component={NavLink} to="/home/edit-profile">
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <Typography variant="h6" component="li">
        Configuracoes
      </Typography>
    </ListItemButton>
  </List>
  )
}

export default ListItems;