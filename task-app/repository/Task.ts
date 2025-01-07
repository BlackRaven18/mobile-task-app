import Task from "@/dto/Task";
import { getCurrentDateTime } from "@/utils/date";
import { SQLiteDatabase } from "expo-sqlite";
import uuid from 'react-native-uuid';

export default class TaskRepository {

    private db: SQLiteDatabase;

    public constructor(db: SQLiteDatabase) {
        this.db = db
    }

    async findByTaskListId(id: string): Promise<Task[]> {

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
                id: string,
                task_list_id: string,
                description: string,
                updated_at: Date,
                deleted: boolean
            }
            >({
                $id: id
            })

            const allRows = await result.getAllAsync();
            for (const row of allRows) {

                const task = new Task(row.id, row.task_list_id, row.description, row.updated_at, row.deleted);
                tasks.push(task);
            }

        } finally {
            await statement.finalizeAsync();
        }

        return tasks;
    }

    async removeByTaskListTitle(taskListTitle: string) {

        const statement = await this.db.prepareAsync(
            `
            UPDATE task 
            SET deleted = 1, 
                updated_at = $currentTime 
            WHERE task_list_id IN (
                SELECT id 
                FROM task_list 
                WHERE title = $title
            );
            `
        )

        try {
            await statement.executeAsync({
                $currentTime: getCurrentDateTime(),
                $title: taskListTitle
            })
        } finally {
            await statement.finalizeAsync();
        }
    }

    async findByUpdatedAtAfter(lastSync: string): Promise<Task[]> {
        let tasks: Task[] = []

        const statement = await this.db.prepareAsync(
            `
            SELECT task.id, task.description, task.task_list_id, task.updated_at, task.deleted
            FROM task 
            WHERE task.updated_at > $lastSync
            `
        )

        try {
            const result = await statement.executeAsync<{
                id: string,
                task_list_id: string,
                description: string,
                updated_at: Date,
                deleted: boolean
            }
            >({
                $lastSync: lastSync
            })

            const allRows = await result.getAllAsync();
            for (const row of allRows) {

                const task = new Task(
                    row.id,
                    row.task_list_id,
                    row.description,
                    row.updated_at,
                    row.deleted,
                );
                tasks.push(task);
            }

        } finally {
            await statement.finalizeAsync();
        }

        return tasks;
    }

    async insert(description: string, taskListId: string, id?: string): Promise<void> {

        const statement = await this.db.prepareAsync(
            `
            INSERT INTO task (id, description, task_list_id, updated_at) 
            VALUES ($id, $description, $taskListId, $currentTime)
            ON CONFLICT (id) DO UPDATE 
                SET description = EXCLUDED.description,
                    updated_at = EXCLUDED.updated_at,
                    deleted = EXCLUDED.deleted
                WHERE excluded.id = task.id
            `
        )

        try {
            await statement.executeAsync({
                $id: id ?? uuid.v4(),
                $description: description,
                $taskListId: taskListId,
                $currentTime: getCurrentDateTime()
            })


        } finally {
            await statement.finalizeAsync();
        }
    }

    async remove(id: string) {

        const statement = await this.db.prepareAsync(
            `
            UPDATE task 
            SET deleted = 1,
                updated_at = $currentTime
            WHERE id = $id
            `
        )

        try {
            await statement.executeAsync({
                $currentTime: getCurrentDateTime(),
                $id: id
            })
        } finally {
            await statement.finalizeAsync();
        }
    }

    async update(id: string, description: string) {

        const statement = await this.db.prepareAsync(
            `
            UPDATE task 
            SET description = $description,
                updated_at = $currentTime
            WHERE id = $id`
        )

        try {
            await statement.executeAsync({
                $id: id,
                $currentTime: getCurrentDateTime(),
                $description: description
            })
        } finally {
            await statement.finalizeAsync();
        }
    }

    async cleanUpDeleted() {

        const statement = await this.db.prepareAsync(
            `DELETE FROM task WHERE deleted = 1`
        )

        try {
            await statement.executeAsync()

        } finally {
            await statement.finalizeAsync();
        }
    }
}