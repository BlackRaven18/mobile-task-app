import Task from "@/dto/Task";
import { getCurrentDateTime } from "@/utils/date";
import { SQLiteDatabase } from "expo-sqlite";
import uuid from 'react-native-uuid';

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
                id: string,
                task_list_id: number,
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

    async findByUpdatedAtAfter(lastSync: string): Promise<Task[]> {
        let tasks: Task[] = []

        const statement = await this.db.prepareAsync(
            `
            SELECT task.id, task.description, task.task_list_id, task.updated_at, task.deleted, task_list.title AS task_list_title 
            FROM task, task_list 
            WHERE task.task_list_id = task_list.id 
            AND task.updated_at > $lastSync
            `
        )

        try {
            const result = await statement.executeAsync<{
                id: string,
                task_list_id: number,
                task_list_title: string,
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
                    row.task_list_title
                );
                tasks.push(task);
            }

        } finally {
            await statement.finalizeAsync();
        }

        return tasks;
    }

    async insert(description: string, taskListTitle: string): Promise<void> {

        const statement = await this.db.prepareAsync(
            `
            INSERT OR IGNORE INTO task (id, description, task_list_id, updated_at) 
            VALUES ($id, $description, (SELECT id FROM task_list WHERE title = $taskListTitle), $currentTime)
            `
        )

        try {
            await statement.executeAsync({
                $id: uuid.v4(),
                $description: description,
                $taskListTitle: taskListTitle,
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
}