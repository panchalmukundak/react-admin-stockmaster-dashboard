import { useState, useContext } from 'react';
import { AppBar, IconButton, Typography, Box, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import WidgetsIcon from '@mui/icons-material/Widgets';
import { ColorModeContext } from "../../theme";
import { tokens } from "../../theme";
import { useTheme } from '@mui/material/styles';
import ListItems from "../ListItems/ListItems";
import ProfileItem from "../ProfileItem/ProfileItem";

const drawerWidth = 240;

const Navbar = () => {

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };


  const drawer = (
    <div >
      <Box component="section" sx={{ 
          display:"flex", justifyContent: 'center',
          alignItems: "center",
          backgroundColor: colors.grey[800],
          border: "none",
        }}
      >
        <WidgetsIcon sx={{ color: colors.orangeAccent[500] }} />
        <Typography variant="h4" component="h1" 
          sx={{ 
            my: 3,
            marginLeft: 1,
            color: colors.orangeAccent[500], 
            fontWeight: 600 
          }}
          >
            StockMaster
        </Typography>
      </Box>
      <ListItems />
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: "none",
          background: "transparent",
        }}
      >
        <Box sx={{ 
          display:"flex",
          justifyContent: "space-between",
          p: 2,
          boxShadow: "none",
        }}
        >
          <Box>
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: 'none' }, }}
              >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box sx={{ display:"flex", }}>
            <IconButton onClick={colorMode.toggleColorMode}>
              {theme.palette.mode === "dark" ? (
                <DarkModeOutlinedIcon />
              ) : (
                <LightModeOutlinedIcon />
              )}
            </IconButton>
            <IconButton>
              <NotificationsOutlinedIcon />
            </IconButton>
            <ProfileItem />
          </Box>
        </Box>

      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{ 
            width:"100%",
            display: { xs: 'block', sm: 'none', },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth,
            },
            "& .MuiPaper-root": {
              background: "none",
              backgroundColor: colors.grey[800],
              border: "none",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm:'flex', md: 'flex' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth,
            },
            "& .MuiPaper-root": {
              background: "none",
              backgroundColor: colors.grey[800],
              border: "none",
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
    </Box>
  )
}

export default Navbar;