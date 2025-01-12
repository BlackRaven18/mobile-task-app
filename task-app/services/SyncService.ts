import { SQLiteDatabase } from "expo-sqlite";
import HttpClient from "@/api/HttpClient";
import TaskRepository from "@/repository/Task";
import TaskListRepository from "@/repository/TaskList";

async function performSync(db: SQLiteDatabase, lastSync: string, username: string) {
    const taskListRepository = new TaskListRepository(db);
    const taskRepository = new TaskRepository(db);

    console.log("Performing sync...");
    console.log("Last sync: ", lastSync);

    await syncServerClient(taskListRepository, taskRepository, lastSync, username);
    await syncClientServer(taskListRepository, taskRepository, lastSync, username);
    await cleanAfterSync(taskListRepository, taskRepository);

    console.log("Sync complete.");
}

async function syncServerClient(
    taskListRepository: TaskListRepository,
    taskRepository: TaskRepository,
    lastSync: string,
    username: string
) {

    const serverChanges = await new HttpClient().getServerChanges(lastSync, username);

    if (serverChanges.taskLists.length <= 0 && serverChanges.tasks.length <= 0) {
        console.log("No changes detected. Skipping sync.");
        return;
    }

    console.log("serverChanges: ", serverChanges);

    for (const taskList of serverChanges.taskLists) {
        if (taskList.deleted) {
            await taskListRepository.remove(taskList.title);
        } else {
            await taskListRepository.insert(taskList.title, taskList.id);
        }
    }

    for (const task of serverChanges.tasks) {
        if (task.deleted) {
            await taskRepository.remove(task.id);
        } else {
            await taskRepository.insert(task.description, task.task_list_id, task.id);
        }
    }
}

async function syncClientServer(
    taskListRepository: TaskListRepository,
    taskRepository: TaskRepository,
    lastSync: string,
    username: string
) {
    const httpClient = new HttpClient();

    const updated_task_lists = await taskListRepository.findByUpdatedAtAfter(lastSync)
    const updated_tasks = await taskRepository.findByUpdatedAtAfter(lastSync)

    console.log("Server - Client sync: ", updated_task_lists, updated_tasks)

    const response = await httpClient.postClientChanges(username, updated_task_lists, updated_tasks);
    console.log("Client - Server sync: ", response)
}

export { performSync };

async function cleanAfterSync(taskListRepository: TaskListRepository, taskRepository: TaskRepository) {
    await taskRepository.cleanUpDeleted();
    await taskListRepository.cleanUpDeleted();
}