const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const db = require('../database');

router.get('/',verifyToken, (req, res) => {

    const { taskListId } = req.query

    const stmt = db.prepare("SELECT * FROM task WHERE task_list_id = ?");
    stmt.all(taskListId, (err, rows) => {
        if (err) {
            console.error(err.message);
        }

        if (rows.length == 0) {
            res.status(404).send("No tasks found")
            return
        }
        res.status(200).send(rows)
    })
})

router.post('/', verifyToken, (req, res) => {

    const { description, taskListId } = req.body

    const stmt = db.prepare("INSERT INTO task (description, task_list_id) VALUES (?, ?)");
    stmt.run(description, taskListId, (err) => {
        if (err) {
            console.error(err.message);
        }
        res.status(201).send("Task added")
    })
})

router.put('/:id', verifyToken, (req, res) => {
    const stmt = db.prepare("UPDATE task SET description = ? WHERE id = ?");
    result = stmt.run(req.body.description, req.params.id, (err) => {
        if (err) {
            console.error(err.message);
        }

        console.log(result.changes)

        if (result.changes == 0) {
            res.status(404).send("Task not found")
            return
        }

        res.status(200).send("Task updated")
    })
})

router.delete('/:id', verifyToken, (req, res) => {
    const stmt = db.prepare("DELETE FROM task WHERE id = ?");
    result = stmt.run(req.params.id, (err) => {
        if (err) {
            console.error(err.message);
        }

        if (result.changes == 0) {
            res.status(404).send("Task not found")
            return
        }

        res.status(200).send("Task deleted")
    })
})

module.exports = router;