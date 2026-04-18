import axios from "axios";

interface User {
  id: string;
  email: string;
  username?: string;
}

interface AuthResponse {
  user: User;
  message?: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});

export async function register({ username, email, password }: RegisterData): Promise<AuthResponse> {
    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        });

        return response.data;
    } catch (err) {
        console.error('Register API error:', err);
        throw err;
    }
}

export async function login({ email, password }: LoginData): Promise<AuthResponse> {
    try {
        const response = await api.post("/api/auth/login", {
            email, password
        });

        return response.data;
    } catch (err) {
        console.error('Login API error:', err);
        throw err;
    }
}

export async function logout(): Promise<AuthResponse> {
    try {
        const response = await api.get("/api/auth/logout");
        return response.data;
    } catch (err) {
        console.error('Logout API error:', err);
        throw err;
    }
}

export async function getMe(): Promise<AuthResponse> {
    try {
        const response = await api.get("/api/auth/get-me");
        return response.data;
    } catch (err) {
        console.error('Get me API error:', err);
        throw err;
    }
}
