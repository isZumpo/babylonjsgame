class CollisionHandler {
    constructor() {
        console.log('Collision detection activated!');
    }

    checkForCollision(entity) {

    }

    getNearbyEntities(entityList) {

    }

    collisionEntitySolidCheck(entityMinMax, solidObjectList, deltaTime) {
        //let entityBoundingBox = entity.getBoundingBox();
        //var entityPosition = entity.getPosition();
        //var nextEntityPosition = entityPosition.add(entity.velocity.multiplyByFloats(deltaTime, deltaTime, deltaTime));
        let isCollision = false;
        solidObjectList.forEach(function(solidObject) {
            //let solidBoundingBox = ;
            //let b = {min: solidBoundingBox.minimumWorld, max: solidBoundingBox.maximumWorld}
            let b = solidObject.getBoundingBox();
            //let b = {min: entityBoundingBox.minimumWorld, max: entityBoundingBox.maximumWorld}
            if(this.intersect(entityMinMax, b)) {
                isCollision = true;
            }
        }, this);

        return isCollision;
    }
    intersect(a, b) {
        return (a.min.x <= b.max.x && a.max.x >= b.min.x) &&
            (a.min.y <= b.max.y && a.max.y >= b.min.y) &&
            (a.min.z <= b.max.z && a.max.z >= b.min.z);
    }
    isPointInsideBox(point, box) {
        return (point.x >= box.min.x && point.x <= box.max.x) &&
            (point.y >= box.min.y && point.y <= box.max.y) &&
            (point.z >= box.min.y && point.z <= box.max.z);
    }

    detectSide(velocity, position) {

    }

}

export default CollisionHandler;