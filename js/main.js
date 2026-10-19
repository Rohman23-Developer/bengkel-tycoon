import { scene, camera, render } from './three-init.js';
import { createEntities, checkCollisionFor } from './entities.js';
import { createControls } from './controls.js';
import { loadGame, updateHUD, GameState } from './game-state.js';
import { setupMinigame, startServiceMinigame, updateMinigame } from './minigames.js';
import { audio } from './audio.js';

let entities = null;
let controls = null;
let last = performance.now();

export function init3D(){
  // create entities & controls
  entities = createEntities();
  controls = createControls();
  setupMinigame();

  // listen for startService event (from entity interaction)
  window.addEventListener('startService', ()=>{ startServiceMinigame(); });

  // load previous save
  loadGame(); updateHUD();

  // bind service button for legacy page where it exists
  const svcBtn = document.getElementById('btn-service-action'); if(svcBtn) svcBtn.addEventListener('pointerdown', (e)=>{ e.preventDefault(); audio.init(); const ev = new CustomEvent('serviceAction'); window.dispatchEvent(ev); });
  window.addEventListener('serviceAction', ()=>{ /* handled in minigames via pointer on element */ });

  requestAnimationFrame(loop);
}

function loop(){
  const now = performance.now(); const dt = (now - last)/1000; last = now;

  // update minigame cursor
  updateMinigame(dt);

  // inputs
  const inp = controls.getInput();
  let ix = inp.x, iz = inp.z;
  const len = Math.hypot(ix, iz); if(len>1){ ix/=len; iz/=len; }
  const sp = GameState.player.isSprinting ? GameState.player.speed * 1.6 : GameState.player.speed;
  const moveSpeed = sp * dt;

  if(entities && entities.player){
    const worldX = entities.player.position.x + ix * moveSpeed;
    const worldZ = entities.player.position.z + iz * moveSpeed;
    if(!checkCollisionFor(worldX, worldZ, entities.obstacles)){
      entities.player.position.x = worldX; entities.player.position.z = worldZ;
    }

    // camera follow
    const camPos = camera.position.clone();
    camPos.lerp(new THREE.Vector3(entities.player.position.x + 300, 300, entities.player.position.z + 300), 0.06);
    camera.position.copy(camPos);
    camera.lookAt(entities.player.position.x, 0, entities.player.position.z);
  }

  render();
  requestAnimationFrame(loop);
}

// auto-init if module loaded in index
if(document.readyState === 'complete' || document.readyState === 'interactive'){
  setTimeout(()=>{ try{ init3D(); }catch(e){ console.error('init3D error', e); } }, 50);
} else {
  window.addEventListener('DOMContentLoaded', ()=>{ setTimeout(()=>{ try{ init3D(); }catch(e){ console.error('init3D error', e); } }, 50); });
}
