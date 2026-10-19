import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';
import { GameState } from './game-state.js';
import { openDialogue, closeDialogue, showToast, updateHUD } from './ui.js';
import { audio } from './audio.js';

// Basic isometric orthographic scene
const canvas = document.getElementById('glCanvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

export { renderer };

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x93a1a1);

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const dir = new THREE.DirectionalLight(0xffffff, 0.6);
dir.position.set(100, 200, 100);
scene.add(dir);

// Camera: Orthographic for stable isometric look
export let aspect = window.innerWidth / window.innerHeight;
export let viewSize = 400;
export const camera = new THREE.OrthographicCamera(
  -viewSize * aspect / 2, viewSize * aspect / 2,
  viewSize / 2, -viewSize / 2,
  -1000, 2000
);
// Isometric diagonal: rotate camera so it looks from above at an angle
camera.position.set(300, 300, 300);
camera.lookAt(0, 0, 0);
scene.add(camera);

// ground
const groundMat = new THREE.MeshStandardMaterial({ color: 0xEDE6D6 });
const groundGeo = new THREE.PlaneGeometry(1200, 800);
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI/2;
scene.add(ground);

export function onWindowResize(){
  aspect = window.innerWidth / window.innerHeight;
  camera.left = -viewSize * aspect / 2; camera.right = viewSize * aspect / 2;
  camera.top = viewSize / 2; camera.bottom = -viewSize / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

export function render(){ renderer.render(scene, camera); }

console.log('scene module initialized');
