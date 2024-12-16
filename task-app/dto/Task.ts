
export default class Task {
    id: string;
    task_list_id: string;
    description: string;
    updated_at: Date;
    deleted: boolean;

    constructor(id: string, task_list_id: string, description: string, updated_at: Date, deleted: boolean) {
        this.id = id;
        this.task_list_id = task_list_id;
        this.description = description;
        this.updated_at = updated_at;
        this.deleted = deleted;
    }
}