import BABYLON from './../node_modules/babylonjs/babylon';

class SolidObject {
    constructor(position, width, height, depth, scene) {
        console.log({position, width, height, depth, scene});
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.mesh = {};
        if(Meteor.isClient) {
            this.mesh = BABYLON.MeshBuilder.CreateBox('box', {width, height, depth}, scene);
            var ground = new BABYLON.StandardMaterial("ground", scene);
            var texture = new BABYLON.Texture("assets/ground.jpg", scene);
            texture.uScale = 40;
            texture.vScale = 2;
            ground.diffuseTexture = texture;
            this.mesh.material = ground;
        }
        this.mesh.position = position;
        console.log(this.mesh.getBoundingInfo());

    }
    getPosition() {
        return this.mesh.position;
    }
    getBoundingBox() {
        return {min: this.mesh.getBoundingInfo().boundingBox.minimumWorld, max: this.mesh.getBoundingInfo().boundingBox.maximumWorld}

    }
}
export default SolidObject;