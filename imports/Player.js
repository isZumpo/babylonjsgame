import Entity from './Entity';
class Player extends Entity {
    constructor(positionVector, name, scene, camera, _id) {
        super(90, 0, _id);
        this.diameter = 2;
        if(Meteor.isClient) {
            this.camera = camera;
            this.name = name;
            this.mesh = {};

            BABYLON.SceneLoader.ImportMesh("Cube", "assets/", "Jack.babylon", scene, function (meshes) {
                this.mesh = meshes[0];
                this.mesh.visible = true;
                this.mesh.scaling = new BABYLON.Vector3(0.5,0.5,0.5);
                this.mesh.position = new BABYLON.Vector3(0,20,0);
                
            }.bind(this));
            this.scene = scene;
        }

        this.mesh.position = positionVector;
        this.health = 100;
        this.isAlive = true;
    }
    hit(hitPoints) {
        this.health -= hitPoints;
        if(this.health <= 0) {
            this.isAlive = false;
        }
        console.log('Current health: ' + this.health);
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
        return {min: this.getPosition().subtract(new BABYLON.Vector3(this.diameter/2, this.diameter/2, this.diameter/2)), max: this.getPosition().add(new BABYLON.Vector3(this.diameter/2, this.diameter/2, this.diameter/2))}
    }
    getCameraPosition() {
        return this.camera.position;
    }
    getDirectionVector() {
        var cameraRadius = 1 / this.camera.radius;
        var position = this.getPosition();
        var positionCopy = new BABYLON.Vector3(position.x,position.y,position.z);
        var cameraPosition = this.getCameraPosition();
        var cameraPositionCopy = new BABYLON.Vector3(cameraPosition.x,cameraPosition.y,cameraPosition.z);
        cameraPositionCopy.y -= 10;
        var directionVector = (positionCopy.subtract(this.getCameraPosition())).multiplyByFloats(cameraRadius, cameraRadius, cameraRadius);
        return directionVector;

    }
}
export default Player;