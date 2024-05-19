import { useCallback, useEffect, useState } from "react"
import { getAllItems } from "../../util/util";
import { getUserLocalStorage } from "../../hooks/Context/AuthProvider/util";
import { getInventoryLocalStorage } from "../../hooks/Context/InventoryProvider/util";
import { useAuth } from "../../hooks/Context/AuthProvider/useAuth";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
//import { ResponsiveBar } from "@nivo/bar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const BarChartApp = () => {
    const [data, setData] = useState();
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

    <div>
      {data ? (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="unitPrice" fill={colors.purpleAccent[600]} />
          <Bar dataKey="amount" fill={colors.greenAccent[500]} />
        </BarChart>
      </ResponsiveContainer>
    ) : (
      <p>Carregando...</p>
    )}
    </div>

  );
}

export default BarChartApp