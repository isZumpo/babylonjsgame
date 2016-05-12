import Player from './../../imports/Player';
import Projectile from './../../imports/Projectile';
import SolidObject from './../../imports/SolidObject';
import CollisionHandler from './../../imports/CollisionHandler';
class EntityHandler {
    constructor(gameId, scene, camera) {
        this.gameId = gameId;
        this.player = new Player(new BABYLON.Vector3(0,100,0), 'Pizza', scene, camera, 'testID');
        camera.target = this.player.getPosition();
        this.entityList = [];
        this.scene = scene;
        this.camera = camera;
        this.solidObjectList = [];
        this.collisionHandler = new CollisionHandler();
        var Key = {
            _pressed: {},
            _hasBeenPressed: {},

            LEFT: 65,
            UP: 87,
            RIGHT: 68,
            DOWN: 83,
            SPACE: 32,

            isDown: function(keyCode) {
                return this._pressed[keyCode];
            },

            hasBeenPressed: function (keyCode) {
                if(this._hasBeenPressed[keyCode] && !this._pressed[keyCode]) {
                    delete this._hasBeenPressed[keyCode];
                    return true;
                }
                return false;
            },

            onKeydown: function(event) {
                this._pressed[event.keyCode] = true;
                this._hasBeenPressed[event.keyCode] = true;
            },

            onKeyup: function(event) {
                delete this._pressed[event.keyCode];
            }
        };
        this.keyboard = Key;
        
        window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
        window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
        /*function keyBoardpress(event) {
            switch (event.keyCode) {
                //Camera
                case 65 : //'A'
                    var radius = 1 / camera.radius;
                    var directionVector = this.player.getDirectionVector();
                    var matrix = BABYLON.Matrix.RotationAxis(BABYLON.Axis.Y, -Math.PI / 2);
                    var v2 = BABYLON.Vector3.TransformCoordinates(directionVector, matrix);
                    var force = this.player.mass*1.5;
                    this.player.applyForce(v2.multiplyByFloats(force, force, force));
                    break;
                case 83 : //'S'
                    var radius = 1 / camera.radius;
                    var directionVector = this.player.getDirectionVector();
                    var force = -100;
                    this.player.applyForce(directionVector.multiplyByFloats(force, force, force));
                    break;
                case 68 : //'D'
                    var radius = 1 / camera.radius;
                    var directionVector = this.player.getDirectionVector();
                    var matrix = BABYLON.Matrix.RotationAxis(BABYLON.Axis.Y, Math.PI / 2);
                    var v2 = BABYLON.Vector3.TransformCoordinates(directionVector, matrix);
                    var force = this.player.mass*1.5;
                    this.player.applyForce(v2.multiplyByFloats(force, force, force));
                    break;
                case 87 : //'W'
                    var radius = 1 / camera.radius;
                    var directionVector = this.player.getDirectionVector();
                    var force = this.player.mass*1.5; //http://www.schoolphysics.co.uk/age16-19/Medical%20physics/text/Walking_/index.html
                    //
                    //var dDirectionVector = new BABYLON.Vector2(directionVector.x, directionVector.z);
                    //if(dDirectionVector.y < 0 ) {
                    //    this.player.mesh.rotation = new BABYLON.Vector3(0, Math.acos(dDirectionVector.x/dDirectionVector.length()) - Math.PI / 2, 0);
                    //}else {
                    //    this.player.mesh.rotation = new BABYLON.Vector3(0, -Math.acos(dDirectionVector.x/dDirectionVector.length()) - Math.PI / 2, 0);
                    //}
                    //console.log(this.player.mesh.rotation.y / (2 * Math.PI) * 360);

                    this.player.applyForce(directionVector.multiplyByFloats(force, force, force));
                    break;
                case 32: //Space
                    var radius = 1 / camera.radius;
                    var directionVector = this.player.getDirectionVector();
                    var playerPosition = this.player.getPosition();
                    var ballPosition = new BABYLON.Vector3(playerPosition.x,playerPosition.y,playerPosition.z);
                    ballPosition.y += 2;
                    var projectile = new Projectile(ballPosition, directionVector, scene, 'pizzaid');
                    //this.addEntity(projectile); todo client side cration of projectiles?
                    Meteor.call('addProjectile', projectile.velocity, projectile.getPosition());
                    break;
            }
        }
        window.addEventListener("keydown", keyBoardpress.bind(this));
        */
        this.addEntity(this.player);
        this.addSolidObject(new SolidObject(new BABYLON.Vector3(0, 0, 0), 30, 5, 30, scene));





        function testEntityAdd(_id, fields) {
            var projectile = new Projectile(new BABYLON.Vector3(fields.position.x, fields.position.y, fields.position.z), new BABYLON.Vector3(1, 1, 1), self.scene, _id);
            projectile.velocity = new BABYLON.Vector3(fields.velocity.x, fields.velocity.y, fields.velocity.z);
            //projectile.setPosition()
            self.addEntity(projectile);
        }
        var self = this;
        Entities.find().observeChanges({
            added: function(_id, fields){

                //console.log(fields.position.x);
                testEntityAdd(_id, fields);

                //this.addEntity(projectile);
            },
            changed: function (_id, fields) {
                console.log('CHANGED!!');
                self.entityList.forEach(function(entity) {
                    if(entity._id == _id) {
                        console.log(fields);
                        if(typeof fields.velocity !== 'undefined') {
                            entity.setVelocity(new BABYLON.Vector3(fields.velocity.x, fields.velocity.y, fields.velocity.z));
                        }
                        if(typeof fields.position !== 'undefined') {
                            entity.setPosition(new BABYLON.Vector3(fields.position.x, fields.position.y, fields.position.z));
                        }


                    }
                });
            }
        });

    }
    addEntity(entity) {
        this.entityList.push(entity);
    }
    addSolidObject(solidObject) {
        this.solidObjectList.push(solidObject);
    }
    update(fps) {
                //Camera
        if(this.keyboard.isDown(this.keyboard.LEFT)) {
            var directionVector = this.player.getDirectionVector();
            var matrix = BABYLON.Matrix.RotationAxis(BABYLON.Axis.Y, -Math.PI / 2);
            var v2 = BABYLON.Vector3.TransformCoordinates(directionVector, matrix);
            var force = this.player.mass*1.5;
            this.player.applyForce(v2.multiplyByFloats(force, force, force));
        }
        if(this.keyboard.isDown(this.keyboard.RIGHT)) {
            var directionVector = this.player.getDirectionVector();
            var matrix = BABYLON.Matrix.RotationAxis(BABYLON.Axis.Y, Math.PI / 2);
            var v2 = BABYLON.Vector3.TransformCoordinates(directionVector, matrix);
            var force = this.player.mass*1.5;
            this.player.applyForce(v2.multiplyByFloats(force, force, force));
        }
        if(this.keyboard.isDown(this.keyboard.DOWN)) {
            var directionVector = this.player.getDirectionVector();
            var force = -100;
            this.player.applyForce(directionVector.multiplyByFloats(force, force, force));
        }
        if(this.keyboard.isDown(this.keyboard.UP)) {
            var directionVector = this.player.getDirectionVector();
            var force = this.player.mass*1.5; //http://www.schoolphysics.co.uk/age16-19/Medical%20physics/text/Walking_/index.html
            this.player.applyForce(directionVector.multiplyByFloats(force, force, force));
            //
        }
        if(this.keyboard.hasBeenPressed(this.keyboard.SPACE)) {
            var radius = 1 / this.camera.radius;
            var directionVector = this.player.getDirectionVector();
            var playerPosition = this.player.getPosition();
            var ballPosition = new BABYLON.Vector3(playerPosition.x,playerPosition.y,playerPosition.z);
            ballPosition.y += 2;
            var projectile = new Projectile(ballPosition, directionVector, this.scene, 'pizzaid');
            //this.addEntity(projectile); todo client side cration of projectiles?
            Meteor.call('addProjectile', projectile.velocity, projectile.getPosition());
        }


        var radius = 1 / this.camera.radius;
        var directionVector = this.player.getDirectionVector();

        var dDirectionVector = new BABYLON.Vector2(directionVector.x, directionVector.z);
        if(dDirectionVector.y < 0 ) {
            this.player.mesh.rotation = new BABYLON.Vector3(0, Math.acos(dDirectionVector.x/dDirectionVector.length()) - Math.PI / 2, 0);
        }else {
            this.player.mesh.rotation = new BABYLON.Vector3(0, -Math.acos(dDirectionVector.x/dDirectionVector.length()) - Math.PI / 2, 0);
        }
        //console.log(this.player.mesh.rotation.y / (2 * Math.PI) * 360);
        //console.log(this.entityList);
        //-------------
        // TODO Implement game ticks, will make it work with servers
        //------------
        document.getElementById('velocity').innerHTML = this.player.velocity;
        //console.log(deltaTime);
        //this.player.update(fps, this.collisionHandler, this.solidObjectList);
        this.entityList.forEach(function(entity) {
            entity.applyAcceleration(new BABYLON.Vector3(0, -9.82 / fps, 0));
            entity.update(fps, this.collisionHandler, this.solidObjectList);
        }, this);
    }
}





export default EntityHandler;