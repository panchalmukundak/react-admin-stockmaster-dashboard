import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
//import { ColorModeContext, tokens } from "../../theme";
import { ColorModeContext } from "../../theme";
//import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
//import SearchIcon from "@mui/icons-material/Search";
import ProfileItem from "../ProfileItem/ProfileItem";


const Topbar = () => {
  const theme = useTheme();
  //const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <Box display="flex" justifyContent="flex-end"
    >
      {/*
      <Box
        display="flex"
        sx={{
          color: colors.primary[100],
          backgroundColor: colors.grey[700],
          borderRadius: "3px"
        }}
      >
        <InputBase sx={{ ml: 2, flex: 1, }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1, }}>
          <SearchIcon sx={{ color: colors.primary[100] }} />
        </IconButton>
      </Box> */}

      <Box display="flex">
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
  );
};

export default Topbar;