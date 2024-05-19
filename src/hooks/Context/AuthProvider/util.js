import api from "../../../services/api";

export function setUserLocalStorage (user) {
    localStorage.setItem("u", JSON.stringify(user));
}

export function getUserLocalStorage () {
    const json = localStorage.getItem("u");
    
    if (!json) {
        return null;
    }

    const user = JSON.parse(json);

    return user ?? null;
}


export async function loginRequest(userName, password) {
    try {
        const response = await api.post("/api/v1/auth/login", { userName, password });
        return response;
    } catch (error) {
        console.error('Login failed:', error);
    }
}

export async function registerRequest (name, userName, email, password, confirmPassword) {
    try{
        const response = await api.post("/api/v1/auth/register", {name, userName, email, password, confirmPassword});
        return response;
    }
    catch (error){
        console.error('Registration failed:', error);
    }
}