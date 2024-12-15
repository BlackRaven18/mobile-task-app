const express = require('express');
const router = express.Router();
const db = require('../database');

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
        SELECT task.id, task.description, task.task_list_id, task.updated_at, task.deleted, task_list.title AS task_list_title FROM task, task_list 
        WHERE task.task_list_id = task_list.id AND task.task_list_id
        IN (
            SELECT id 
            FROM task_list 
            WHERE user_id = (SELECT id FROM user WHERE username = ?)
        ) AND task_list.updated_at > ? OR task_list.deleted = 1
    `;

    try {
        changedTaskList = await fetchAll(db, getChangedTaskListsQuery, [username, lastSync]);
        changedTasks = await fetchAll(db, getChangedTasksQuery, [username, lastSync]);
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

    try {

        for (const taskList of clientChanges.taskLists) {
            if (taskList.deleted) {
                await db.run(`
                    DELETE FROM task_list 
                    WHERE task_list.title = ? 
                    AND task_list.user_id = (SELECT id FROM user WHERE username = ?)`,
                    [taskList.title, username]
                );
            } else {
                await db.run(`
                    INSERT OR IGNORE INTO task_list (title, user_id) 
                    VALUES (?, (SELECT id FROM user WHERE username = ?))`,
                    [taskList.title, username]
                );
            }
        }

        for (const task of clientChanges.tasks) {
            if (task.deleted) {
                await db.run(`
                    DELETE FROM task 
                    WHERE task.id = ?`,
                    [task.id]
                );
            } else {
                await db.run(`
                    INSERT OR IGNORE INTO task (description, task_list_id) 
                    VALUES (?, (SELECT id FROM task_list WHERE title = ?))`,
                    [task.description, task.task_list_title]
                );
            }
        }
    } catch (err) {
        console.log(err);
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