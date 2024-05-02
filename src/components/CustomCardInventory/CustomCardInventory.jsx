import { 
    Card, 
    CardContent, 
    CardHeader, 
    Typography, 
    IconButton,
} from '@mui/material';
//icon
import DeleteIcon from '@mui/icons-material/Delete';
//theme
import { tokens } from "../../theme";
import { useTheme } from '@mui/material/styles';
//props
import PropTypes from 'prop-types';


const CustomCardInventory = ({ name, description, onDelete }) => {
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleDelete = () => {
        onDelete(name);
        console.log(name); // Passando o nome do item a ser excluído para a função de callback
    };

    
  return (
    <Card sx={{ backgroundColor: colors.orangeAccent[500] }}>
      <CardHeader 
        title={name} 
        action={
            <IconButton onClick={handleDelete} aria-label="delete">
                <DeleteIcon />
            </IconButton>
        }
      />
      <CardContent>
        <Typography variant="body2" 
        sx={{
            color: colors.grey[900],
            overflowWrap: 'break-word',
        }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

CustomCardInventory.propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
};

export default CustomCardInventory;