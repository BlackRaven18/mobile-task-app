import AuthService from "@/services/AuthService";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';


const api = axios.create({
    baseURL: "http://192.168.1.7:3000",
    //baseURL: "http://localhost:3000",
})


// Interceptor żądań
api.interceptors.request.use(
    async (config) => {

        const accessToken = await SecureStore.getItemAsync('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor for responses
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const httpClient = new HttpClient();
        const originalRequest = error.config;

        if (error.response.status === 403) {
            console.log("Refresh token expired. Logging out.");
            AuthService.signOut();
            return Promise.reject(error);
        }

        if (error.response.status === 401 && !originalRequest._retry) {
            console.log('Unauthorized request. Attempting to refresh token...');
            originalRequest._retry = true;
            try {
                const accessToken = await httpClient.refreshAccessToken();
                await SecureStore.setItemAsync('accessToken', accessToken);
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.log("Token refresh failed, logging out user.");
                console.log(refreshError)
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default class HttpClient {

    async refreshAccessToken(): Promise<string> {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        return api.post(`/auth/refresh`, { refreshToken: refreshToken })
            .then((response) => {
                return response.data.accessToken
            })
            .catch((error) => {
                throw error;
            });
    }

    async signIn(username: string, password: string): Promise<{ accessToken: string, refreshToken: string }> {
        return api.post(`/auth/login`, { username, password })
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return false;
            });
    }

    async signUp(username: string, password: string): Promise<string> {
        return api.post(`/auth/register`, { username, password })
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return false;
            });
    }

    async getAllTaskLists(username: string): Promise<TaskList[]> {
        return api.get(`/task-lists`, { params: { username } })
            .then((response) => {
                console.log("bebe: " + username)
                console.log(response.data)
                return response.data
            })
            .catch((error) => {
                console.log(error);
                return [];
            });
    }

    async getTasks(listId: number): Promise<Task[]> {
        return api.get(`/tasks`, { params: { taskListId: listId } })
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                console.log(error);
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
                console.log(error);
                return "";
            });
    }

    async deleteTask(id: number): Promise<String> {
        return api.delete(`/tasks/${id}`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log(error);
                return "";
            });
    }

    async updateTask(id: number, description: string): Promise<String> {
        return api.put(`/tasks/${id}`, { description })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log(error);
                return "";
            });
    }
}