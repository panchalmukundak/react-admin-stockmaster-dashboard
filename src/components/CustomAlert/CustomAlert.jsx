import {
    Snackbar,
    Alert,
} from '@mui/material';
import {
    topSnackbarPosition
} from '../../util/util';
import PropTypes from 'prop-types';

const CustomAlert = ({ snackbar, handleClose  }) => {

  return (
    <Snackbar 
        open={snackbar.open} 
        onClose={handleClose}
        anchorOrigin={topSnackbarPosition}
        autoHideDuration={5000}
    >
        <Alert
            onClose={handleClose}
            severity={snackbar.severity}
            color ={snackbar.severity === "success" ? "success" : "error"}
            variant="filled"
            sx={{
                width: "100%",
                color: "white"
            }}
        >
            {snackbar.message}
        </Alert>
    </Snackbar>
  )
}

CustomAlert.propTypes = {
    snackbar: PropTypes.shape({
        open: PropTypes.bool.isRequired,
        severity: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
    }).isRequired,
    handleClose: PropTypes.func.isRequired
};

export default CustomAlert;