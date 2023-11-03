const express = require('express')
const app = express()
const connectDb = require('./config/db.config')

connectDb()

const port = 5000

app.use(express.json())
app.use('/project', require('./routes/project.routes.js'))


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})