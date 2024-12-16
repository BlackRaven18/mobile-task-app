const express = require('express');
const router = express.Router();
const db = require('../database');
const { getCurrentDateTime } = require('../utils/date');

router.get('/', async (req, res) => {
    const { lastSync, username } = req.query;


    if (!lastSync) {
        res.status(400).send("Missing lastSync parameter");
        return;
    }

    if (!username) {
        res.status(400).send("Missing username parameter");
        return;
    }

    let changedTaskList = [];
    let changedTasks = [];

    const getChangedTaskListsQuery = `
        SELECT * FROM task_list 
        WHERE user_id = (SELECT id FROM user WHERE username = ?) AND updated_at > ? OR deleted = 1
    `;

    const getChangedTasksQuery = `
        SELECT task.id, task.description, task.task_list_id, task.updated_at, task.deleted 
        FROM task
        WHERE task.updated_at > ? 
            AND task.task_list_id 
            IN (SELECT id FROM task_list WHERE user_id = (SELECT id FROM user WHERE username = ?))
    `;

    try {
        changedTaskList = await fetchAll(db, getChangedTaskListsQuery, [username, lastSync]);
        changedTasks = await fetchAll(db, getChangedTasksQuery, [lastSync, username]);
    } catch (err) {
        console.log(err);
    }

    res.status(200).send({ taskLists: changedTaskList, tasks: changedTasks });
})

router.post('/', async (req, res) => {
    const { clientChanges, username } = req.body;

    if (!clientChanges) {
        res.status(400).send("Missing clientChanges parameter");
        return;
    }

    if (!clientChanges.taskLists) {
        res.status(400).send("Missing taskLists parameter in clientChanges");
        return;
    }

    if (!clientChanges.tasks) {
        res.status(400).send("Missing tasks parameter in clientChanges");
        return;
    }

    if (!clientChanges.taskLists.length && !clientChanges.tasks.length) {
        res.status(200).send("No changes detected");
        return;
    }

    if (!username) {
        res.status(400).send("Missing username parameter");
        return;
    }

    console.log(clientChanges);
    console.log("time:", getCurrentDateTime());

    try {

        for (const taskList of clientChanges.taskLists) {
            if (taskList.deleted) {
                await db.run(`
                    DELETE FROM task_list 
                    WHERE task_list.id = ? 
                    AND task_list.user_id = (SELECT id FROM user WHERE username = ?)`,
                    [taskList.id, username]
                );
            } else {
                await db.run(`
                    INSERT INTO task_list (id, title, user_id) 
                    VALUES (?, ?, (SELECT id FROM user WHERE username = ?))
                    ON CONFLICT (id) DO UPDATE 
                        SET title = EXCLUDED.title,
                            updated_at = EXCLUDED.updated_at,
                            deleted = EXCLUDED.deleted
                        WHERE excluded.id = task_list.id
                     `,
                    [taskList.id, taskList.title, username]
                );
            }
        }

        for (const task of clientChanges.tasks) {
            if (task.deleted) {
                await db.run(`
                    DELETE FROM task 
                    WHERE task.id = ?
                    `,
                    [task.id]
                );
            } else {
                await db.run(`
                    INSERT INTO task (id, description, task_list_id) 
                    VALUES (?, ?, ?)
                    ON CONFLICT (id) DO UPDATE 
                        SET description = EXCLUDED.description,
                        updated_at = EXCLUDED.updated_at
                        WHERE excluded.id = task.id
                    `,
                    [task.id, task.description, task.task_list_id]
                );
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Sync failed");
        return;
    }

    res.status(200).send("Sync successful");

})

const fetchAll = async (db, sql, params) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

module.exports = router;