
//class that define the function of the circle that blinks on the collided point
class CustomOverlay extends google.maps.OverlayView {
    constructor(position) {
      super();
      this.position = { lat: position.lat(), lng: position.lng() };
      this.element = document.createElement("div").classList.add("circle");
      this.map = map;
      this.setMap(map);
      this.count = 0;
    }
  
    onAdd() {
      this.getPanes().overlayLayer.appendChild(this.element);
    }
  
    onRemove() {
      this.element.parentNode.removeChild(this.element);
    }
  
    draw() {
      const projection = this.getProjection();
      const point = projection.fromLatLngToDivPixel(this.position);
  
      this.element.style.left = point.x + "px";
      this.element.style.top = point.y + "px";
    }

    /*incrementCount() {
        this.count++;
        if (this.count > 8) {
          this.count = 0;
        }
      }*/
}


class PositionCounter {
    constructor(position) {
      this.position = position;
      this.count = 0;
    }
  
    
}