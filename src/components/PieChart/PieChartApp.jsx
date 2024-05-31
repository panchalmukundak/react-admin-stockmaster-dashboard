import { useCallback, useEffect, useState } from "react";
import { getAllItems } from "../../util/util";
import { getUserLocalStorage } from "../../hooks/Context/AuthProvider/util";
import { getInventoryLocalStorage } from "../../hooks/Context/InventoryProvider/util";
import { useAuth } from "../../hooks/Context/AuthProvider/useAuth";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { PieChart } from '@mui/x-charts/PieChart';

const PieChartApp = () => {
  const [data, setData] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  const auth = useAuth();


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const getItems = useCallback(async () => {
    try {
      if (auth.isValidToken(auth.token)) {
        const { token } = getUserLocalStorage();
        const { id } = getInventoryLocalStorage();
        const headersConfig = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await getAllItems(id, headersConfig);
        if (response && response.status === 200) {
          setData(response.data.map(item => ({ label: item.name, value: item.amount })));
        } else {
          setSnackbar({ 
            open: true, 
            message: "Erro ao listar os itens.", 
            severity: "error" 
          });
        }
      }
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: "Erro interno. Tente novamente mais tarde.", 
        severity: "error"
      });
    } 
  }, [auth]);

  useEffect(() => {
    getItems();
  }, [getItems]);

  return (
    <div style={{ paddingTop: "1.5rem", width: "500px", }}>
      <div style={{ width:"100%", backgroundColor: colors.grey[800], }}>
        <PieChart
          series={[
            {
              data,
            },
          ]}
          height={300}
        />
        {snackbar.open && (
          <p>
            {snackbar.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default PieChartApp;