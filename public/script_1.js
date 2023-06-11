




//------------------ variables --------------------------------------
var gateWays = []; // contain waypoints
var allFlights = [];
var flightInfo = []; // contain information about flights
var firstWaypoint, secondWaypoint, firstLabel, secondLabel;
var flightMarkers = []; // contain all the flight markers
var currentFLight; // used in second setInterval
const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }; // format of the time obtained by the local computer
var radius = 5000; // minimum separation between two planes

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
      };
  });
  
};

function getWaypoints(){
  const xhr1 = new XMLHttpRequest();
  xhr1.open('GET', '/wayPoints', true);
  xhr1.setRequestHeader('Content-Type', 'application/json');
  xhr1.onreadystatechange = function(){
    if(xhr1.readyState === 4 && xhr1.status === 200){
      const response = JSON.parse(xhr1.responseText);
      // Map the objects in the array to a new array of objects with the desired attributes
      gateWays = response.collection1.map((obj) => {
        return {
          lat: obj.Lat,
          lng: obj.Lng,
          label: obj.Node_name,
          waypointMarker: null // stores the waypoint marker
        };
      });
    } else {
      console.error(xhr1.statusText);
    }
  }
  xhr1.send();
}

function sendRequest() {
  // Get the present hour
  const now = new Date();
  const presentHour = now.getHours();

  // Calculate the next hour
  const nextHour = (presentHour + 1) % 24;

  // Create the string in the format "A-B"
  const data = presentHour + '-' + nextHour;

  // Perform your AJAX request here
  const xhr = new XMLHttpRequest();
  const url = '/data?time=' + encodeURIComponent(data); // Include the string as a query parameter
  xhr.open('GET', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      // Handle the response data
      console.log('response = ');
      console.log(response.collection2);
      //console.log("response length = "+response.collection3.length);
      allFlights = response.collection2.map((obj) => {
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
    } else {
      console.error(xhr.statusText);
    }
  };

  xhr.send();
}

let map;
var intervalId1, intervalId2, intervalId3;
var waypointList;

function initMap() {
  // Initialize the map
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 1.99702, lng: 106.66321 },
    zoom: 0,
    maxZoom: 15,
    minZoom: 5
  });

}