const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/LoginSignUp")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB:", error);
  });

const LogInSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const PlaneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
});

const RouteSchema = new mongoose.Schema({
  routename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

const WaypointSchema = new mongoose.Schema({
  waypointname: {
    type: String,
    required: true,
  },
  location1: {
    type: String,
    required: true,
  },
  location2: {
    type: String,
    required: true,
  },
});

const LogInCollection = mongoose.model("LogInCollection", LogInSchema);
const PlaneCollection = mongoose.model("PlaneCollection", PlaneSchema);
const RouteCollection = mongoose.model("RouteCollection", RouteSchema);
const WaypointCollection = mongoose.model("WaypointCollection", WaypointSchema);

module.exports = {
  LogInCollection,
  PlaneCollection,
  RouteCollection,
  WaypointCollection,
};
