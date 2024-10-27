const express = require('express')
var cors = require('cors')

const taskRoutes = require('./routes/tasks')
const authRoutes = require('./routes/auth')

const app = express()
app.use(express.json())
app.use(cors())
const port = 3000

app.use('/tasks', taskRoutes)
app.use('/auth', authRoutes)

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})