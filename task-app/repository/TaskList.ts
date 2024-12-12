import TaskList from "@/dto/TaskList";
import { SQLiteDatabase } from "expo-sqlite";

export default class TaskListRepository {
    private db: SQLiteDatabase
    public constructor(db: SQLiteDatabase) {
        this.db = db
    }

    async findAll(username: string): Promise<TaskList[]> {

        let taskLists: TaskList[] = []

        const statement = await this.db.prepareAsync(
            'SELECT * FROM task_list'
        )

        try {
            const result = await statement.executeAsync<{ id: number, title: string }>()

            const allRows = await result.getAllAsync();
            for (const row of allRows) {
                const taskList = new TaskList(row.id, row.title, []);
                taskLists.push(taskList);
            }

        } finally {
            await statement.finalizeAsync();
        }

        return taskLists;
    }

    async insert(taskListTitle: string) {

        const statement = await this.db.prepareAsync(
            'INSERT OR IGNORE INTO task_list (title) VALUES ($title) '
        )

        try {
            const result = await statement.executeAsync({ $title: taskListTitle })

            if (result.changes == 0) {
                console.log("Task list already exists");
            }

            console.log("Inserted task list", result.lastInsertRowId, result.changes);

        } finally {
            await statement.finalizeAsync();
        }
    }

    async remove(taskListTitle: string) {

        const statement = await this.db.prepareAsync(
            'DELETE FROM task_list WHERE title = $title'
        )

        try {
            const result = await statement.executeAsync({ $title: taskListTitle })

            console.log("Removed task list", result.lastInsertRowId, result.changes);

        } finally {
            await statement.finalizeAsync();
        }
    }

    async update(oldTitle: string, newTitle: string) {

        const statement = await this.db.prepareAsync(
            'UPDATE task_list SET title = $newTitle WHERE title = $oldTitle'
        )

        try {
            const result = await statement.executeAsync({ $oldTitle: oldTitle, $newTitle: newTitle })

            console.log("Updated task list", result.lastInsertRowId, result.changes);

        } finally {
            await statement.finalizeAsync();
        }
    }

}