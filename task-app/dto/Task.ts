
export default class Task {
    id: number;
    task_list_id: number;
    task_list_title?: string;
    description: string;
    updated_at: Date;
    deleted: boolean;

    constructor(id: number, task_list_id: number, description: string, updated_at: Date, deleted: boolean, task_list_title?: string) {
        this.id = id;
        this.task_list_id = task_list_id;
        this.description = description;
        this.updated_at = updated_at;
        this.deleted = deleted;
        this.task_list_title = task_list_title;
    }
}