import Entity from './Entity';
import BABYLON from './../node_modules/babylonjs/babylon';

class Enemy extends Entity {
    constructor(positionVector, scene) {
        super(2, new BABYLON.Vector3(0, 0, 0), 'pizza');
        this.mesh = BABYLON.MeshBuilder.CreateBox('enemy', {width:5, height:5, depth:5}, scene);
        this.scene = scene;
        this.setPosition(positionVector);
        this.viewDistance = 50
        this.waklingForce = 2;


    }

    update(fps, collisionHandler, solidObjectList, player) {
        super.update(fps, collisionHandler, solidObjectList);
        if(BABYLON.Vector3.Distance(this.getPosition(), player.getPosition()) < this.viewDistance) {
            var normalizedVector = BABYLON.Vector3.Normalize(player.getPosition().subtract(this.getPosition()));
            this.applyForce(normalizedVector.multiplyByFloats(this.waklingForce, this.waklingForce, this.waklingForce));
        }
    }

}
export default Enemy;