import TaskList from "@/dto/TaskList";
import { SQLiteDatabase } from "expo-sqlite";
import { getCurrentDateTime } from "@/utils/date";
import uuid from 'react-native-uuid';

export default class TaskListRepository {
    private db: SQLiteDatabase
    public constructor(db: SQLiteDatabase) {
        this.db = db
    }

    async findAll(): Promise<TaskList[]> {

        let taskLists: TaskList[] = []

        const statement = await this.db.prepareAsync(
            `
            SELECT * 
            FROM task_list
            WHERE deleted = 0
            `
        )

        try {
            const result = await statement.executeAsync<{
                id: string,
                title: string,
                updated_at: Date,
                deleted: boolean
            }>()

            const allRows = await result.getAllAsync();
            for (const row of allRows) {
                const taskList = new TaskList(row.id, row.title, [], row.updated_at, row.deleted);
                taskLists.push(taskList);
            }

        } finally {
            await statement.finalizeAsync();
        }

        return taskLists;
    }

    async findByUpdatedAtAfter(lastSync: string): Promise<TaskList[]> {
        let taskLists: TaskList[] = []

        const statement = await this.db.prepareAsync(
            `
            SELECT * 
            FROM task_list
            WHERE updated_at > $lastSync
            `
        )

        try {
            const result = await statement.executeAsync<{
                id: string,
                title: string,
                updated_at: Date,
                deleted: boolean
            }>({
                $lastSync: lastSync
            })

            const allRows = await result.getAllAsync();
            for (const row of allRows) {
                const taskList = new TaskList(row.id, row.title, [], row.updated_at, row.deleted);
                taskLists.push(taskList);
            }

        } finally {
            await statement.finalizeAsync();
        }

        return taskLists;
    }

    async insert(taskListTitle: string) {

        const statement = await this.db.prepareAsync(
            `INSERT OR IGNORE INTO task_list (id, title, updated_at) 
            VALUES ($id, $title, $currentTime)`
        )

        try {
            const result = await statement.executeAsync({
                $id: uuid.v4(), 
                $title: taskListTitle, 
                $currentTime: getCurrentDateTime() })

            if (result.changes == 0) {
                console.log("Task list already exists");
            }

        } finally {
            await statement.finalizeAsync();
        }
    }

    async remove(taskListTitle: string) {

        const statement = await this.db.prepareAsync(
            `
            UPDATE task_list 
            SET deleted = 1, 
                updated_at = $currentTime 
            WHERE title = $title
            `
        )

        try {
            const result = await statement.executeAsync({ 
                $currentTime: getCurrentDateTime(),
                $title: taskListTitle,
             })

        } finally {
            await statement.finalizeAsync();
        }
    }


    async update(id: string, newTitle: string) {

        const statement = await this.db.prepareAsync(
            `UPDATE task_list 
            SET title = $newTitle,
                updated_at = $currentTime 
            WHERE id = $id`
        )

        try {
            const result = await statement.executeAsync({ 
                $newTitle: newTitle,
                $currentTime: getCurrentDateTime(), 
                $id: id
            })

        } finally {
            await statement.finalizeAsync();
        }
    }

}