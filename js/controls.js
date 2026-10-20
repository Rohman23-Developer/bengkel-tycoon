// controls.js - provides input vector from keyboard & touch joystick

export function createControls(){
  const keys = {};
  const touch = { active:false, startX:0, startY:0, moveX:0, moveY:0 };

  window.addEventListener('keydown', (e)=>{ keys[e.key.toLowerCase()] = true; if(e.key==='Shift') keys['shift']=true; });
  window.addEventListener('keyup', (e)=>{ keys[e.key.toLowerCase()] = false; if(e.key==='Shift') keys['shift']=false; });

  const joystickArea = document.getElementById('joystick-area');
  const joystickKnob = document.getElementById('joystick-knob');
  if(joystickArea){
    joystickArea.addEventListener('pointerdown', (e)=>{ touch.active=true; const rect = joystickArea.getBoundingClientRect(); touch.startX = rect.left + rect.width/2; touch.startY = rect.top + rect.height/2; updateJoystick(e.clientX, e.clientY); joystickArea.setPointerCapture(e.pointerId); });
    window.addEventListener('pointermove', (e)=>{ if(!touch.active) return; updateJoystick(e.clientX, e.clientY); });
    window.addEventListener('pointerup', ()=>{ touch.active=false; touch.moveX=0; touch.moveY=0; if(joystickKnob) joystickKnob.style.transform='translate(0px,0px)'; });
  }

  function updateJoystick(cx, cy){ const dx = cx - touch.startX; const dy = cy - touch.startY; const dist = Math.hypot(dx,dy); const maxR = 40; const clamped = Math.min(dist, maxR); const ang = Math.atan2(dy,dx); const kx = Math.cos(ang)*clamped; const ky = Math.sin(ang)*clamped; if(joystickKnob) joystickKnob.style.transform = `translate(${kx}px, ${ky}px)`; touch.moveX = kx/maxR; touch.moveY = ky/maxR; }

  function getInput(){
    let ix = 0, iz = 0;
    if(keys['w'] || keys['arrowup']) iz -= 1;
    if(keys['s'] || keys['arrowdown']) iz += 1;
    if(keys['a'] || keys['arrowleft']) ix -= 1;
    if(keys['d'] || keys['arrowright']) ix += 1;
    ix += (touch.moveX || 0); iz += (touch.moveY || 0);
    return { x: ix, z: iz, sprint: !!keys['shift'] };
  }

  return { getInput };
}
