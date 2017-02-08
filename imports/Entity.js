import BABYLON from './../node_modules/babylonjs/babylon';
class Entity {
    constructor(mass, velocityVector, _id) {
        if(velocityVector == 0) {
            this.velocity = new BABYLON.Vector3(0, 0, 0);
        }else {
            this.velocity = velocityVector;
        }
        this.mass = mass;
        this.mesh = {};
        this._id = _id;
        this.isAlive = true;
    }

    applyForce(force) {
        const massConst = 1 / this.mass;
        this.velocity = this.velocity.add((force.multiplyByFloats(massConst, massConst, massConst))); // a = F / m
    }
    applyAcceleration(acceleration) {
        this.velocity = this.velocity.add(acceleration);
    }
    getPosition() {
        return this.mesh.position;
    }
    setPosition(position) {
        this.mesh.position = position;
    }
    setVelocity(velocity) {
        this.velocity = velocity;
    }
    getVelocity() {
        return this.velocity;
    }
    getBoundingBox() {
        if(Meteor.isServer) {

        }
        if(Meteor.isClient) {
            return {min: this.mesh.getBoundingInfo().boundingBox.minimumWorld, max: this.mesh.getBoundingInfo().boundingBox.maximumWorld}
        }
    }

    kill() {
        try {
            this.mesh.dispose();
            this.isAlive = false;
        } catch(error) {
        //    Ignore error when not loaded enemy spawns in front of player
        }
    }

    update(fps, collisionHandler, solidObjectList) {
        var fpsTime = 1 / fps;
        let minMax = this.getBoundingBox();
        let currentVelocity = this.velocity.multiplyByFloats(fpsTime, fpsTime, fpsTime);
        minMax.min = minMax.min.add(currentVelocity);
        minMax.max = minMax.max.add(currentVelocity);
        console.log(minMax);
        var collisionCheck = collisionHandler.collisionEntitySolidCheck(minMax, solidObjectList, fps)
        if(collisionCheck.isCollision) {
            let newVelocity = this.velocity;
            newVelocity.y = 0;
            newVelocity.x *= 0.95;
            newVelocity.z *=0.95;

            //this.mesh.position.y = collisionCheck.solidObjectList[0].getBoundingBox().max.y;

            if(Math.abs(newVelocity.x) < 0.01) {
                newVelocity.x = 0;
            }

            if(Math.abs(newVelocity.z) < 0.01) {
                newVelocity.z = 0;
            }
            this.velocity = newVelocity;
        }
        this.setPosition(this.getPosition().add(this.velocity.multiplyByFloats(fpsTime, fpsTime, fpsTime)));



    }

}
export default Entity;