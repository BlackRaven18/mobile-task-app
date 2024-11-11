const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const db = require('../database');

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

module.exports = router;