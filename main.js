var physicsWorld, scene, camera,shadowGenerator, rigidBodies = []
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
  var light = new BABYLON.DirectionalLight("AUmbiance", new BABYLON.Vector3(-2, -2, -1), scene);
  light.position = new BABYLON.Vector3( 100 ,100 ,50);
  light.intensity=4;
  //light produces shadows 
  shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
  //Adding an Arc Rotate Camera
  camera = new BABYLON.ArcRotateCamera("camera", -Math.PI , Math.PI , 3, null,scene);
  camera.attachControl(canvas, true);
  camera.lowerBetaLimit = 0;
  camera.upperBetaLimit = Math.PI/2;
  camera.lowerRadiusLimit = 2;
  camera.upperRadiusLimit = 2000;
  
}

function createWorld(){
  createPlayer();
  //createGround();
  //createPlane();

  scene.onKeyboardObservable.add((kbInfo) => {
    if(kbInfo.event.code =="Space"){
      if(kbInfo.type == 1 ){
        //console.log(kbInfo);
        p = scene.getNodeByID("player");
      //  dis=p.position;
      //  len=dis.length()/4;
       // dis.x/=len;
       // dis.y/=len;
       // dis.z/=len;
        
        //console.log(camera.alpha % Math.PI);
       p.applyImpulse(
          new BABYLON.Vector3(6,6,6) ,
         p.getAbsolutePosition()
          
        );
      } 
    }   
  });
  
  
  //Assets Loding
  var assetsManager = new BABYLON.AssetsManager(scene);
  var meshTask = assetsManager.addMeshTask("loadPlane", "", "", "Terrain.babylon");
 /* 
  meshTask.onSuccess = function (task) { 
  }
  meshTask.onProgress = function (task) {
  }*/
  //All assets loaded well
  assetsManager.onFinish = function (task) {
    grd = scene.getNodeByID("Plane");
    console.log(scene);
    grd.physicsImpostor= new BABYLON.PhysicsImpostor(grd, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, restitution: 0.05 ,friction: 1}, scene);
    console.log(grd);
  };
  assetsManager.load();
}

function createPlayer(){
  //Creating Player
  const player = BABYLON.MeshBuilder.CreateBox("player",{height: 1, width: 0.75, depth: 0.25}, scene);
  player.position = new BABYLON.Vector3(60, 40 ,60);
 
  
  //Camera stays on top of Player
  camera.position = player.position.add(new BABYLON.Vector3(2 ,2,2));
  camera.setTarget(player);
  //player cast shadows
  shadowGenerator.addShadowCaster(player);
  player.receiveShadows=true;
  //physics
  player.physicsImpostor= new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.5, friction: 0.5}, scene);
  return player;
}

var delT=0,delTsec=1;
function renderFrame(){
  engine.runRenderLoop(function () {
    
    delT+=0.001;
    if(delT>delTsec){
      delTsec=Math.ceil(delT); 
    }


    scene.render();    
 });
}



function createGround(){
  //Creating Ground Mesh
  const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("ground", "map.jpeg", {width:200, height :100, subdivisions: 700, maxHeight: 3},scene);
  //Creating ground material
  const largeGroundMat = new BABYLON.StandardMaterial("largeGroundMat");

  largeGroundMat.diffuseTexture = new BABYLON.Texture("map.jpeg", scene);
  largeGroundMat.specularTexture = new BABYLON.Texture("map.jpeg", scene);
  largeGroundMat.emissiveTexture = new BABYLON.Texture("map.jpeg", scene);
  largeGroundMat.ambientTexture = new BABYLON.Texture("map.jpeg", scene);

  largeGroundMat.diffuseTexture = new BABYLON.Texture("map.jpeg");
  //largeGroundMat.diffuseTexture.uScale= 3;
  //largeGroundMat.diffuseTexture.vScale= 3;
  ground.material = largeGroundMat;
  ground.receiveShadows = true;
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.HeightmapImpostor,{ mass: 0, restitution: 0.3,friction: 0.5 }, scene);
  return ground;
}
function createPlane(){
  const plane = new BABYLON.MeshBuilder.CreateBox("plane",  {width:20, depth: 10, height:0.1},scene);
  plane.position = new BABYLON.Vector3(60 , 35,60 );
  shadowGenerator.addShadowCaster(plane);
  plane.receiveShadows= true;
  plane.physicsImpostor= new BABYLON.PhysicsImpostor(plane, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.05 ,friction: 0.5}, scene);
  return plane;
}
