import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import PropTypes from 'prop-types';

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  return (
    <Box compmnenet="section" sx={{ marginBottom: 5 }}>
      <Typography
        component="h1"
        variant="h2"
        sx={{ 
          my: "1rem",
          textTransform: "capitalize",
          color: colors.grey[300],
          fontWeight: 700,
          overflowWrap: "break-word",
        }}
      >
        {title}
      </Typography>
      <Typography component="h2" variant="h5" 
        sx={{ 
          marginBottom:"1rem", 
          textAlign:"justify", 
          overflowWrap: "break-word",
          color: colors.grey[300] 
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default Header;
