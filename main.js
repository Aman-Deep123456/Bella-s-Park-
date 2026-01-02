import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/loaders/GLTFLoader.js";
import { Octree } from 'three/addons/math/Octree.js';
import { Capsule } from 'three/addons/math/Capsule.js';
import { Vector3 } from "https://cdn.jsdelivr.net/npm/three@0.159.0/build/three.module.js";

// GSAP library visit for animation to 3d model 
// Canvas
const canvas = document.getElementById("experience-canvas");
// raycaster 
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// Scene
const scene = new THREE.Scene();

// objects array 
let  intersectObject=" "
const intersectObjects=[];
const intersectObjectsNames = [
  "Project",
  "Project3",
  "Project2",
  "chest"
];

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const aspect = sizes.width / sizes.height;

// Graviy and physics 

 const gravity = 30 ;
 const capsuleRadius = 0.35;
 const capsuleHeight = 1 ;
 const jumpHeight = 10 ;
 const moveSpeed = 4;
 let targetRotation = 0; 
 
 // character moving 
let character = {
  instance :  null , 
  isMoving:false,
  spawnPosition : new THREE.Vector3()
}

const colliderOctree = new Octree();
const playerCollider = new Capsule(
  new THREE.Vector3(0,capsuleRadius,0),
  new THREE.Vector3(0,capsuleHeight,0),
  capsuleRadius
);

let playerOnFloor = false ;
let playerVelociy = new THREE.Vector3();
// Orthographic Camera
const camera = new THREE.OrthographicCamera(
  -aspect * 30,
   aspect * 30,
   30,
  -30,
  -100,
   1000,
);
camera.position.set(100,70,-70);
camera.lookAt(0, 0, 0);
scene.add(camera);
camera.zoom = 1.5 ;
camera.updateProjectionMatrix(); 

const cameraOffset = new THREE.Vector3(50,50,0)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2;


// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableRotate = false;
controls.enableZoom = true;
controls.enablePan = true;
// DIRECTIONAL LIGHT (SUN)
const sun = new THREE.DirectionalLight(0xffffff, 4);
sun.position.set(75,80,0);
sun.target.position.set(75, 0, 0);
sun.castShadow = true;

// Shadow camera (CRITICAL)
sun.shadow.camera.left   = -100;
sun.shadow.mapSize.width = 4096;
sun.shadow.mapSize.height = 4096;
sun.shadow.camera.right  =  100;
sun.shadow.camera.top    =  100;
sun.shadow.camera.bottom = -100;
sun.shadow.camera.near   =  1;
sun.shadow.camera.far    =  300;
sun.shadow.normalBias = 0.2;
// Shadow quality
sun.shadow.mapSize.set(2048, 2048);

// Light direction
sun.target.position.set(0, 0, 0);
scene.add(sun.target);
scene.add(sun);

// Ambient light (low intensity, not killing shadows)
const ambient = new THREE.AmbientLight(0x404040, 1);
scene.add(ambient);

// GLTF Loader
const loader = new GLTFLoader();
loader.load(
  "./portfolio.glb",
  function(glb)  {
    glb.scene.traverse((child) => {
      if (intersectObjectsNames.includes(child.name)){
        intersectObjects.push(child);
      }
      if (child.isMesh) {
        child.castShadow = true;    // mesh casts shadow
        child.receiveShadow = true; // mesh receives shadow
      }
      if ( child.name == "Boots"){
        character.spawnPosition.copy(child.position)
        character.instance = child ; 
        playerCollider.start 
        .copy(child.position)
        .add(new THREE.Vector3(0,capsuleRadius,0));

        playerCollider.end 
        .copy(child.position)
        .add(new THREE.Vector3(0,capsuleHeight,0));
      
      }
      
      if ( child.name == "GroundCollider"){
         colliderOctree.fromGraphNode(child);
         child.visible = false ; 
      }
      console.log(child)
    });
    scene.add(glb.scene);
  },
  undefined,
  (error) => console.error(error)
);

