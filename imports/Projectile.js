import Entity from './Entity';
import Enemy from './Enemy';
//import BABYLONN from './babylonmath';
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
    //getBoundingBox() {
    //    if(Meteor.isServer) {
    //        return {min: this.getPosition().subtract(new BABYLONN.Vector3(this.diameter/2, this.diameter/2, this.diameter/2)), max: this.getPosition().add(new BABYLONN.Vector3(this.diameter/2, this.diameter/2, this.diameter/2))}
    //    }
    //    return {min: this.getPosition().subtract(new BABYLON.Vector3(this.diameter/2, this.diameter/2, this.diameter/2)), max: this.getPosition().add(new BABYLON.Vector3(this.diameter/2, this.diameter/2, this.diameter/2))}
    //}

    update(fps, collisionHandler, solidObjectList, entityList) {
        if(Date.now() - this.creationTime >= this.lifeTime) {
            this.kill();
        }else {
            super.update(fps, collisionHandler, solidObjectList);
            var collisionCheck = collisionHandler.collisionEntityCheck(this.getBoundingBox(), entityList, fps);
            if(collisionCheck.isCollision) {
                //collisionCheck.enemy.setPosition(new BABYLON.Vector3(0, 1000, 0));
                collisionCheck.enemy.kill();
                this.kill();
            }
        }


    }
}
export default Projectile;