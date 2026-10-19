import { GameState } from './game-state.js';
import { showToast, updateHUD } from './ui.js';
import { audio } from './audio.js';

let minigameState = {
  active:false,
  step:1,
  cursorPos:0,
  cursorDir:1,
  cursorSpeed:140,
  targetStart:35,
  targetWidth:30
};

const serviceOverlay = document.getElementById('service-overlay');
const serviceStepTitle = document.getElementById('service-step-title');
const serviceInstruction = document.getElementById('service-instruction');
const serviceCursor = document.getElementById('service-cursor');
const serviceTarget = document.getElementById('service-target');
const btnServiceAction = document.getElementById('btn-service-action');

export function setupMinigame(){
  btnServiceAction.addEventListener('pointerdown', (e)=>{ e.preventDefault(); audio.init(); if(!minigameState.active) return; handleAction(); });
}

export function startServiceMinigame(){
  if(!GameState.player.hasBasicTools){ showToast('Kamu membutuhkan set perkakas dari Pak Tejo!'); return; }
  GameState.isPaused = true; minigameState.active=true; minigameState.step=1; minigameState.cursorPos=0; setupServiceStep(); serviceOverlay.style.display='flex';
}

function setupServiceStep(){
  if(minigameState.step===1){ serviceStepTitle.innerText='Tahap 1: Buka Baut Kuras Oli (Bawah Mesin)'; serviceInstruction.innerText='Tekan tombol saat jarum tepat berada di area hijau!'; btnServiceAction.innerText='Putar Kunci Sok 17mm'; minigameState.targetStart=35; minigameState.targetWidth=30; minigameState.cursorSpeed=160; }
  else if(minigameState.step===2){ serviceStepTitle.innerText='Tahap 2: Menampung & Kuras Oli Kotor'; serviceInstruction.innerText='Tahan konsentrasi dan tekan tombol pada saat yang tepat!'; btnServiceAction.innerText='Tadah Wadah Oli'; minigameState.targetStart=45; minigameState.targetWidth=25; minigameState.cursorSpeed=190; }
  else if(minigameState.step===3){ serviceStepTitle.innerText='Tahap 3: Kencangkan Kembali Baut Tap Oli'; serviceInstruction.innerText='Pastikan ring washer terpasang agar tidak bocor.'; btnServiceAction.innerText='Kencangkan Baut'; minigameState.targetStart=30; minigameState.targetWidth=28; minigameState.cursorSpeed=210; }
  else if(minigameState.step===4){ serviceStepTitle.innerText='Tahap 4: Tuangkan Oli Mesin Baru (0.8 Liter)'; serviceInstruction.innerText='Tuang presisi dan jangan sampai meluber ke blok mesin!'; btnServiceAction.innerText='Tuang Oli'; minigameState.targetStart=42; minigameState.targetWidth=20; minigameState.cursorSpeed=240; }
  if(serviceTarget) { serviceTarget.style.left = minigameState.targetStart + '%'; serviceTarget.style.width = minigameState.targetWidth + '%'; }
}

function handleAction(){
  const hit = minigameState.cursorPos >= minigameState.targetStart && minigameState.cursorPos <= (minigameState.targetStart + minigameState.targetWidth);
  if(hit){ audio.sndWrench(); minigameState.step++; if(minigameState.step>4){ finishServiceMinigame(true); } else { setupServiceStep(); } }
  else{ audio.playTone ? audio.playTone(120,'sawtooth',0.2,0.15) : null; showToast('Kurang tepat! Ulangi tahapan ini.'); }
}

export function updateMinigame(dt){
  if(!minigameState.active) return;
  minigameState.cursorPos += minigameState.cursorDir * minigameState.cursorSpeed * dt / 10;
  if(minigameState.cursorPos > 100){ minigameState.cursorPos = 100; minigameState.cursorDir = -1; }
  else if(minigameState.cursorPos < 0){ minigameState.cursorPos = 0; minigameState.cursorDir = 1; }
  if(serviceCursor) serviceCursor.style.left = minigameState.cursorPos + '%';
}

function finishServiceMinigame(success){
  minigameState.active=false; if(serviceOverlay) serviceOverlay.style.display='none'; GameState.isPaused=false;
  if(success){ const fee=85000; GameState.player.cash += fee; GameState.player.rep += 15; GameState.player.energy = Math.max(10, GameState.player.energy - 15); GameState.player.thirst = Math.max(10, GameState.player.thirst - 12); audio.sndSuccess(); audio.sndCash(); GameState.quest.chapter = 3; GameState.quest.step = 0; GameState.quest.title = 'Bab 3: Evaluasi Keuangan'; GameState.quest.desc = 'Selamat! Servis pertamamu sukses. Cek saldo dan jaga kesehatanmu.'; updateHUD(); openThankYou(); }
}

function openThankYou(){
  openSimpleDialogue('Mas Budi (Pelanggan Pertama)', `Wah, terima kasih banyak Mas ${GameState.player.name}! Ini uang jasanya <b>${formatCurrency(85000)}</b>.`);
}

function openSimpleDialogue(title, text){ const modal = document.getElementById('dialogue-modal'); const dialogueName = document.getElementById('dialogue-name'); const dialogueText = document.getElementById('dialogue-text'); const dialogueActions = document.getElementById('dialogue-actions'); if(!modal) return; dialogueName.innerText = title; dialogueText.innerHTML = text; dialogueActions.innerHTML=''; const btn=document.createElement('button'); btn.className='btn-ui'; btn.innerText='Tutup'; btn.onclick=()=>{ modal.style.display='none'; }; dialogueActions.appendChild(btn); modal.style.display='flex'; }

function formatCurrency(n){ return 'Rp '+Math.floor(n).toLocaleString('id-ID'); }
