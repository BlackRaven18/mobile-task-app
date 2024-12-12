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
            `
            SELECT * 
            FROM task 
            WHERE task_list_id = $id AND deleted = 0
            `
        )

        try {
            const result = await statement.executeAsync<{
                id: number,
                description: string,
                updated_at: Date,
                deleted: boolean
            }
            >({
                $id: id
            })

            const allRows = await result.getAllAsync();
            for (const row of allRows) {

                const task = new Task(row.id, row.description, row.updated_at, row.deleted);
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
            `
            INSERT OR IGNORE INTO task (description, task_list_id, updated_at, deleted) 
            VALUES ($description, $taskListId, CURRENT_TIMESTAMP, $deleted)
            `
        )

        try {
            await statement.executeAsync({
                $description: description,
                $taskListId: taskListId,
                $deleted: false
            })
        } finally {
            await statement.finalizeAsync();
        }
    }

    async remove(id: number) {

        const statement = await this.db.prepareAsync(
            `
            UPDATE task 
            SET deleted = true 
            WHERE id = $id
            `
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

        console.log(new Date().toDateString());

        const statement = await this.db.prepareAsync(
            `
            UPDATE task 
            SET description = $description,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $id`
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