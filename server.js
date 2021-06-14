const express = require('express');
const app = express();
const connectDB = require('./config/db')
const path = require('path')
const cors = require('cors')
connectDB()
const port = process.env.PORT || 5000;

//Template engine
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

// Received json data from request 
app.use(express.json())

// cors

const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS.split(',')
}
app.use(cors(corsOptions))

// Static file middleware
app.use(express.static('public'))



//Routes
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'))

/// node schedule job
require('./scheduler') // this cron job run every night 2.30 am 


app.listen(port, () => console.log(`Server running on port ${port}`));