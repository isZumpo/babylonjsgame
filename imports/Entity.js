import BABYLON from './babylonmath';
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
            return this.mesh.getBoundingInfo().boundingBox;
        }


    }
    update(fps, collisionHandler, solidObjectList) {
        var fpsTime = 1 / fps;
        let minMax = this.getBoundingBox();
        ////console.log(this);
        if(collisionHandler.collisionEntitySolidCheck(minMax, solidObjectList, fps)) {
            /*
            let newVelocity = this.velocity;
            newVelocity.y = 0;
            newVelocity.x *= 0.95;
            newVelocity.z *=0.95;

            if(Math.abs(newVelocity.x) < 0.01) {
                newVelocity.x = 0;
            }

            if(Math.abs(newVelocity.z) < 0.01) {
                newVelocity.z = 0;
            }
            this.velocity = newVelocity;

            */

            /*
            minMax.min.subtract(this.velocity.multiplyByFloats(fpsTime, fpsTime, fpsTime));
            minMax.max.subtract(this.velocity.multiplyByFloats(fpsTime, fpsTime, fpsTime));

            for(var i = 1; i < 10; i++) {
                minMax.min.add(this.velocity.multiplyByFloats(fpsTime / 10, fpsTime / 10, fpsTime / 10));
                minMax.max.add(this.velocity.multiplyByFloats(fpsTime / 10, fpsTime / 10, fpsTime / 10));
                if(collisionHandler.collisionEntitySolidCheck(minMax, solidObjectList, fps)) {
                    var newPosition = this.getPosition().subtract(this.velocity.multiplyByFloats(fpsTime, fpsTime, fpsTime)).add(this.velocity.multiplyByFloats(fpsTime / 10 * (i - 1), fpsTime / 10 * (i - 1), fpsTime / 10 * (i - 1)));
                    this.setPosition(newPosition);
                    console.log("Yay");
                }

            }
            */
            //this.velocity = new BABYLON.Vector3(0,0,0);
        //
        //
        //    //let distance = this.velocity.multiplyByFloats(fpsTime, fpsTime, fpsTime);
        //    //let splitDistance = distance.multiplyByFloats(1/20, 1/20, 1/20);
        //    //for(let i = 0; i <= 20; i++) {
        //    //    let checkDistance = splitDistance.multiplyByFloats(i, i, i);
        //    //    let newMinMax = {min: minMax.min.subtract(checkDistance), max: minMax.max.subtract(checkDistance)};
        //    //    if(!collisionHandler.collisionEntitySolidCheck(newMinMax, solidObjectList, fps)) {
        //    //        this.velocity = this.velocity.subtract(checkDistance);
        //    //        console.log('Tsasd');
        //    //        this.setPosition(this.getPosition().add(this.velocity.multiplyByFloats(fpsTime, fpsTime, fpsTime)));
        //    //        break;
        //    //    }
        //    //}
        //}else {
        //    //console.log('Not collision!!');
        //    //this.setPosition(this.getPosition().add(this.velocity.multiplyByFloats(fpsTime, fpsTime, fpsTime)));
        }
        //console.log(this);
        this.setPosition(this.getPosition().add(this.velocity.multiplyByFloats(fpsTime, fpsTime, fpsTime)));



    }

}
export default Entity;