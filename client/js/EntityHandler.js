import Player from './../../imports/Player';
import Enemy from './../../imports/Enemy';
import Projectile from './../../imports/Projectile';
import SolidObject from './../../imports/SolidObject';
import BABYLON from './../../node_modules/babylonjs/babylon';
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
            FREE_CAMERA: 70,

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
        this.addEntity(this.player);
        this.addSolidObject(new SolidObject(new BABYLON.Vector3(0, 0, 0), 200, 5, 200, scene));





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

        //Add enemies:
        this.addEntity(new Enemy(new BABYLON.Vector3(100,5,0), this.scene));


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
            var directionVector = this.player.getDirectionVector();
            var playerPosition = this.player.getPosition();
            var ballPosition = new BABYLON.Vector3(playerPosition.x, this.player.mesh.getBoundingInfo().boundingBox.center.y, playerPosition.z);
            var projectile = new Projectile(ballPosition, directionVector, this.scene, 'pizzaid');
            this.addEntity(projectile); //todo client side cration of projectiles?
            //Meteor.call('addProjectile', projectile.velocity, projectile.getPosition());
        }


        if(!this.keyboard.isDown(this.keyboard.FREE_CAMERA)) {
            this.player.updateDirectionVector();
            var directionVector = this.player.getDirectionVector();


            var dDirectionVector = new BABYLON.Vector2(directionVector.x, directionVector.z);
            if(dDirectionVector.y < 0 ) {
                this.player.mesh.rotation = new BABYLON.Vector3(0, Math.acos(dDirectionVector.x/dDirectionVector.length()) - Math.PI / 2, 0);
            }else {
                this.player.mesh.rotation = new BABYLON.Vector3(0, -Math.acos(dDirectionVector.x/dDirectionVector.length()) - Math.PI / 2, 0);
            }
        }else {
            console.log(this.player.mesh.getBoundingInfo().boundingBox);
        }

        //-------------
        // TODO Implement game ticks, will make it work with servers
        //------------



        document.getElementById('velocity').innerHTML = this.player.velocity;


        console.log(this.entityList.length);
        for(var i = this.entityList.length - 1; i > -1; i--) {
            var entity = this.entityList[i];
            if(!entity.isAlive) {
                this.entityList.splice(i, 1);
            }else {
                entity.applyAcceleration(new BABYLON.Vector3(0, -9.82 / fps, 0));
                if(entity instanceof Enemy) {
                    entity.update(fps, this.collisionHandler, this.solidObjectList, this.player);
                }else if(entity instanceof Projectile) {
                    entity.update(fps, this.collisionHandler, this.solidObjectList, this.entityList);
                }else {
                    entity.update(fps, this.collisionHandler, this.solidObjectList);
                }
            }
        }
    }
}





export default EntityHandler;