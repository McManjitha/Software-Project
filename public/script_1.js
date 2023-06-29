
//------------------ variables --------------------------------------
var gateWays = []; // contain waypoints
var allFlights = [];
var flightInfo = [[], []]; // contain information about flights
var firstWaypoint, secondWaypoint, firstLabel, secondLabel;
var flightMarkers = []; // contain all the flight markers
var currentFLight; // used in second setInterval
const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }; // format of the time obtained by the local computer
var radius = 5000; // minimum separation between two planes
var compArr = []; // array that temporily stores the flight data for collision detection
var table; //collision-table
var cell1, cell2, cell3; // cells of the collision table
var collidedPoints = [];
let circles = [];
let blinkTimers = [];
let count = 0;
let current_hour;
var intervalId1, intervalId2, intervalId3;
var waypointList;
var altitudesArr = [[], [], []];
let uniqueAltitudes = [];
let namingObject = {};// contains the naming of the flightInfo array rows

function getWaypoints(){
  const xhr1 = new XMLHttpRequest();
  xhr1.open('GET', '/wayPoints', true);
  xhr1.setRequestHeader('Content-Type', 'application/json');

  xhr1.onreadystatechange = function(){
    if(xhr1.readyState === 4 && xhr1.status === 200){
      const response = JSON.parse(xhr1.responseText);
      // Map the objects in the array to a new array of objects with the desired attributes
      for(let i = 0; i < response.collection1.length; i++){
        gateWays.push(new WayPoint(response.collection1[i]));
      }
    } else {
      console.error(xhr1.statusText);
    }
  }
  xhr1.send();
}


//---------------------------------------------------------------------

function firstRequest() {
  // Get the present hour
  console.log("Inside firstrequest");
  const now = new Date();
  const presentHour = now.getHours();
  current_hour = presentHour;
  console.log("current hour = "+presentHour);

  // Calculate the next hour
  const nextHour = (presentHour + 1) % 24;
  console.log("next hour = "+nextHour);

  // Create the string in the format "A-B"
  const data = current_hour + '-' + nextHour;

  // Perform your AJAX request here
  const xhr = new XMLHttpRequest();
  const url = '/data?time=' + encodeURIComponent(data); // Include the string as a query parameter
  xhr.open('GET', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      allFlights = [];
      console.log("response recieved");
      const response = JSON.parse(xhr.responseText);
      //console.log(response.collection2);

      for(let i = 0; i < response.collection2.length; i++){
        allFlights.push(new Flight(response.collection2[i]));
        allFlights[i].initializing();
      }
    } else {
      console.error(xhr.statusText);
    }
  };
  xhr.send();
}

getWaypoints();

function sendRequest() {
  // Get the present hour
  console.log("Inside sendrequest");
  current_hour++;
  console.log("current hour = "+current_hour);
  console.log("test");

  // Calculate the next hour
  const nextHour = (current_hour + 1) % 24;
  console.log("Next hour = "+nextHour);

  // Create the string in the format "A-B"
  const data = current_hour + '-' + nextHour;
  current_hour = nextHour;

  // Perform your AJAX request here
  const xhr = new XMLHttpRequest();
  const url = '/data?time=' + encodeURIComponent(data); // Include the string as a query parameter
  xhr.open('GET', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      allFlights = [];
      console.log("response recieved");
      const response = JSON.parse(xhr.responseText);
      for(let i = 0; i < response.collection2.length; i++){
        allFlights.push(new Flight(response.collection2[i]));
        allFlights[i].initializing();
      }
    } else {
      console.error(xhr.statusText);
    }
  };
  xhr.send();
}

function getAltitudes(){
  return new Promise(function(resolve, reject) {
    const xhr2 = new XMLHttpRequest();
    xhr2.open('GET', '/altitudes', true);
    xhr2.setRequestHeader('Content-Type', 'application/json');

    xhr2.onreadystatechange = function(){
      if(xhr2.readyState === 4 && xhr2.status === 200){
        const altitudes = JSON.parse(xhr2.responseText);
        altitudesArr[0] = rearrangeArray(altitudes.TakeOff_levels);
        altitudesArr[1] = rearrangeArray(altitudes.Cruise_Levels);
        altitudesArr[2] = rearrangeArray(altitudes.Decent_levels);
        
        uniqueAltitudes = flattenAndRemoveDuplicates(altitudesArr);
        console.log("uniqueAltitudes");
        console.log(uniqueAltitudes);
        resolve();
        
      }else{
        console.error(xhr2.status);
      }
    }
    xhr2.send();
  });
}


//initializing the ajax request every hour and 
function scheduleRequest() {
  const now = new Date();
  const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0);
  const delay = nextHour - now;
  console.log("Delay = "+delay);
  firstRequest();
  setTimeout(() => {
    console.log("fetching time reached");
    sendRequest();
    setInterval(sendRequest(), 3600000); // Repeat every hour (in milliseconds)
  }, delay);
}
scheduleRequest();

let map;
var intervalId1, intervalId2, intervalId3;
var waypointList;

