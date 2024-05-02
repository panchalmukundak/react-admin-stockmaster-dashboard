import './App.css';
import AppRoutes from './routes.jsx';
import { AuthProvider } from './hooks/Context/AuthProvider/AuthContext';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
