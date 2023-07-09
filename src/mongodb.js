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
  id: {
    type: String,
    required:false,
  },
  Callsign: {
    type: String,
    required: false,
  },
  Departure_Time: {
    type: String,
    required: false,
  },
  Destination_Info: {
    type: String,
    required: false,
  },
  Origin_Info: {
    type: String,
    required: false,
  },
  Origin: {
    type: String,
    required:false,
  },
  Dest: {
    type: String,
    required: false,
  },
  Routing: {
    type: String,
    required: false,
  },
  Aircraft_Type: {
    type: String,
    required:false,
  },
  Cruise_Speed: {
    type: String,
    required:false,
  },
  Max_Ceiling: {
    type: String,
    required: false,
  },
  Default_RFL: {
    type: String,
    required: false,
  },
  Time_Duration: {
    type: String,
    required:false,
  },
  Schedule_Arrival_Time: {
    type: String,
    required: false,
  },
  path: {
    type: String,
    required: false,
  },
  Altitude: {
    type: String,
    required: false,
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

const WaypointsSchema = new mongoose.Schema({
  Node_name: {
    type: String,
    required: true,
  },
  Lat: {
    type: String,
    required: true,
  },
  Lng: {
    type: String,
    required: true,
  },
});
const AltitudesSchema = new mongoose.Schema({
  TakeOff_levels: {
    type: String,
    required: true,
  },
  Cruise_Levels: {
    type: String,
    required: true,
  },
  Decent_levels: {
    type: String,
    required: true,
  },
});

const LogInCollection = mongoose.model("LogInCollection", LogInSchema);
const PlaneCollection = mongoose.model("PlaneCollection", PlaneSchema);
const RouteCollection = mongoose.model("RouteCollection", RouteSchema);
const WaypointCollection = mongoose.model("WaypointCollection", WaypointsSchema);
const AltitudeCollection = mongoose.model("AltitudeCollection", AltitudesSchema);

module.exports = {
  LogInCollection,
  PlaneCollection,
  RouteCollection,
  WaypointCollection,
  AltitudeCollection,
};
