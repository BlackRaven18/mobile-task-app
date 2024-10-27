import axios from "axios";

export default class HttpClient {

    readonly SERVER_URL = "http://192.168.4.164:3000";

    async getTasks(): Promise<Task[]> {
        return axios.get(`${this.SERVER_URL}/tasks`, { params: { taskListId: 1 } })
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                console.error(error);
                return [];
            });
    }

    async addTask(description: string): Promise<String> {
        return axios.post(`${this.SERVER_URL}/tasks`, { description, taskListId: 1 })
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
        return axios.delete(`${this.SERVER_URL}/tasks/${id}`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error(error);
                return "";
            });
    }

    async updateTask(id: number, description: string): Promise<String> {
        return axios.put(`${this.SERVER_URL}/tasks/${id}`, { description })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error(error);
                return "";
            });
    }
}