

const socket = new WebSocket('ws://localhost:3000');


//------------------ variables --------------------------------------
var gateWays = []; // contain waypoints
var allFlights = [];
var flightInfo = []; // contain information about flights
var firstWaypoint, secondWaypoint, firstLabel, secondLabel;
var flightMarkers = []; // contain all the flight markers
var currentFLight; // used in second setInterval
const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }; // format of the time obtained by the local computer
var radius = 5000; // minimum separation between two planes
var compArr = []; // array that temporily stores the flight data for collision detection
var table; //collision-table
var cell1, cell2, cell3; // cells of the collision table
var allFlights_1 = [];
var collidedPoints = [];

//---------------------------------------------------------------------

socket.onmessage = (event) => {

  const data = JSON.parse(event.data);

  // Extract the array of objects from collection1
  const collection1 = data.collection1;
  const collection2 = data.collection2;

  //console.log("collection 1 = "+collection1);

  // Map the objects in the array to a new array of objects with the desired attributes
  gateWays = collection1.map((obj) => {
    return {
      lat: obj.Lat,
      lng: obj.Lng,
      label: obj.Node_name,
      waypointMarker: null // stores the waypoint marker

    };
  }); 


   // Map the objects in the array to a new array of objects with the desired attributes
   allFlights = collection2.map((obj) => {
      return {
        callsign: obj.Callsign,
        route: rearrangeArray(obj.path[0]) ,                //array of waypoints
        origin: obj.Origin_Info,
        dest: obj.Destination_Info,
        routing: obj.Routing,
        initLat:null,
        initLng:null,
        nextLat:null,
        nextLng:null,
        lat:null,
        lng : null,
        m:null,
        c:null,
        markerName:null,
        tanvalue:null,
        count:1,
        increment:0.05,
        going : true,
        departure_time : obj.Departure_Time,
        marker : null
      };
  });
  
};