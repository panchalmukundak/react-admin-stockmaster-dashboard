import api from "../services/api";
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

// SignUp

export async function validateUserName(value) {
    try {
        const response = await api.get(`/api/v1/users/username/${value}`);
        return response.data.username;
    } catch (error) {
        console.log("Erro ao verificar o nome de usuário!");
        return false;
    }
}

export async function validateEmail(value) {
    try {
        const response = await api.get(`/api/v1/users/email/${value}`);
        return response.data.email;
    } catch (error) {
        console.log("Erro ao verificar o email!");
        return false;
    }
}

// Inventory

// obter inventarios do usuario
export async function getAllInventories(id, headers) {
    try {
        const response = await api.get(`/api/v1/inventories/allInventories/${id}`, headers);
        return response;
    } catch (error) {
        console.log("Erro ao listar os estoques do usuario.");
        return false;
    }
}

// criar inventarios

export async function addInventory(userId, data, headers) {
    try {
        const response = await api.post(`/api/v1/inventories/created/${userId}`, data, headers);
        return response;

    } catch (error) {
        console.log("Erro ao criar os estoques do usuario.");
        return false;
    }
}