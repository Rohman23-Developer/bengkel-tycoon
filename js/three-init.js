import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';

// Basic isometric orthographic scene
const canvas = document.getElementById('glCanvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x93a1a1);

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const dir = new THREE.DirectionalLight(0xffffff, 0.6);
dir.position.set(100, 200, 100);
scene.add(dir);

// Camera: Orthographic for stable isometric look
let aspect = window.innerWidth / window.innerHeight;
let viewSize = 400;
let camera = new THREE.OrthographicCamera(
  -viewSize * aspect / 2, viewSize * aspect / 2,
  viewSize / 2, -viewSize / 2,
  -1000, 2000
);
// Isometric diagonal: rotate camera so it looks from above at an angle
camera.position.set(300, 300, 300);
camera.lookAt(0, 0, 0);
scene.add(camera);

// Helper: ground
const groundMat = new THREE.MeshStandardMaterial({ color: 0xEDE6D6 });
const groundGeo = new THREE.PlaneGeometry(1200, 800);
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI/2;
ground.receiveShadow = false;
scene.add(ground);

// Simple low-poly building function
function makeBuilding(x,z,w,d,h,color){
  const g = new THREE.BoxGeometry(w, h, d);
  const m = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(g,m);
  mesh.position.set(x, h/2, z);
  scene.add(mesh);
  return mesh;
}

// Buildings layout approximate to 2D prototype positions
const b1 = makeBuilding(-300, -120, 220, 140, 80, 0x34495e); // Om Danu
const b2 = makeBuilding(0, -120, 220, 140, 90, 0xd35400); // Player house & garage
const b3 = makeBuilding(300, -120, 220, 140, 80, 0x27ae60); // Shop & warung

// Road markings (thin boxes)
function makeRoad(){
  const mat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const road = new THREE.Mesh(new THREE.BoxGeometry(1200, 1, 120), mat);
  road.position.set(0, 0.5, 100);
  scene.add(road);
  // stripe
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(1200, 0.2, 4), new THREE.MeshStandardMaterial({ color:0xF5EDDE }));
  stripe.position.set(0, 1.01, 100);
  scene.add(stripe);
}
makeRoad();

// Player: simple low-poly block model
const player = new THREE.Group();
const body = new THREE.Mesh(new THREE.BoxGeometry(18, 30, 12), new THREE.MeshStandardMaterial({ color: 0x355070 }));
body.position.y = 15;
const head = new THREE.Mesh(new THREE.BoxGeometry(12, 12, 12), new THREE.MeshStandardMaterial({ color: 0xF1C27D }));
head.position.y = 34;
player.add(body); player.add(head);
player.position.set(0, 5, 50);
scene.add(player);

// Simple NPC markers
function makeNPC(x,z,color,label){
  const g = new THREE.Mesh(new THREE.BoxGeometry(12, 24, 10), new THREE.MeshStandardMaterial({ color }));
  g.position.set(x, 12, z);
  scene.add(g);
  return g;
}
const npcDanu = makeNPC(-300, 40, 0x4A6D8C, 'Danu');
const npcTejo = makeNPC(300, 40, 0xC87E3A, 'Tejo');
const warung = makeNPC(420,40,0x7FB069,'BuSiti');

// Collision boxes from building footprints
const obstacles = [
  {x:-300,z:-120,w:220,d:140},
  {x:0,z:-120,w:220,d:140},
  {x:300,z:-120,w:220,d:140}
];

function checkCollisionFor(posX,posZ){
  // pos in world coords
  for(const o of obstacles){
    const minX = o.x - o.w/2 - 12; const maxX = o.x + o.w/2 + 12;
    const minZ = o.z - o.d/2 - 12; const maxZ = o.z + o.d/2 + 12;
    if(posX >= minX && posX <= maxX && posZ >= minZ && posZ <= maxZ) return true;
  }
  return false;
}

// Movement state
let move = { x:0, z:0 };
let speed = 120; // units per second

// Keyboard controls
const keys = {};
window.addEventListener('keydown', (e)=>{ keys[e.key.toLowerCase()] = true; });
window.addEventListener('keyup', (e)=>{ keys[e.key.toLowerCase()] = false; });

// Touch joystick simple implementation
const joystickArea = document.getElementById('joystick-area-3d');
const knob = document.getElementById('joystick-knob-3d');
let touchState = {active:false, startX:0, startY:0, dx:0, dy:0};
if(joystickArea){
  joystickArea.addEventListener('pointerdown', (e)=>{
    touchState.active=true;
    const rect = joystickArea.getBoundingClientRect();
    touchState.startX = rect.left + rect.width/2;
    touchState.startY = rect.top + rect.height/2;
    joystickArea.setPointerCapture(e.pointerId);
  });
  window.addEventListener('pointermove',(e)=>{
    if(!touchState.active) return;
    const dx = e.clientX - touchState.startX; const dy = e.clientY - touchState.startY;
    const max = 40; const dist = Math.hypot(dx,dy); const clamped = Math.min(dist, max);
    const ang = Math.atan2(dy,dx);
    const kx = Math.cos(ang)*clamped; const ky = Math.sin(ang)*clamped;
    knob.style.transform = `translate(${kx}px, ${ky}px)`;
    touchState.dx = kx/max; touchState.dy = ky/max;
  });
  window.addEventListener('pointerup',(e)=>{ touchState.active=false; knob.style.transform='translate(0px,0px)'; touchState.dx=0; touchState.dy=0; });
}

// Resize handling
function onWindowResize(){
  aspect = window.innerWidth / window.innerHeight;
  camera.left = -viewSize * aspect / 2; camera.right = viewSize * aspect / 2;
  camera.top = viewSize / 2; camera.bottom = -viewSize / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

let last = performance.now();
function animate(){
  const now = performance.now();
  const dt = (now - last)/1000; last = now;

  // Inputs
  let ix = 0, iz = 0;
  if(keys['w'] || keys['arrowup']) iz -= 1;
  if(keys['s'] || keys['arrowdown']) iz += 1;
  if(keys['a'] || keys['arrowleft']) ix -= 1;
  if(keys['d'] || keys['arrowright']) ix += 1;
  // touch joystick
  ix += (touchState.dx || 0);
  iz += (touchState.dy || 0);

  // normalize
  const len = Math.hypot(ix, iz);
  if(len > 1){ ix/=len; iz/=len; }

  const moveSpeed = speed * dt;
  const worldX = player.position.x + ix * moveSpeed;
  const worldZ = player.position.z + iz * moveSpeed;

  if(!checkCollisionFor(worldX, worldZ)){
    player.position.x = worldX; player.position.z = worldZ;
  }

  // Camera follow with lerp
  const camTarget = new THREE.Vector3(player.position.x, 0, player.position.z);
  const camPos = new THREE.Vector3().copy(camera.position);
  camPos.lerp(new THREE.Vector3(player.position.x + 300, 300, player.position.z + 300), 0.06);
  camera.position.copy(camPos);
  camera.lookAt(player.position.x, 0, player.position.z);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

console.log('Three.js isometric vertical slice running');
