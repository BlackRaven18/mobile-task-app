const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const db = require('../database');

// GET all username task lists
router.get('/',verifyToken, (req, res) => {

    const { username } = req.query

    const stmt = db.prepare("SELECT * FROM task_list WHERE user_id = (SELECT id FROM user WHERE username = ?)");
    stmt.all(username, (err, rows) => {
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

// ADD task list
router.post('/', verifyToken, (req, res) => {

    const { title, username } = req.body

    const stmt = db.prepare("INSERT INTO task_list (title, user_id) VALUES (?, (SELECT id FROM user WHERE username = ?))");
    stmt.run(title, username, (err) => {
        if (err) {
            console.error(err.message);
        }
        res.status(201).send("Task list created")
    })
})

//DELETE task list
router.delete('/:username/:id', verifyToken, (req, res) => {
    const { id, username } = req.params

    const delete_related_tasks_stmt = db.prepare("DELETE FROM task WHERE task_list_id = ?");
    const delete_task_list_stmt = db.prepare("DELETE FROM task_list WHERE user_id = (SELECT id FROM user WHERE username = ?) AND id = ?");

    console.log(id, username)

    // const stmt = db.prepare(
    //     "DELETE FROM task_list WHERE id = (SELECT id FROM user WHERE username = ?)"
    // );

    result = delete_related_tasks_stmt.run(id, (err) => {
        if (err) {
            console.error(err.message);
        }

        delete_task_list_stmt.run(username, id, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log("deleted")
        })

        res.status(200).send("Task list deleted")
    })
})



module.exports = router;