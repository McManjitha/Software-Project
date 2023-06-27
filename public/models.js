class Flight{
    constructor(obj){
<<<<<<< HEAD
=======
        console.log("cons");
>>>>>>> 14198d3c07387bfd933aa803a2b53c33e2a884e9
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
<<<<<<< HEAD
=======
        this.c = null;
        this.markerName = null;
        this.tanvalue = null;
        this.count = 1;
        this.increment = 0.05;
        this.going = true;
        this.departure_time = obj.Departure_Time;
        this.marker = null;
        //this.elevation = obj.elevation;
>>>>>>> 14198d3c07387bfd933aa803a2b53c33e2a884e9
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

    incrementing(){
        this.lng = this.marker.getPosition().lng() + this.increment;
        this.lat =  this.lng* this.m +  this.c;
        this.marker.setPosition({lat: this.lat, lng: this.lng});
    }

<<<<<<< HEAD
    waypointChanging_down(j, k){
        //console.log("inside down");
        if(this.isDestinationReached(j, k)){
=======
    waypointChanging_down(index){
        if(this.isDestinationReached(index)){
>>>>>>> 14198d3c07387bfd933aa803a2b53c33e2a884e9
            return;
        }
        this.initLat =  this.nextLat;
        this.initLng = this.nextLng;
        let temp1 = gateWays.find((obj) => obj.label == this.route[this.count]);
        this.nextLat = temp1.lat;
        this.nextLng = temp1.lng;
        this.m = calcGradient(this.initLng, this.initLat,this.nextLng, this.nextLat)
        this.c = calcIntercept(this.nextLng, this.nextLat, this.m);
        this.tanvalue = clacPlaneAngle(this.m);
        if(this.initLat > this.nextLat){
            this.tanvalue = this.tanvalue + 180;
        }
        this.markerName = makeImageString(this.tanvalue-40);
        let icon = {
            url: this.markerName,
            scaledSize: new google.maps.Size(20, 20)
        };
        this.marker.setIcon(icon);
        if(this.initLng > this.nextLng){
            this.increment = -1*Math.abs(this.increment);
        }else{
            this.increment = Math.abs(this.increment);
        }
<<<<<<< HEAD
    }

    isDestinationReached(j, k){
        //console.log("inside reached");
        this.count = this.count + 1;
        //console.log("coutn = "+this.count);
        if(this.count >= this.route.length){
            //console.log("End reached");
            this.marker.setPosition({lat : this.nextLat, lng : this.nextLng});
            this.going = false;
            try{
                flightInfo[j].splice(k, 1);
            }catch(error){
                console.log(error);
                console.log('callsign = '+this.callsign);
                console.log('j = '+j);
                console.log('k = '+k);
            }
=======

    }

    isDestinationReached(index){
        this.count = this.count + 1;
        if(this.count >= this.route.length){
            this.marker.setPosition({lat : this.nextLat, lng : this.nextLng});
            this.going = false;
            flightInfo.splice(index, 1);
>>>>>>> 14198d3c07387bfd933aa803a2b53c33e2a884e9
            return 1;
        }
        return 0;
    }

<<<<<<< HEAD
    waypointChanging_up(j, k){
        if(this.isDestinationReached(j, k)){
=======
    waypointChanging_up(index){
        if(this.isDestinationReached(index)){
>>>>>>> 14198d3c07387bfd933aa803a2b53c33e2a884e9
            return;
        }
        this.initLat =  this.nextLat;
        this.initLng =this.nextLng;
        // plane stopping
        var temp2 = gateWays.find((obj) => obj.label == this.route[this.count]);

        this.nextLat = temp2.lat;
        this.nextLng = temp2.lng;

        // calculate the new gradient and intercept of the next journey
        this.m = calcGradient(this.initLng, this.initLat,this.nextLng, this.nextLat)
        this.c = calcIntercept(this.nextLng, this.nextLat, this.m);

        this.tanvalue = clacPlaneAngle(this.m);
        //console.log('tanvalue = '+flightInfo[k].tanvalue);
        
        if(this.initLat >  this.nextLat){
            this.tanvalue = this.tanvalue + 180;
        }
        this.markerName = makeImageString(this.tanvalue-40);

        let icon = {
            url: this.markerName,
            scaledSize: new google.maps.Size(20, 20)
        };
        this.marker.setIcon(icon);
        // selecting the right increment whether negative or positive
        if(this.initLng > this.nextLng){
            this.increment = -1*Math.abs(this.increment);
        }else{
            this.increment = Math.abs(this.increment);
        }
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