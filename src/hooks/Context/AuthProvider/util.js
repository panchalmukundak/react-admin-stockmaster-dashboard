import api from "../../../services/api";
// Auth Context
// 10
export function setUserLocalStorage (user) {
    localStorage.setItem("u", JSON.stringify(user));
}

//11
export function getUserLocalStorage () {
    const json = localStorage.getItem("u");
    
    if (!json) {
        return null;
    }

    const user = JSON.parse(json);

    return user ?? null;
}



//7
export async function loginRequest(userName, password) {
    try {
        const response = await api.post("/api/v1/auth/login", { userName, password });
        console.log(response);
        return response;
    } catch (error) {
        console.error('Login failed:', error);
    }
}

//7.1
export async function registerRequest (name, userName, email, password, confirmPassword) {
    try{
        const response = await api.post("/api/v1/auth/register", {name, userName, email, password, confirmPassword});
        return response.data;
    }
    catch (error){
        console.error('Registration failed:', error);
    }
}