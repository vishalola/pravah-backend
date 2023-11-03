const express = require('express')
const app = express()
const connectDb = require('./config/dbconnection')

connectDb()

const port = 5000

app.use(express.json())
app.use('/', require('./routes/projectRoutes.js'))


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})