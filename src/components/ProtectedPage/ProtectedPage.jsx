import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/Context/AuthProvider/useAuth';
import PropTypes from 'prop-types';
import { getUserLocalStorage } from '../../hooks/Context/AuthProvider/util';

const ProtectedPage = ({ children }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = getUserLocalStorage(); // Verificar se há um usuário salvo no localStorage

    if (!auth.token && !auth.userName && !user) { // Verificar se não há token nem usuário autenticado
      navigate("/");
    }
    else if (auth.token) {
      if (!auth.isValidToken(auth.token)) {
        auth.logout();
        navigate("/"); // Redirecionar se o token expirou
      }
    }

    // Retornar uma função de limpeza vazia
    return () => {};
  }, [auth, navigate]);

  // Renderizar children apenas se o usuário estiver autenticado
  return <>{auth.token ? children : null}</>;
};

// Definir PropTypes para o componente
ProtectedPage.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedPage;