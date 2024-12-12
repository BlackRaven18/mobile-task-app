
export default class Task {
    id: number;
    description: string;
    updatedAt: Date;
    deleted: boolean;

    constructor(id: number, description: string, updatedAt: Date, deleted: boolean) {
        this.id = id;
        this.description = description;
        this.updatedAt = updatedAt;
        this.deleted = deleted;
    }
}