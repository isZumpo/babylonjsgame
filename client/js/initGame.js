import EntityHandler from './EntityHandler';
import BABYLON from 'babylonjs';


//http://buildnewgames.com/gamephysics/
//https://youtu.be/Iu6nAXFm2Wo

Template.game.onRendered(function() {
    //console.log(OIMO);
    createScene();
});

var canvas, engine, scene, camera = 0;
var entityHandler;


function createScene() {
    console.log('test!');
    if(!Meteor.userId) {
        console.log('Not logged in!');
    }
    // Get canvas
    canvas = document.getElementById("renderCanvas");

    // Create babylon engine
    engine = new BABYLON.Engine(canvas, true);

    // Create scene
    scene = new BABYLON.Scene(engine);
    //scene.enablePhysics(new BABYLON.Vector3(0,-10,0), new BABYLON.OimoJSPlugin());



    // Create the camera
    camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 5, new BABYLON.Vector3(0,4,-10), scene);

    //box = new BABYLON.Mesh.CreateBox("box", 200, scene);
    //camera.setTarget(new BABYLON.Vector3(0,0,10));
    camera.attachControl(canvas);


    // Create light
    var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0,100, -20), scene);



    entityHandler = new EntityHandler(5, scene, camera);
    //player  = new Player(new BABYLON.Vector3(0,4,-10), 'Pizza', scene);
    //player.hit(10);


    engine.runRenderLoop(function () {
        scene.render();
        document.getElementById('fps').innerHTML = engine.fps;

        //Not sure if this is the right delta time
        entityHandler.update(engine.fps);
        //entityHandler.update(scene.getRenderDuration());
    });


    var skybox = BABYLON.Mesh.CreateBox("skyBox", 10000.0, scene);

// The sky creation


    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/cubemap/cubemap", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

    skybox.material = skyboxMaterial;


    // The function ImportMesh will import our custom model in the scene given in parameter


};