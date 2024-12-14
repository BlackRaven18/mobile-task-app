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

const fetchAll = async (db, sql, params) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

module.exports = router;