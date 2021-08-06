var physicsWorld, scene, camera,shadowGenerator1,shadowGenerator2;
var canvas = document.getElementById("canvas");
var engine = new BABYLON.Engine(canvas,true,null,true);
scene = new BABYLON.Scene(engine);
//Ammo().then(scene=> );

//Handeling Screen Resizing
window.addEventListener("resize", function () {
  engine.resize();
});


scene.enablePhysics(new BABYLON.Vector3(0,-9.81, 0), new BABYLON.AmmoJSPlugin());


createScene();
createWorld();
renderFrame();

function createScene(){
  //Adding a light
  var light = new BABYLON.DirectionalLight("AUmbiance1", new BABYLON.Vector3(-2, -2, -1), scene);
  light.position = new BABYLON.Vector3( 100 ,100 ,50);
  light.intensity=1;

  var light2 = new BABYLON.DirectionalLight("AUmbiance2", new BABYLON.Vector3(2, -2, 1), scene);
  light2.position = new BABYLON.Vector3( -100 ,100 ,-50);
  light2.intensity=2;

  //light produces shadows 
  shadowGenerator1 = new BABYLON.ShadowGenerator(512, light);
  shadowGenerator1.usePoissonSampling = true;
  shadowGenerator2 = new BABYLON.ShadowGenerator(512, light2);
  shadowGenerator2.usePoissonSampling = true;
  //Adding an Arc Rotate Camera
  camera = new BABYLON.ArcRotateCamera("camera", -Math.PI , Math.PI , 3, null,scene);
  camera.attachControl(canvas, true);
  camera.lowerBetaLimit = 0;
  camera.upperBetaLimit = Math.PI/2;
  camera.lowerRadiusLimit = 2;
  camera.upperRadiusLimit = 2000;
  


  
  //Assets Loding
  var assetsManager = new BABYLON.AssetsManager(scene);
  var meshTask = assetsManager.addMeshTask("Terrain", "", "", "./bin/Terrain.babylon");
 /* 
  meshTask.onSuccess = function (task) { 
  }
  meshTask.onProgress = function (task) {
  }*/
  //All assets loaded well
  assetsManager.onFinish = function (task) {
    console.log(scene.meshes);
    grd = scene.getNodeByID("Terrain");
    grd.physicsImpostor= new BABYLON.PhysicsImpostor(grd, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, restitution: 0.05 ,friction: 1}, scene);
    
    grd.receiveShadows=true;
  };
  assetsManager.load();
}

function createPlayer(){
  //Creating Player
  const player = BABYLON.MeshBuilder.CreateBox("player",{height: 1, width: 0.75, depth: 0.25}, scene);
  player.position = new BABYLON.Vector3(60, 40 ,60);
 //First person camera box
  const cameraTargetMesh = BABYLON.MeshBuilder.CreateBox('box', { height: 2 }, scene);        
  cameraTargetMesh.visibility = 0;
  cameraTargetMesh.setParent(player);
  cameraTargetMesh.position = new BABYLON.Vector3(0, 0, 1);
 
  
  //Camera stays on top of Player
  camera.position = player.position.add(new BABYLON.Vector3(2 ,2,2));
  camera.setTarget(player);
  //player cast shadows
  shadowGenerator1.addShadowCaster(player);
  shadowGenerator2.addShadowCaster(player);
  player.receiveShadows=true;
  //physics
  player.physicsImpostor= new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.5, friction: 1}, scene);
  return player;
}

var delT=0,delTsec=1;
function renderFrame(){
  engine.runRenderLoop(function () {
    
    delT+=0.001;
    if(delT>delTsec){
      delTsec=Math.ceil(delT); 
    }

    //scene.getNodeByID("player")
    scene.render();    
 });
}


/*
function createPlane(){
  const plane = new BABYLON.MeshBuilder.CreateBox("plane",  {width:20, depth: 10, height:0.1},scene);
  plane.position = new BABYLON.Vector3(60 , 35,60 );
  shadowGenerator1.addShadowCaster(plane);
  plane.receiveShadows= true;
  plane.physicsImpostor= new BABYLON.PhysicsImpostor(plane, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.05 ,friction: 0.5}, scene);
  return plane;
}*/

function createWorld() {
  createPlayer();
  

  scene.onKeyboardObservable.add((kbInfo) => {
    if(kbInfo.event.code =="Space"){
      if(kbInfo.type == 1 ){
        //console.log(kbInfo);
        p = scene.getNodeByID("player");
     
       p.applyImpulse(
          new BABYLON.Vector3(-6,6,-6) ,
         p.getAbsolutePosition()
          
        );
      } 
    }   

});
}
  