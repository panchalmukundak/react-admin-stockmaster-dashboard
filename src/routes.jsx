import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import Item from './pages/Item';
import Transaction from './pages/Transaction';
import TransactionHistory from './pages/TransactionHistory';
import ProtectedPage from './components/ProtectedPage/ProtectedPage';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode, } from "./theme";
//import { AuthProvider } from './hooks/Context/AuthProvider/AuthContext';
import { InventoryProvider } from './hooks/Context/InventoryProvider/InventoryContext';
import NotFoundPage from './pages/NotFoundPage';

function AppRoutes() {

  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <InventoryProvider>
        <Router>
          <ThemeProvider theme={theme}> 
            <CssBaseline />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route
                path="/home"
                element={
                  <ProtectedPage>
                    <Home />
                  </ProtectedPage>
                }
              />
              <Route
                path="/home/dashboard"
                element={
                  <ProtectedPage>
                      <Dashboard />
                  </ProtectedPage>
                }
              />
              <Route
                path="/home/edit-profile"
                element={
                  <ProtectedPage>
                      <EditProfile />
                  </ProtectedPage>
                }
              />
              <Route
                path="/home/item"
                element={
                  <ProtectedPage>
                      <Item />
                  </ProtectedPage>
                }
              />
              <Route
                path="/home/transaction"
                element={
                  <ProtectedPage>
                    <Transaction />
                  </ProtectedPage>
                }
              />
              <Route
                path="/home/history"
                element={
                  <ProtectedPage>
                    <TransactionHistory />
                  </ProtectedPage>
                }
              />
            </Routes>
          </ThemeProvider>
        </Router>
      </InventoryProvider>
    </ColorModeContext.Provider>
  );
}

export default AppRoutes;
