const express = require('express')
const sqlite3 = require('sqlite3').verbose();
var cors = require('cors')

const db = new sqlite3.Database('./task.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the database.');
});


const app = express()
app.use(express.json())
app.use(cors())
const port = 3000

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.get('/tasks', (req, res) => {

	let taskListId = req.query.taskListId;

	const stmt = db.prepare("SELECT * FROM task WHERE task_list_id = ?");
	stmt.all(taskListId, (err, rows) => {
		if (err) {
			console.error(err.message);
		}

		if(rows.length == 0) {
			res.status(404).send("No tasks found")
			return
		}
		res.status(200).send(rows)
	})
})

app.post('/tasks', (req, res) => {

	let description = req.body.description
	let taskListId = req.body.taskListId;

	const stmt = db.prepare("INSERT INTO task (description, task_list_id) VALUES (?, ?)");
	stmt.run(description, taskListId, (err) => {
		if (err) {
			console.error(err.message);
		}
		res.status(201).send("Task added")
	})
})

app.put('/tasks/:id', (req, res) => {
	const stmt = db.prepare("UPDATE task SET description = ? WHERE id = ?");
	result = stmt.run(req.body.description, req.params.id, (err) => {
		if (err) {
			console.error(err.message);
		}

		console.log(result.changes)

		if(result.changes == 0) {
			res.status(404).send("Task not found")
			return
		}

		res.status(200).send("Task updated")
	})
})

app.delete('/tasks/:id', (req, res) => {
	const stmt = db.prepare("DELETE FROM task WHERE id = ?");
	result = stmt.run(req.params.id, (err) => {
		if (err) {
			console.error(err.message);
		}

		if(result.changes == 0) {
			res.status(404).send("Task not found")
			return
		}

		res.status(200).send("Task deleted")
	})
})


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})