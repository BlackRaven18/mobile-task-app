class TaskList {
    id: number;
    title: string;
    tasks: Task[];

    constructor(id: number, title: string, tasks: Task[]) {
        this.id = id;
        this.title = title;
        this.tasks = tasks;
    }
}