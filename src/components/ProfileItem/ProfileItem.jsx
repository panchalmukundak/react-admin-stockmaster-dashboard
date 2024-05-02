import { useState } from 'react';
// mui
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import Stack from '@mui/material/Stack';
//theme
import { tokens } from "../../theme";
import { useTheme } from '@mui/material/styles';
//auth
import { useAuth } from '../../hooks/Context/AuthProvider/useAuth';
//router
import { useNavigate } from 'react-router-dom';

const ProfileItem = () => {

    const [openAnchorEl, setOpenAnchorEl] = useState(null);
    const navigate = useNavigate();
    const auth = useAuth();

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);


    const getOneLetterUserName = () => {
        const oneLetter = auth.userName.charAt(0);
        return oneLetter;
    }

    const clearUserDataAndLogout = () => {
        auth.logout();
        navigate('/login');
    }

    const handleClose = () => {
        setOpenAnchorEl(null);
    };



    return (
        <Stack 
            direction="row"
            justifyContent="center"
            alignItems="center"
        >   
            
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Account settings">
                <IconButton
                    onClick={(event) => setOpenAnchorEl(event.currentTarget)}
                    size="small"
                    aria-controls={openAnchorEl ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openAnchorEl ? 'true' : undefined}
                >
                    <Avatar 
                        sx={{ 
                            width: 32, 
                            height: 32,
                            textTransform: "capitalize",
                            bgcolor: colors.grey[100]
                        }}>
                        {getOneLetterUserName()}
                    </Avatar>
                </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={openAnchorEl}
                id="account-menu"
                open={Boolean(openAnchorEl)}
                onClose={handleClose}
                onClick={handleClose}
                sx={{
                    elevation: 0,
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    mr: 1,
                    },
                    '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                    },
                }}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem onClick={clearUserDataAndLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </Stack>
    );
};
export default ProfileItem;