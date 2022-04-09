const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

// will check if we already have a port env variable, if not initialize it to 5000
const PORT = process.env.PORT || 5000

const app = express()

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 Mn
    max: 100,
})
app.use(limiter)
app.set('trust proxy', 1)

// Set static folder. We can go to http://localhost:5000/public to get what is inside the public folder (not initialized here)
//app.use(express.static('public'))
// This is useful if we have everything (including the front) in this project.

// Enable cors for front
app.use(cors({origin: 'http://localhost:4200'}))

// Routes
// app.use('/api', require('./routes'))
// no need to call it ./routes.index because index default name
// postman -> call http://localhost:5000/api

app.use('/summoner', require('./routes/summoner'))
app.use('/spectator', require('./routes/spectator'))

// npm run dev will print that
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))