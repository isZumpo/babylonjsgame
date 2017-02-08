import Entity from './Entity';
import BABYLON from './../node_modules/babylonjs/babylon';

class Player extends Entity {
    constructor(positionVector, name, scene, camera, _id) {
        super(70, 0, _id);
        this.diameter = 1;
        this.directionVector = new BABYLON.Vector3();
        this.health = 5;
        this.isAlive = true;
        Session.set('health', this.health);
        if(Meteor.isClient) {
            this.camera = camera;
            this.name = name;
            this.mesh = {};

            BABYLON.SceneLoader.ImportMesh("Character", "assets/", "Dave.babylon", scene, function (meshes, particleSystems, skeletons) {
                this.mesh = meshes[0];
                this.skeletons = skeletons[0];
                //console.log(this.mesh);
                this.mesh.visible = true;
                this.mesh.scaling = new BABYLON.Vector3(4,4,4);
                this.mesh.position = new BABYLON.Vector3(0,20,0);
                scene.beginAnimation(this.skeletons, 0, 100, true, 1.0);

            }.bind(this));
            this.scene = scene;
        }
        this.setPosition(positionVector);
        this.camera.setPosition(new BABYLON.Vector3(this.mesh.position.x - 20, this.mesh.position.y + 10, this.mesh.position.z));

    }
    hit(hitPoints) {
        this.health -= hitPoints;
        if(this.health <= 0) {
            this.isAlive = false;
            this.kill();
        }
        Session.set('health', this.health);
    }
    setPosition(position) {
        super.setPosition(position);
        if(Meteor.isClient) {
            var cameraPosition = new BABYLON.Vector3(position.x, position.y, position.z);
            cameraPosition.y += 10;
            this.camera.target = cameraPosition;
        }
    }
    getBoundingBox() {
        try {
            return {min: this.mesh.getBoundingInfo().boundingBox.minimumWorld, max: this.mesh.getBoundingInfo().boundingBox.maximumWorld}
        } catch(error) {
            return {min: this.getPosition().subtract(new BABYLON.Vector3(this.diameter/2, this.diameter/2, this.diameter/2)), max: this.getPosition().add(new BABYLON.Vector3(this.diameter/2, this.diameter/2, this.diameter/2))}
        }
    }
    getCameraPosition() {
        return this.camera.position;
    }
    getDirectionVector() {
        return this.directionVector;
    }
    updateDirectionVector() {
        var cameraRadius = 1 / this.camera.radius;
        var position = this.getPosition();
        var positionCopy = new BABYLON.Vector3(position.x,position.y,position.z);
        var cameraPosition = this.getCameraPosition();
        var cameraPositionCopy = new BABYLON.Vector3(cameraPosition.x,cameraPosition.y,cameraPosition.z);
        cameraPositionCopy.y -= 10;
        this.directionVector = (positionCopy.subtract(this.getCameraPosition())).multiplyByFloats(cameraRadius, cameraRadius, cameraRadius);
    }
    update(fps, collisionHandler, solidObjectList, entityList) {
        super.update(fps, collisionHandler, solidObjectList);
        var collisionCheck = collisionHandler.collisionEntityCheck(this.getBoundingBox(), entityList, fps);
        if(collisionCheck.isCollision) {
            collisionCheck.enemyList.forEach(function(enemy) {
                enemy.kill();
            });
            this.hit(1);
        }
    }
}
export default Player;