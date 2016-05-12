class SolidObject {
    constructor(position, width, height, depth, scene) {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.mesh = {};
        if(Meteor.isClient) {
            this.mesh = BABYLON.Mesh.CreateBox('box', {width, height, depth}, scene);
            var ground = new BABYLON.StandardMaterial("ground", scene);
            var texture = new BABYLON.Texture("assets/ground.jpg", scene);
            texture.uScale = 40;
            texture.vScale = 2;
            ground.diffuseTexture = texture;
            this.mesh.material = ground;
        }
        this.mesh.position = position;

    }
    getPosition() {
        return this.mesh.position;
    }
    getBoundingBox() {
        //if(Meteor.isClient) {
        //    return this.mesh.getBoundingInfo().boundingBox;
        //}
        return {min: this.getPosition().subtract(new BABYLON.Vector3(this.width/2, this.height/2, this.depth/2)), max: this.getPosition().add(new BABYLON.Vector3(this.width/2, this.height/2, this.depth/2))}

    }
}
export default SolidObject;