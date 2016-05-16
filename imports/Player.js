import Entity from './Entity';
import BABYLON from './../node_modules/babylonjs/babylon';

class Player extends Entity {
    constructor(positionVector, name, scene, camera, _id) {
        super(90, 0, _id);
        this.diameter = 1;
        this.directionVector = new BABYLON.Vector3();
        this.firstRender = true;
        if(Meteor.isClient) {
            this.camera = camera;
            this.name = name;
            this.mesh = {};
            this.isReady = false;

            BABYLON.SceneLoader.ImportMesh("Character", "assets/", "Dave.babylon", scene, function (meshes, particleSystems, skeletons) {
                this.mesh = meshes[0];
                this.skeletons = skeletons[0];
                //console.log(this.mesh);
                this.mesh.visible = true;
                this.mesh.scaling = new BABYLON.Vector3(4,4,4);
                this.mesh.position = new BABYLON.Vector3(0,20,0);
                //console.log(skeletons[0]);
                scene.beginAnimation(skeletons[0], 0, 100, true, 1.0);
                //console.log(this.mesh.animations);
                //this.mesh.animations[0].start();
                //this.scene.beginAnimation(this.mesh, 0, 20, true);

                //var material = new BABYLON.StandardMaterial('mat', scene);;
                //material.diffuseTexture = new BABYLON.Texture("assets/Character_Texture.png", scene);
                //this.mesh.material = material;
                this.isReady = true;
                
            }.bind(this));
            this.scene = scene;
        }

        this.mesh.position = positionVector;
        this.health = 100;
        this.isAlive = true;
        //console.log(this.mesh.getBoundingInfo());

        //GamePhysics
        //this.mesh.setPhysicsState(BABYLON.PhysicsEngine.CapsuleImpostor, {mass: 1});

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
        if(this.isReady) {
            return {min: this.mesh.getBoundingInfo().boundingBox.minimumWorld, max: this.mesh.getBoundingInfo().boundingBox.maximumWorld}
        }else {
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
}
export default Player;