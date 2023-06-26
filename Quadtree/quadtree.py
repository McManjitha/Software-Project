class QuadtreeNode:
    def __init__(self, x, y, width, height, capacity):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.capacity = capacity
        self.objects = []
        self.children = []

    def insert(self, obj):
        if len(self.objects) < self.capacity:
            self.objects.append(obj)
        else:
            if not self.children:
                self.subdivide()

            for child in self.children:
                if child.contains(obj):
                    child.insert(obj)

    def subdivide(self):
        half_width = self.width // 2
        half_height = self.height // 2
        x = self.x
        y = self.y

        self.children.append(QuadtreeNode(x, y, half_width, half_height, self.capacity))
        self.children.append(QuadtreeNode(x + half_width, y, half_width, half_height, self.capacity))
        self.children.append(QuadtreeNode(x, y + half_height, half_width, half_height, self.capacity))
        self.children.append(QuadtreeNode(x + half_width, y + half_height, half_width, half_height, self.capacity))

    def contains(self, obj):
        return (
            obj.x >= self.x and
            obj.x + obj.width <= self.x + self.width and
            obj.y >= self.y and
            obj.y + obj.height <= self.y + self.height
        )

    def query(self, region):
        results = []
        
        if not self.intersects(region):
            return results

        for obj in self.objects:
            if obj.intersects(region):
                results.append(obj)

        for child in self.children:
            results.extend(child.query(region))

        return results

    def intersects(self, region):
        return not (
            region.x > self.x + self.width or
            region.x + region.width < self.x or
            region.y > self.y + self.height or
            region.y + region.height < self.y
        )


class Object:
    def __init__(self, x, y, width, height):
        self.x = x
        self.y = y
        self.width = width
        self.height = height

    def intersects(self, region):
        return not (
            self.x > region.x + region.width or
            self.x + self.width < region.x or
            self.y > region.y + region.height or
            self.y + self.height < region.y
        )

# Usage example
# Create the quadtree and insert objects
quadtree = QuadtreeNode(0, 0, 800, 600, 4)
obj1 = Object(100, 100, 20, 20)
obj2 = Object(200, 200, 30, 30)
obj3 = Object(300, 300, 40, 40)
quadtree.insert(obj1)
quadtree.insert(obj2)
quadtree.insert(obj3)

# Query for objects within a region of interest
region_of_interest = Object(150, 150, 100, 100)
objects_in_region = quadtree.query(region_of_interest)

# Print the objects within the region of interest
for obj in objects_in_region:
    print("Object at ({}, {}) with size {}x{}".format(obj.x, obj.y, obj.width, obj.height))
