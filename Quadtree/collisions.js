// Quadtree class
class Quadtree {
  constructor(boundary, capacity) {
    this.boundary = boundary; // Rectangle representing the boundaries of the quadtree
    this.capacity = capacity; // Maximum number of objects per node
    this.objects = []; // Array to store objects in this node
    this.children = []; // Array to store child nodes (quadrants)
    this.divided = false; // Flag to indicate if the node has been divided
  }

  insert(object) {
    if (!this.boundary.contains(object)) {
      return; // Object is outside the quadtree's boundary, ignore
    }

    if (this.objects.length < this.capacity) {
      this.objects.push(object); // Add the object to this node
    } else {
      if (!this.divided) {
        this.subdivide(); // Divide the node into quadrants if not already divided
      }

      // Insert the object into the appropriate child quadrant(s)
      for (let child of this.children) {
        child.insert(object);
      }
    }
  }

  subdivide() {
    const x = this.boundary.x;
    const y = this.boundary.y;
    const w = this.boundary.width / 2;
    const h = this.boundary.height / 2;

    // Create child quadrants
    this.children.push(new Quadtree(new Rectangle(x, y, w, h), this.capacity));
    this.children.push(new Quadtree(new Rectangle(x + w, y, w, h), this.capacity));
    this.children.push(new Quadtree(new Rectangle(x, y + h, w, h), this.capacity));
    this.children.push(new Quadtree(new Rectangle(x + w, y + h, w, h), this.capacity));

    this.divided = true;
  }

  query(range) {
    const objectsInRange = [];

    if (!this.boundary.intersects(range)) {
      return objectsInRange; // No intersection, return empty array
    }

    // Check objects in this node
    for (let object of this.objects) {
      if (range.contains(object)) {
        objectsInRange.push(object);
      }
    }

    // Recursively check child quadrants
    for (let child of this.children) {
      objectsInRange.push(...child.query(range));
    }

    return objectsInRange;
  }
}

// Rectangle class
class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  contains(object) {
    return (
      object.x >= this.x &&
      object.x <= this.x + this.width &&
      object.y >= this.y &&
      object.y <= this.y + this.height
    );
  }

  intersects(range) {
    return !(
      range.x > this.x + this.width ||
      range.x + range.width < this.x ||
      range.y > this.y + this.height ||
      range.y + range.height < this.y
    );
  }
}

// Object class representing flight data
class FlightObject {
  constructor(x, y, height) {
    this.x = x;
    this.y = y;
    this.height = height;
  }
}

// Usage example
const boundary = new Rectangle(0, 0, 800, 600); // Boundary of the quadtree
const capacity = 4; // Maximum number of objects per node

const quadtree = new Quadtree(boundary, capacity);

// Insert flight data objects into the quadtree
const flight1 = new FlightObject(100
