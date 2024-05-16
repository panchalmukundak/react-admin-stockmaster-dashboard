import {
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import PropTypes from 'prop-types';

const CustomDialog = ({ openDialog, itemToDeleteId, removeItem, setOpenDialog }) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

  return (
    <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
        {"Voce tem certeza que deseja excluir esse item?"}
        </DialogTitle>
        <DialogActions>
            <Button onClick={() => {
                    setOpenDialog(false);
                }} 
                sx={{margin: 1, 
                    fontSize: "1rem", 
                    fontWeight: "600", 
                    color: colors.grey[100], 
                    backgroundColor: "transparent", 
                    textTransform: "none", width: "100px", 
                    borderRadius: "25px", "&:hover": { backgroundColor: colors.orangeAccent[600] }
                }}
            >
                Cancelar
            </Button>
            <Button autoFocus onClick={() => {
                setOpenDialog(false);
                if (itemToDeleteId !== null) {
                    setOpenDialog(false);
                    removeItem(itemToDeleteId);
                }
                }}
                sx={{margin: 1, 
                    fontSize: "1rem", 
                    fontWeight: "600", 
                    color: colors.grey[100], 
                    backgroundColor: "transparent", 
                    textTransform: "none", width: "100px", 
                    borderRadius: "25px", "&:hover": { backgroundColor: colors.orangeAccent[600] }
                }}
            >
                Excluir
            </Button>
        </DialogActions>
    </Dialog>
  )
}

CustomDialog.propTypes = {
    openDialog: PropTypes.bool.isRequired,
    setOpenDialog: PropTypes.func.isRequired,
    itemToDeleteId: PropTypes.number.isRequired,
    removeItem: PropTypes.func.isRequired,
};

export default CustomDialog;