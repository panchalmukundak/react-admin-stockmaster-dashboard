import { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { getAllItems } from "../../util/util";
import { getUserLocalStorage } from "../../hooks/Context/AuthProvider/util";
import { getInventoryLocalStorage } from "../../hooks/Context/InventoryProvider/util";
import { useAuth } from "../../hooks/Context/AuthProvider/useAuth";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PieChartApp = () => {
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
    },[getItems]);

    return (
      <Box sx={{ marginTop: 3 }}>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill={colors.purpleAccent[600]} label />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>Carregando...</p>
        )}
      </Box>
    );
}

export default PieChartApp;