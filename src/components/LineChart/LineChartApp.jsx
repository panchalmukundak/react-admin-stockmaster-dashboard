import { useCallback, useEffect, useState } from "react";
import { getAllItems } from "../../util/util";
import { getUserLocalStorage } from "../../hooks/Context/AuthProvider/util";
import { getInventoryLocalStorage } from "../../hooks/Context/InventoryProvider/util";
import { useAuth } from "../../hooks/Context/AuthProvider/useAuth";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

    return (
      <div>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="unitPrice" stroke={colors.purpleAccent[600]} />
              <Line type="monotone" dataKey="amount" stroke={colors.greenAccent[500]} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>Carregando...</p>
        )}
      </div>
    );
}

export default LineChartApp;
