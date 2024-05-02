// 1
import {createContext, useEffect, useState} from 'react'
import { loginRequest, registerRequest, getUserLocalStorage, setUserLocalStorage } from '../../../util/util';
import PropTypes from 'prop-types'; // Importe PropTypes
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


    //6
    async function authenticate(userName, password) {
        try {
            const response = await loginRequest(userName, password);
            console.log(response);
            const payload = { token: response.data.token, id: response.data.id, userName };
    
            setUser(payload);
            setUserLocalStorage(payload);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    //18
    async function register(name, userName, email, password, confirmPassword) {
        try {
            const response = await registerRequest(name, userName, email, password, confirmPassword);
            console.log(response);
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }

    // 8
    function logout () {
        //localStorage.removeItem("u");
        setUser(null);
        //13
        setUserLocalStorage(null);
        localStorage.clear();
    }

    //5
    return (
        <AuthContext.Provider value={{...user, authenticate, register, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};