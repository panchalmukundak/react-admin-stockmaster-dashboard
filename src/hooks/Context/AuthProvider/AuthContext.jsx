// 1
import {createContext, useEffect, useState} from "react"
//js
import { loginRequest, registerRequest, getUserLocalStorage, setUserLocalStorage } from "./util";
//prop
import PropTypes from "prop-types";
// validarToken
import { jwtDecode } from 'jwt-decode';
// 2
export const AuthContext = createContext({});

// 3
export const AuthProvider = ({ children }) => {
    
    //4
    const [user, setUser] = useState(null);

    //14
    useEffect(() => {
        const user = getUserLocalStorage();

        if(user) {
            setUser(user);
        }

    }, []);


    async function authenticate(userName, password) {
        try {
            const response = await loginRequest(userName, password);
            console.log(response);
            const payload = { token: response.data.token, id: response.data.id, userName };

            setUser(payload);
            setUserLocalStorage(payload);

        } catch (error) {
            console.error('Auth Context - Login failed:', error);
            throw error;
        }
    }

    async function register(name, userName, email, password, confirmPassword) {
        try {
            const response = await registerRequest(name, userName, email, password, confirmPassword);
            console.log(response);
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }

    function logout () {
        setUser(null);
        //13
        setUserLocalStorage(null);
        localStorage.clear();
    }
 
    async function isValidToken(token) {
        try {
            const decoded = await jwtDecode(token);
            const newUserName = decoded.sub;
            const expirationTime = decoded.exp;
            const expirationDate = new Date(expirationTime * 1000);
            const currentDate = new Date();
            console.log(expirationDate >= currentDate);// 03/05 > 05/05 // false

            if (expirationDate >= currentDate) {
                console.log("O token ainda é válido.");
                const user = getUserLocalStorage();
                user.userName = newUserName;

                setUserLocalStorage(user);
                return true;
            } else {
                console.log("O token expirou.Faca login novamente.");
                logout();
               return false;
            }
        } catch (error) {
            console.log("Erro ao decodificar o token:", error);
            return false;
        }
    }

    return (
        <AuthContext.Provider value={{...user, authenticate, register, isValidToken, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};