// Resize orthographic 

 function  onResize(){
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  const aspect = sizes.width / sizes.height;
  camera.left   = -aspect * 30;
  camera.right  =  aspect * 30;
  camera.top    =  30;
  camera.bottom = -30;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function onPointerMove (event ){
  pointer.x = (event.clientX/window.innerWidth)*2-1;
  
  pointer.y = -(event.clientY/window.innerHeight)*2+1;
}
function onClick(){
   if ( intersectObject!==""){
    showModal(intersectObject)

   }     
}
// respawning 

function respawnCharacter(){
  character.instance.position.copy(character.spawnPosition);
  playerCollider.start
  .copy(character.spawnPosition)
  .add(new THREE.Vector3(0,capsuleRadius,0));
  playerCollider.end
  .copy(character.spawnPosition)
  .add(new THREE.Vector3(0,capsuleHeight,0));
  
  playerVelociy.set(0,0,0);
  character.isMoving = false ; 

}
window . addEventListener("pointermove",onPointerMove);
window.addEventListener("click",onClick);
window.addEventListener("resize", onResize);
window.addEventListener("keydown", onKeyDown);
//modalExitButton.addEventListener("click", hideModal);
// mouse to pointer 

// function moveCharacter(targetPosition,targetRotation){
//     character.isMoving = true ; 
//     let rotationDiff = ((((targetRotation - character.instance.rotation.y)%(2*Math.PI))+
//     3*Math.PI) % 
//     (2*Math.PI))-
//     Math.PI;
//  let finalRotation = character.instance.rotation.y + rotationDiff;

//    const t1 = gsap.timeline({
//       onComplete : () => {
//         character.isMoving = false ;
//       },
//       });
//    t1.to(character.instance.position,{
//     x:targetPosition.x,
//     z:targetPosition.z,
//     duration : character.moveDuration,
//    }); 

//     t1.to(character.instance.rotation,{
//     y:finalRotation,
//     duration : character.moveDuration,
//    },
//    0
//   ); 
//  // jump 
//     t1.to(character.instance.position,{
//     y:character.instance.position.y+ character.jumpHeight,
//     duration : character.moveDuration/2,
//     yoyo : true ,
//     repeat : 1 , 
//    },
//    0
//   ); 
  
  
// }


function onKeyDown(event){
   if ( character.isMoving ) return ; 
   //const targetPosition = new THREE.Vector3().copy(character.instance.position);
   if ( event .key.toLowerCase()==="r"){
    respawnCharacter()
    return ; 
   }
  switch(event.key.toLowerCase()){
    case "w":
      case "arrowup" :
    playerVelociy.z+=moveSpeed;
    targetRotation=0;
      break;

    case "s":
      case "arrowdown" :
    playerVelociy.z-=moveSpeed;
    targetRotation=Math.PI;
      break;

      case "a":
      case "arrowleft" :
      playerVelociy.x+=moveSpeed;
      targetRotation=-Math.PI/2;
      break ;

      case "d":
      case "arrowright" :
      playerVelociy.x-=moveSpeed;
      targetRotation=Math.PI/2;
       break ;

       default :
       return ; 
    }
    playerVelociy.y = jumpHeight;
    character.isMoving = true ; 
   // moveCharacter(targetPosition,targetRotation);
}

function updatePlayer(){
if (!character.instance) return ;

if ( character.instance.position.y < -20){
  respawnCharacter();
  return ; 
}


if (!playerOnFloor){
  playerVelociy.y-= gravity*0.035;
}

playerCollider.translate(playerVelociy.clone().multiplyScalar(0.035));

playerCollisions();

character.instance.position.copy(playerCollider.start);
character.instance.position.y -= capsuleRadius;

     let rotationDiff = ((((targetRotation - character.instance.rotation.y)%(2*Math.PI))+
     3*Math.PI) % 
     (2*Math.PI))-
     Math.PI;
  let finalRotation = character.instance.rotation.y + rotationDiff;


character.instance.rotation.y = THREE.MathUtils.lerp(
  character.instance.rotation.y,
  finalRotation,
  0.3
);


}
// checking collision 
function playerCollisions(){
  const result = colliderOctree.capsuleIntersect(playerCollider);
  playerOnFloor = false ;

  if(result){
    playerOnFloor = result.normal.y>0;
    playerCollider.translate(result.normal.multiplyScalar(result.depth));
    
    if (playerOnFloor){
      character.isMoving = false ;
      playerVelociy.x = 0 ;
      playerVelociy.z= 0 ;
      
    }
  }
}



// Animation loop
function animate() {
  updatePlayer();
  if (character.instance){
     const targetCameraPosition = new THREE.Vector3(
      character.instance.position.x + cameraOffset.x,
      cameraOffset.y,
      character.instance.position.z + cameraOffset.z 
     );
    camera.position.copy(targetCameraPosition);
    camera.lookAt(character.instance.position.x,
      camera.position.y-39,
      character.instance.position.z
    );


  }

  raycaster.setFromCamera(pointer,camera);
  const intersects = raycaster.intersectObjects(intersectObjects);

  // pointer change 
  if ( intersects.length>0){
    document.body.style.cursor="pointer";
  }else{
    document.body.style.cursor="default";
    intersectObject=" ";
  }

  for(let i=0 ; i<intersects.length ; i++){
    intersectObject = intersects[0].object.parent.name ; 
  }

  controls.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

controls.enablePan=true;


// modal designing 

const modalContent = {
  Project : {
    tittle : "Project One ",
    content : "This is Project One : Hello World 🌍",
    link: "https://example.com",
    
  },
  Project2 :  {
    tittle : "Project Two ",
    content : "This is Project One : Hello World❤️",
    link :"https://example.com",

  },
  Project3 : {
    tittle : "Project Three ",
    content : "This is Project  Three: Hello World😆",
    link :"https://example.com",
  },
  chest :{
    tittle:"About Me",
    content : " This is me Amandeep ☺️ ",
  },
};

const modal = document.querySelector(".modal");
const modalTittle = document.querySelector(".modalTittle");
const modalProjectDescription = document.querySelector(".modalProjectDescription");
const modalExitButton= document.querySelector(".modalExitButton");
const modalProjectVisitButton= document.querySelector(".modalProjectVisitButton");

// modal showing 
function showModal(id){
  const content = modalContent[id];
  if ( content ){
    modalTittle.textContent = content.tittle ;
    modalProjectDescription.textContent= content . content ; 
    if (content.link){
    modalProjectVisitButton.href = content.link;
    modalProjectVisitButton.classList.remove("hidden");
    }else {
          modalProjectVisitButton.classList.add("hidden");

    }
    modal.classList.toggle("hidden");
  }
}
function hideModal(){
  modal.classList.toggle("hidden");

}
modalExitButton.addEventListener("click", hideModal);
// interpolation : constructing new data points based upon the old data points or the known data points 