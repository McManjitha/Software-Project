function createCircle(lt, lg){
  var circle = new google.maps.Circle({
    strokeColor: "#FF0000", // Set the stroke color of the circle
    strokeOpacity: 0.8, // Set the stroke opacity
    strokeWeight: 2, // Set the stroke weight
    fillColor: "#FF0000", // Set the fill color of the circle
    fillOpacity: 0.35, // Set the fill opacity
    map: map, // Set the map instance
    center: { lat: lt,  lng: lg }, // Set the center coordinates
    radius: 20000, // Set the radius in meters
    visibility : true,
    count : 0
  });
  return circle;
}
// calculate the gradient of the straight line path
function calcGradient(x1, y1, x2, y2){
    var gradient = (y2 - y1)/(x2 - x1);
    return gradient;
  }
  
  // claculate the intercept of the straight line path
  function calcIntercept(x, y, m){
    var intercept = y - m*x;
    return intercept;
  }
  
  
  // marker creating function - used for creating waypoints
function createMarker(coordinates, label){
var marker = new google.maps.Marker({
    map:map,
    icon:{
    url : "./images/waypoint2.png",
    scaledSize: new google.maps.Size(10, 10)
    },
    position : {lat : coordinates.lat, lng : coordinates.lng},
    setTitle : coordinates.label
    //label : coordinates.label
})
return marker;
}

  // calculate the angle of the plane marker according to the path in degrees
function clacPlaneAngle(tanVal){
    let tanInverse = Math.atan(tanVal) * (180/ Math.PI);
    if(tanInverse < 0){
      tanInverse = tanInverse + 180;
    }
    return tanInverse;
}