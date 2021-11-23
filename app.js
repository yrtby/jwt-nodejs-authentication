require('dotenv').config();
require('./config/database').connect();

const express = require('express');

const {ENV_PORT} = process.env;

// Middlewares path
const authMiddleware = require('./middlewares/authMiddleware');

// Routes path
const authRoute = require('./routes/authRoute');
const pageRoute = require('./routes/pageRoute');

// Express start
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.use('/auth',authRoute);
app.use('/',authMiddleware,pageRoute);

// Server Start
app.listen(ENV_PORT,() => {
    console.log(`Uygulama ${ENV_PORT} portunda başlatıldı.`)
})