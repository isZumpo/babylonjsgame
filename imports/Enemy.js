import Entity from './Entity';
import BABYLON from './../node_modules/babylonjs/babylon';

class Enemy extends Entity {
    constructor(positionVector, scene) {
        super(2, new BABYLON.Vector3(0, 0, 0), 'pizza');
        this.setPosition(positionVector);
        this.diameter = 4;
        BABYLON.SceneLoader.ImportMesh("red_toad", "assets/", "toad.babylon", scene, function (meshes, particleSystems, skeletons) {
            this.mesh = meshes[0];
            this.mesh.visible = true;
            this.mesh.scaling = new BABYLON.Vector3(2,2,2);
            this.mesh.position = positionVector;
            this.mesh.rotation = new BABYLON.Vector3(-Math.PI/2, Math.random() * 2 * Math.PI, 0);
        }.bind(this));
        this.scene = scene;
        this.viewDistance = 50
        this.waklingForce = 2;


    }

    getBoundingBox() {
        try {
            return {min: this.mesh.getBoundingInfo().boundingBox.minimumWorld, max: this.mesh.getBoundingInfo().boundingBox.maximumWorld}
        } catch(error) {
            return {min: this.getPosition().subtract(new BABYLON.Vector3(this.diameter/2, this.diameter/2, this.diameter/2)), max: this.getPosition().add(new BABYLON.Vector3(this.diameter/2, this.diameter/2, this.diameter/2))}
        }
    }

    update(fps, collisionHandler, solidObjectList, player) {
        super.update(fps, collisionHandler, solidObjectList);
        if(BABYLON.Vector3.Distance(this.getPosition(), player.getPosition()) < this.viewDistance) {
            var normalizedVector = BABYLON.Vector3.Normalize(player.getPosition().subtract(this.getPosition()));
            this.applyForce(normalizedVector.multiplyByFloats(this.waklingForce, this.waklingForce, this.waklingForce));
            if(normalizedVector.z < 0 ) {
                this.mesh.rotation = new BABYLON.Vector3(-Math.PI/2, Math.acos(normalizedVector.x) - Math.PI / 2, 0);
            }else {
                this.mesh.rotation = new BABYLON.Vector3(-Math.PI/2, -Math.acos(normalizedVector.x) - Math.PI / 2, 0);
            }
        }
    }

}
export default Enemy;