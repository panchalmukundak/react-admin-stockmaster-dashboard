import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { ColorModeContext, useMode, } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AuthProvider } from './hooks/Context/AuthProvider/AuthContext';
import ProtectedPage from './components/ProtectedPage/ProtectedPage';

function AppRoutes() {

  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <AuthProvider>
        <Router>
          <ThemeProvider theme={theme}> 
            <CssBaseline />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
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
              {/*<Route path="*" element={<PageNotFound />} />*/}
            </Routes>
          </ThemeProvider>
        </Router>
      </AuthProvider>
    </ColorModeContext.Provider>
  );
}

export default AppRoutes;
