import { useState } from 'react';
//theme
//mui
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from "@mui/material/Typography";
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { ListItemIcon } from '@mui/material';
import { 
  MenuItem,
  ListItemButton,
} from '@mui/material';
//icon
import MenuIcon from '@mui/icons-material/Menu';
//import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { mainListItems, secondaryListItems } from '../ListItems/ListItems';
import Topbar from '../Topbar/Topbar';



const drawerWidth = 220;


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(7),
        },
      }),
    },
  }),
);


const Item = ({title, to, icon, selected, setSelected}) => {
  return(
    <MenuItem
      active={selected === title}
      
    >
      <ListItemButton>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <Typography variant="h6" component="li">
          {title}
        </Typography>
      </ListItemButton>
    </MenuItem>
  )
}


const Navbar = () => {

  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Dashboard");

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    
    <Box sx={{ display: 'flex', }}>
        <CssBaseline />
        <Drawer variant="permanent" open={open}>                
            <Toolbar
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent:"space-around",
            }}
            >
                {open ?
                    <Typography
                        variant="h5"
                        component="h1"
                        sx={{ color: "#f75f01", fontWeight: "600" }}
                    >
                        StockMaster
                    </Typography> 
                    : ""
                }
                <IconButton onClick={toggleDrawer}>
                    <MenuIcon/>
                </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
              {mainListItems}
              <Divider sx={{ my: 1 }} />
              {secondaryListItems}              
            </List>
            <Divider />
            
        </Drawer>
        <Box
            component="main"
            sx={{
            backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            }}
        >
        </Box>
        <Stack width="100%">
            <Topbar />
        </Stack>
    </Box>
  );
}
export default Navbar;