import Entity from './Entity';
import BABYLONN from './babylonmath';

class Projectile extends Entity {
    constructor(positionVector, directionVector, scene, _id) {
        super(5, directionVector.multiplyByFloats(100, 100, 100), _id);
        if(Meteor.isClient) {
            this.mesh = BABYLON.Mesh.CreateSphere("Projectile" + Math.random(), 16, 1, scene);
        }
        this.diameter = 1;
        this.setPosition(positionVector);
    }
    getBoundingBox() {
        if(Meteor.isServer) {
            return {min: this.getPosition().subtract(new BABYLONN.Vector3(this.diameter/2, this.diameter/2, this.diameter/2)), max: this.getPosition().add(new BABYLONN.Vector3(this.diameter/2, this.diameter/2, this.diameter/2))}
        }
        return {min: this.getPosition().subtract(new BABYLON.Vector3(this.diameter/2, this.diameter/2, this.diameter/2)), max: this.getPosition().add(new BABYLON.Vector3(this.diameter/2, this.diameter/2, this.diameter/2))}
    }
}
export default Projectile;