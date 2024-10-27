import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
    baseURL: "http://192.168.4.164:3000",
})

// Interceptor żądań
api.interceptors.request.use(
    async (config) => {
        // Pobierz token JWT z AsyncStorage
        const token = await SecureStore.getItemAsync('token');
        if (token) {
            // Dodaj nagłówek Authorization, jeśli token istnieje
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default class HttpClient {

    readonly SERVER_URL = "http://192.168.4.164:3000";

    async signIn(username: string, password: string): Promise<string> {
        return api.post(`/auth/login`, { username, password })
            .then((response) => {
                return response.data.token
            })
            .catch((error) => {
                console.error(error);
                return false;
            });
    }

    async getTasks(): Promise<Task[]> {
        return api.get(`/tasks`, { params: { taskListId: 1 } })
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                console.error(error);
                return [];
            });
    }

    async addTask(description: string): Promise<String> {
        return api.post(`/tasks`, { description, taskListId: 1 })
            .then((response) => {
                console.log(response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(error);
                return "";
            });
    }

    async deleteTask(id: number): Promise<String> {
        return api.delete(`/tasks/${id}`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error(error);
                return "";
            });
    }

    async updateTask(id: number, description: string): Promise<String> {
        return api.put(`/tasks/${id}`, { description })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error(error);
                return "";
            });
    }
}