import BABYLON from './../imports/babylonmath';
import Projectile from './../imports/Projectile';
import CollisionHandler from './../imports/CollisionHandler';
import SolidObject from './../imports/SolidObject';
//import BABYLON from 'babylonjs';

var entityList = [];
var solidObjectList = [];
var collisionHandler = new CollisionHandler();

solidObjectList.push(new SolidObject(new BABYLON.Vector3(0, 0, 0), 5, 5, 5, 0));

Meteor.methods({
    'addProjectile': function(velocity, position) {
        var _id = Entities.insert({type: 'projectile', velocity: velocity, position: position});
        var projectile = new Projectile(new BABYLON.Vector3(position.x, position.y, position.z), new BABYLON.Vector3(0,0,0), 0, _id);
        projectile.setVelocity(new BABYLON.Vector3(velocity.x, velocity.y, velocity.z));
        entityList.push(projectile);

    },
    'addForce': function(force, _id) {

    }
});

Meteor.startup(function() {
    //Meteor.setInterval(function(){
        //console.log(new Date());
        //entityList.forEach(function(entity) {

            //entity.update(20, collisionHandler, solidObjectList);
            //Entities.update({_id: entity._id}, {$set: {velocity: entity.getVelocity(), position: entity.getPosition()}});
        //});
    //}, 1000/20);
});

