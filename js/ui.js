import { GameState, formatRupiah, SAVE_KEY } from './game-state.js';
import { audio } from './audio.js';

export function showToast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.innerText = msg;
  t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(()=>{ t.style.opacity = '0'; }, 2600);
}

export function saveGame(){
  try{
    localStorage.setItem(SAVE_KEY, JSON.stringify(GameState));
    showToast('Permainan berhasil disimpan!');
    audio.sndSuccess();
  }catch(e){ console.error('Save failed', e); showToast('Gagal menyimpan'); }
}

export function loadGame(){
  try{
    const raw = localStorage.getItem(SAVE_KEY);
    if(!raw) return false;
    const data = JSON.parse(raw);
    // Basic merging: overwrite top-level keys
    Object.assign(GameState, data);
    showToast('Data permainan dimuat!');
    return true;
  }catch(e){ console.error('Load failed', e); return false; }
}

export function updateHUD(){
  const shop = document.getElementById('hud-shop-name');
  const cash = document.getElementById('hud-cash');
  const rep = document.getElementById('hud-rep');
  const clock = document.getElementById('hud-clock');
  const barHp = document.getElementById('bar-hp');
  const barEnergy = document.getElementById('bar-energy');
  const barHunger = document.getElementById('bar-hunger');
  const barThirst = document.getElementById('bar-thirst');
  const questTitle = document.getElementById('quest-title');
  const questDesc = document.getElementById('quest-desc');

  if(shop) shop.innerText = GameState.player.shopName;
  if(cash) cash.innerText = formatRupiah(GameState.player.cash);
  if(rep) rep.innerText = GameState.player.rep;
  if(clock) clock.innerText = `Hari ${GameState.time.day} - ${String(GameState.time.hour).padStart(2,'0')}:${String(GameState.time.minute).padStart(2,'0')} WIB`;
  if(barHp) barHp.style.width = GameState.player.hp + '%';
  if(barEnergy) barEnergy.style.width = GameState.player.energy + '%';
  if(barHunger) barHunger.style.width = GameState.player.hunger + '%';
  if(barThirst) barThirst.style.width = GameState.player.thirst + '%';
  if(questTitle) questTitle.innerText = GameState.quest.title;
  if(questDesc) questDesc.innerText = GameState.quest.desc;
}

// Dialogue helpers
export function openDialogue(name, text, actions = [{label:'Mengerti', cb: closeDialogue}]){
  audio.sndInteract();
  const modal = document.getElementById('dialogue-modal');
  const dialogueName = document.getElementById('dialogue-name');
  const dialogueText = document.getElementById('dialogue-text');
  const dialogueActions = document.getElementById('dialogue-actions');
  if(!modal || !dialogueName || !dialogueText || !dialogueActions) return;
  dialogueName.innerText = name;
  dialogueText.innerHTML = text;
  dialogueActions.innerHTML = '';
  actions.forEach(act=>{
    const btn = document.createElement('button'); btn.className='btn-ui'; btn.innerText = act.label; btn.onclick = ()=>{ audio.sndInteract(); act.cb(); }; dialogueActions.appendChild(btn);
  });
  modal.style.display = 'flex';
  GameState.isPaused = true;
}

export function closeDialogue(){ const modal = document.getElementById('dialogue-modal'); if(modal) modal.style.display='none'; GameState.isPaused = false; }
