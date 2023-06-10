const express = require('express');
const mongoose = require("mongoose");

const app = express();

var waypointList = [];
var planeList = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: false,
}));

const server = app.listen(3000, () => {
  console.log('Server started');
});

mongoose.connect('mongodb://127.0.0.1:27017/FlightSimulator',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => {
  console.log('Connected to MongoDB');
  
})
.catch((error) => {
  console.log('Error connecting to MongoDB', error);
});