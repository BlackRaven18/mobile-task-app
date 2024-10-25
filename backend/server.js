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
	const stmt = db.prepare("SELECT * FROM task");
	stmt.all((err, rows) => {
		if (err) {
			console.error(err.message);
		}
		res.status(200).send(rows)
	})
})

app.post('/tasks', (req, res) => {
	const stmt = db.prepare("INSERT INTO task (description) VALUES (?)");
	stmt.run(req.body.description, (err) => {
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