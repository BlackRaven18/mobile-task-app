const express = require('express')
const cors = require('cors')
const errorHandler = require('./middleware/errorMiddleware')

const taskRoutes = require('./routes/tasks')
const taskListRoutes = require('./routes/taskLists')
const authRoutes = require('./routes/auth')

const app = express()
app.use(express.json())
app.use(cors())
const port = 3000

app.use('/tasks', taskRoutes)
app.use('/auth', authRoutes)
app.use('/task-lists', taskListRoutes)

app.use(errorHandler) // this needs to be defined after all the routes

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})