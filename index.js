const express = require('express')
const cors = require('cors')
require('dotenv').config()

// will check if we already have a port env variable, if not initialize it to 5000
const PORT = process.env.PORT || 5000

const app = express()

// Routes
app.use('/api', require('./routes'))
// no need to call it ./routes.index because index default name
// postman -> call http://localhost:5000/api

// Enable cors
app.use(cors())

// npm run dev will print that
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))