import Enemy from './Enemy';
class CollisionHandler {
    constructor() {
        console.log('Collision detection activated!');
    }

    //For projectile and player:
    collisionEntityCheck(entityMinMax, entityList, deltaTime) {
        let isCollision = false;
        let collisionEnemyList = [];
        entityList.forEach(function(entity) {
            if(entity instanceof Enemy) {
                if(this.intersect(entityMinMax, entity.getBoundingBox())) {
                    isCollision = true;
                    collisionEnemyList.push(entity);
                }
            }
        }, this);
        if(isCollision) {
            return {isCollision, enemyList: collisionEnemyList};
        }else {
            return {isCollision};
        }
    }

    collisionEntitySolidCheck(entityMinMax, solidObjectList, deltaTime) {
        let isCollision = false;
        let collisionSolidObjectList = [];
        solidObjectList.forEach(function(solidObject) {
            let b = solidObject.getBoundingBox();
            if(this.intersect(entityMinMax, b)) {
                isCollision = true;
                collisionSolidObjectList.push(solidObject);
            }
        }, this);

        if(isCollision) {
            return {isCollision, solidObjectList: collisionSolidObjectList};
        }else {
            return {isCollision};
        }
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

}

export default CollisionHandler;