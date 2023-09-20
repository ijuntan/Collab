const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const api = require('./routes');
const { isAuthenticated } = require('./middleware');
mongoose.set('strictQuery', true);

require('dotenv').config();

const app = express();

//todo: adding whitelist
app.use(cors({
    origin:"http://localhost:3000"
}));
require('./services/passport')
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(helmet());

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log('Database connected succesfully');
}).catch((err) => {
    console.log('err => ', err)
})

app.get('/', (req, res) => {
    res.json({
        message: 'Test Run'
    })
})

app.use('/api/v1', api)
app.use(isAuthenticated)
module.exports = app;