function main(){
  getWaypoints();
  scheduleRequest();

  // pushing flights to the flightinfo array for the simulation - flightinfo contains the flights that fly
  intervalId2 = setInterval(function() {
    //console.log('flightInfo = '+flightInfo);
    for(let m = 0; m < allFlights.length; m++){
      if(compareTime(allFlights[m].departure_time, allFlights[m].callsign)){ 
        console.log("inside time");
        //console.log(allFlights[m].altitude[0]);
        if(allFlights[m].altitude[0] == '7000'){
          flightInfo[0].push(allFlights[m]);
        }
        else if(allFlights[m].altitude[0] == '12000') {
          //console.log("Done");
          flightInfo[1].push(allFlights[m]);
        }
        
        allFlights.splice(m, 1);
        m--;
      }
    }
    console.log("flightInfo = ");
    console.log(flightInfo);
  }, 7000);
}

function collisionHandling(){
  console.log('Inside collisionHandling');
  //console.log(compArr);
  for(let j = 0; j < compArr.length; j++){
    //console.log("Inside for loop");
    //console.log(compArr[j]);
    while(compArr[j].length > 0){
      let ob1 = compArr[j].shift();
      //console.log(ob1);

      for(let k = 0; k < compArr[j].length; k++){
        let distance = google.maps.geometry.spherical.computeDistanceBetween(ob1.marker.position, compArr[j][k].marker.position);
        if (distance < radius) {

          blinkCircle(ob1.marker.position.lat(), ob1.marker.position.lng());
          const localDate = new Date();
          const localHours = localDate.getHours();
          const localMinutes = localDate.getMinutes();
          const localSeconds = localDate.getSeconds();
          // markers are colliding
          //console.log(compArr[p].callsign+' colllides with '+compArr[pInner].callsign);
          table = document.getElementById('collision-table');
          // Create a new row for the table
          var newRow = table.insertRow();
          cell1 = newRow.insertCell(0);
          cell2 = newRow.insertCell(1);
          cell3 = newRow.insertCell(2);
          cell4 = newRow.insertCell(3);
          cell5 = newRow.insertCell(4);
          // Populate the cells with the data for the new record
          cell1.innerHTML = ob1.callsign;
          cell2.innerHTML = compArr[j][k].callsign;
          cell3.innerHTML = localHours+":"+localMinutes+":"+localSeconds;
          cell4.innerHTML = ob1.lat;
          cell5.innerHTML = ob1.lng;
        } 
      }
    }
  }
}

async function namingflightInfo(){
  try{
    await getAltitudes();
    for(let i = 0; i < uniqueAltitudes.length; i++){
      flightInfo.push([]);
      namingObject[uniqueAltitudes[i]] = i;
    }
  }catch(error){
    console.error(error);
  }
}

function initMap() {
  // Initialize the map
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 1.99702, lng: 106.66321 },
    zoom: 0,
    maxZoom: 15,
    minZoom: 5
  });


  setTimeout(function() {
    //---------------------------Iniatial assigning-------------------------------
        for(var i = 0; i < allFlights.length; i++){
          if(allFlights[i].going){
    
            // Finding the waypoints of the first journey
            firstLabel = allFlights[i].route[0];
            secondLabel = allFlights[i].route[1];
    
            // finding the origin of the airplane
            firstWaypoint = gateWays.find((obj) => obj.label == firstLabel);
            secondWaypoint = gateWays.find((obj) => obj.label == secondLabel);
    
            // assigning initial and next coordinates 
            allFlights[i].initLat = firstWaypoint.lat;
            allFlights[i].initLng = firstWaypoint.lng;
            allFlights[i].nextLat = secondWaypoint.lat;
            allFlights[i].nextLng = secondWaypoint.lng;
            //flightInfo[i].increment = 0.3; // temporily - this should be initialized using the speed.
    
            //calculating initial gradient and intercept
            allFlights[i].m = calcGradient(allFlights[i].initLng, allFlights[i].initLat, allFlights[i].nextLng, allFlights[i].nextLat);
            allFlights[i].c = calcIntercept(allFlights[i].nextLng, allFlights[i].nextLat, allFlights[i].m);
    
            allFlights[i].tanvalue = clacPlaneAngle(allFlights[i].m);
            allFlights[i].markerName = initalString_2(allFlights[i].initLat, allFlights[i].initLng, allFlights[i].nextLat, allFlights[i].nextLng);
    
            // calculating the initail increment
            if(allFlights[i].initLng > allFlights[i].nextLng){
              allFlights[i].increment = -1*Math.abs(allFlights[i].increment);
            }else{
              allFlights[i].increment = 1*Math.abs(allFlights[i].increment);
            }
    
              // creates the marker of the planes
            const newMarker = new google.maps.Marker({
              map: map,
              position: { lat: allFlights[i].initLat, lng: allFlights[i].initLng },
              icon : {
                url: allFlights[i].markerName,
                scaledSize :  new google.maps.Size(20, 20)
              },
              /*label:{                           
                text : allFlights[i].callsign,      
                labelVisible : false                
              },*/
              setTitle : allFlights[i].callsign
            });
            allFlights[i].marker = newMarker;
    
            allFlights[i].marker.addListener("click", function(){
              console.log(this.setTitle);
            })
          }
          
        }
      }, 3000);

}