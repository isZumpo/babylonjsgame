import Entity from './Entity';
import Enemy from './Enemy';
import BABYLON from './../node_modules/babylonjs/babylon';

class Projectile extends Entity {
    constructor(positionVector, directionVector, scene, _id) {
        super(5, directionVector.multiplyByFloats(100, 100, 100), _id);
        if(Meteor.isClient) {
            this.mesh = BABYLON.Mesh.CreateSphere("Projectile" + Math.random(), 16, 1, scene);
        }
        this.creationTime = Date.now();
        this.lifeTime = 5000;
        this.diameter = 1;
        this.setPosition(positionVector);
    }

    update(fps, collisionHandler, solidObjectList, entityList) {
        if(Date.now() - this.creationTime >= this.lifeTime) {
            this.kill();
        }else {
            super.update(fps, collisionHandler, solidObjectList);
            var collisionCheck = collisionHandler.collisionEntityCheck(this.getBoundingBox(), entityList, fps);
            if(collisionCheck.isCollision) {
                collisionCheck.enemyList[0].kill();
                Session.set('toadKills', Session.get('toadKills') + 1);
                this.kill();
            }
        }


    }
}
export default Projectile;