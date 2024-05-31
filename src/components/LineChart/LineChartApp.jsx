import { useCallback, useEffect, useState } from "react";
import { getAllItems } from "../../util/util";
import { getUserLocalStorage } from "../../hooks/Context/AuthProvider/util";
import { getInventoryLocalStorage } from "../../hooks/Context/InventoryProvider/util";
import { useAuth } from "../../hooks/Context/AuthProvider/useAuth";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { LineChart } from '@mui/x-charts/LineChart';

const LineChartApp = () => {
  const [data, setData] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" }); 

  const auth = useAuth();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const getItems = useCallback(async () => {
    try {
      if(auth.isValidToken(auth.token)) {
        const { token } = getUserLocalStorage();
        const { id } = getInventoryLocalStorage();
        const headersConfig = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await getAllItems(id, headersConfig);
        if (response && response.status === 200) {
          setData(response.data.map(item => ({ name: item.name, unitPrice: item.unitPrice, amount: item.amount })));
        } else {
          setSnackbar({ 
            open: true, 
            message: "Error ao listar os itens.", 
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
  },[auth]);

  useEffect(() => {
    getItems();
  }, [getItems]);

  const xLabels = data.map(item => item.name);
  const unitPrices = data.map(item => item.unitPrice);
  const amounts = data.map(item => item.amount);

  return (
    <div style={{ backgroundColor: colors.grey[800], }}>
      <LineChart
        width={500}
        height={300}
        series={[
          { data: unitPrices, label: 'Preco Unitario', color: colors.orangeAccent[500] },
          { data: amounts, label: 'Quantidade', color: colors.greenAccent[500] },
        ]}
        xAxis={[{ scaleType: 'point', data: xLabels }]}
      />
      {snackbar.open && (
        <p>
          {snackbar.message}
        </p>
      )}
    </div>
  );
}

export default LineChartApp;
