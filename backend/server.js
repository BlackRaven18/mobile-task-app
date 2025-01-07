const express = require('express')
const cors = require('cors')
const errorHandler = require('./middleware/errorMiddleware')

const taskRoutes = require('./routes/tasks')
const taskListRoutes = require('./routes/taskLists')
const authRoutes = require('./routes/auth')
const syncRoutes = require('./routes/sync')

const app = express()
app.use(express.json())
app.use(cors())
const port = 3000

app.use('/tasks', taskRoutes)
app.use('/task-lists', taskListRoutes)
app.use('/auth', authRoutes)
app.use('/sync', syncRoutes)

app.use(errorHandler) // this needs to be defined after all the routes

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})