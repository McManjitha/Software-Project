const express = require('express');
const cors = require('cors');
const mongoose =require('mongoose');
const uri = require('./config/db');
const imageRoute = require('./routes/imageRoute')

mongoose.connect(uri)

let app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.use('/image',imageRoute)

 module.exports =app;
