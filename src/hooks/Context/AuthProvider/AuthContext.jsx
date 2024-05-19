import {createContext, useEffect, useState} from "react"
import { loginRequest, registerRequest, getUserLocalStorage, setUserLocalStorage } from "./util";
import PropTypes from "prop-types";

import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);

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
            return response;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }

    function logout () {
        setUser(null);
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

            if (expirationDate >= currentDate) {
                const user = getUserLocalStorage();
                user.userName = newUserName;

                setUserLocalStorage(user);
                return true;
            } else {
                logout();
               return false;
            }
        } catch (error) {
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