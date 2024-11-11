const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const db = require('../database');

// GET all username task lists
router.get('/',verifyToken, (req, res) => {

    const { username } = req.query

    console.log(username)

    const stmt = db.prepare("SELECT * FROM task_list WHERE user_id = (SELECT id FROM user WHERE username = ?)");
    stmt.all(username, (err, rows) => {
        if (err) {
            console.error(err.message);
        }

        if (rows.length == 0) {
            res.status(404).send("No tasks found")
            return
        }
        console.log(rows)
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



module.exports = router;