class Flight{
    constructor(obj){
        console.log("cons");
        this.callsign = obj.Callsign;
        this.route = rearrangeArray(obj.path[0]);
        this.origin = obj.Origin_Info;
        this.dest = obj.Destination_Info;
        this.routing = obj.Routing;
        this.initLat = null;
        this.initLng = null;
        this.nextLat = null;
        this.nextLng = null;
        this.lat = null;
        this.lng = null;
        this.m = null;
        this.c = null;
        this.markerName = null;
        this.tanvalue = null;
        this.count = 1;
        this.increment = 0.05;
        this.going = true;
        this.departure_time = obj.Departure_Time;
        this.marker = null;
    }

    rearrangeArray(inputString){
        // remove initial '[' and final ']' characters
        inputString = inputString.slice(1, -1);
        // split the input string by commas
        const elements = inputString.split(",");
        // create a new array of strings
        const outputArray = elements.map((element) => {
          // remove any leading or trailing whitespace
          element = element.trim();
          // return the element as a string
          return String(element);
        });
        // return the output array
        return outputArray;
    }

    createMarker(){
        const newMarker = new google.maps.Marker({
            map: map,
            position: { lat: this.initLat, lng: this.initLng },
            icon : {
                url: this.markerName,
                scaledSize :  new google.maps.Size(20, 20)
            },
            /*label:{                           
                text : allFlights[i].callsign,      
                labelVisible : false                
            },*/
            setTitle : this.callsign
        });
        return newMarker;
    }

    initializing(){
        let firstWaypoint = gateWays.find((obj) => obj.label == this.route[0]);
        let secondWaypoint = gateWays.find((obj) => obj.label == this.route[1]);

        // assigning initial and next coordinates 
        this.initLat = firstWaypoint.lat;
        this.initLng = firstWaypoint.lng;
        this.nextLat = secondWaypoint.lat;
        this.nextLng = secondWaypoint.lng;
        //flightInfo[i].increment = 0.3; // temporily - this should be initialized using the speed.
        //calculating initial gradient and intercept
        this.m = calcGradient( this.initLng,  this.initLat,  this.nextLng,  this.nextLat);
        this.c = calcIntercept( this.nextLng,  this.nextLat,  this.m);

        this.tanvalue = clacPlaneAngle( this.m);
        this.markerName = initalString_2( this.initLat,  this.initLng,  this.nextLat,  this.nextLng);
        // calculating the initail increment
        if( this.initLng >  this.nextLng){
            this.increment = -1*Math.abs( this.increment);
        }else{
            this.increment = 1*Math.abs( this.increment);
        }
        // creates the marker of the planes
        this.marker = this.createMarker();

        this.marker.addListener("click", function(){
            console.log(this.setTitle);
        })
    }
}

class WayPoint{
    constructor(obj){
        this.lat = obj.Lat;
        this.lng = obj.Lng;
        this.label = obj.Node_name;
        this.waypointMarker = null;
    }
    
}