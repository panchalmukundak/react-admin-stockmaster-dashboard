import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from "@mui/material/Typography";
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';


export const mainListItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <Typography variant="h6" component="li">
        Dashboard
      </Typography>
    </ListItemButton>

    <ListItemButton>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <Typography variant="h6" component="li">
        Orders
      </Typography>
    </ListItemButton>

    <ListItemButton>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <Typography variant="h6" component="li">
        Customers
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
    
    <ListItemButton>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <Typography variant="h6" component="li">
        Integrations
      </Typography>
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <Typography variant="h6" component="li">
        Current Month
      </Typography>
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <Typography variant="h6" component="li">
        Last quarter
      </Typography>
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <Typography variant="h6" component="li">
        Year-end sale
      </Typography>
    </ListItemButton>
  </React.Fragment>
);

