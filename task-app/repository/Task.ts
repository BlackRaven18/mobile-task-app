import Task from "@/dto/Task";
import { SQLiteDatabase } from "expo-sqlite";

export default class TaskRepository {

    private db: SQLiteDatabase;

    public constructor(db: SQLiteDatabase) {
        this.db = db
    }

    async findAllByTaskListId(id: string): Promise<Task[]> {

        let tasks: Task[] = []

        const statement = await this.db.prepareAsync(
            'SELECT * FROM task WHERE task_list_id = $id'
        )

        try {
            const result = await statement.executeAsync<{ id: number, description: string }>({
                $id: id
            })

            const allRows = await result.getAllAsync();
            for (const row of allRows) {
                const task = new Task(row.id, row.description);
                tasks.push(task);
                console.log(row);
            }

        } finally {
            await statement.finalizeAsync();
        }

        return tasks;
    }

    async insert(description: string, taskListId: number) {

        const statement = await this.db.prepareAsync(
            'INSERT OR IGNORE INTO task (description, task_list_id) VALUES ($description, $taskListId) '
        )

        try {
            await statement.executeAsync({
                $description: description,
                $taskListId: taskListId
            })
        } finally {
            await statement.finalizeAsync();
        }
    }

    async remove(id: number) {

        const statement = await this.db.prepareAsync(
            'DELETE FROM task WHERE id = $id'
        )

        try {
            await statement.executeAsync({
                $id: id
            })
        } finally {
            await statement.finalizeAsync();
        }
    }

    async update(id: number, description: string) {

        const statement = await this.db.prepareAsync(
            'UPDATE task SET description = $description WHERE id = $id'
        )

        try {
            await statement.executeAsync({
                $id: id,
                $description: description
            })
        } finally {
            await statement.finalizeAsync();
        }
    }
}