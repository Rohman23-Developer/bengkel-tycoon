import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';
import { scene } from './three-init.js';
import { GameState, formatRupiah } from './game-state.js';
import { openDialogue, showToast, updateHUD } from './ui.js';
import { audio } from './audio.js';

export function createEntities(){
  // Player
  const player = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(18,30,12), new THREE.MeshStandardMaterial({ color: 0x355070 }));
  body.position.y = 15;
  const head = new THREE.Mesh(new THREE.BoxGeometry(12,12,12), new THREE.MeshStandardMaterial({ color: 0xF1C27D }));
  head.position.y = 34;
  player.add(body); player.add(head);
  player.position.set(0,5,50);
  scene.add(player);

  // NPCs
  const npcDanu = new THREE.Mesh(new THREE.BoxGeometry(12,24,10), new THREE.MeshStandardMaterial({color:0x4A6D8C})); npcDanu.position.set(-300,12,40); scene.add(npcDanu);
  const npcTejo = new THREE.Mesh(new THREE.BoxGeometry(12,24,10), new THREE.MeshStandardMaterial({color:0xC87E3A})); npcTejo.position.set(300,12,40); scene.add(npcTejo);
  const npcWarung = new THREE.Mesh(new THREE.BoxGeometry(12,24,10), new THREE.MeshStandardMaterial({color:0x7FB069})); npcWarung.position.set(420,12,40); scene.add(npcWarung);

  const obstacles = [
    {x:-300,z:-120,w:220,d:140},
    {x:0,z:-120,w:220,d:140},
    {x:300,z:-120,w:220,d:140}
  ];

  const interactables3d = [
    { id:'danu', x:-300, z:40, radius:50, name:'Om Danu (Mekanik Senior)', type:'npc', onInteract: () => {
        if(GameState.quest.chapter===1 && GameState.quest.step===0){
          openDialogue('Om Danu', `Halo ${GameState.player.name}! Selamat atas kelulusanmu... Langkah pertamamu: Datanglah ke <b>Toko Onderdil Pak Tejo</b> di ujung jalan, belilah <b>Satu Set Kunci & Perkakas Dasar</b>.`, [{label:'Siap, Om Danu! Saya ke sana.', cb: ()=>{ GameState.quest.step=1; GameState.quest.desc = "Beli 'Set Kunci Dasar' (Rp 750.000) di Toko Pak Tejo."; updateHUD();}}]);
        } else if(GameState.quest.chapter===1 && GameState.quest.step===2){
          openDialogue('Om Danu', `Bagus! Kunci pas dan tang sudah di tangan...`, [{label:'Baik, saya akan layani dengan teliti!', cb: ()=>{ GameState.quest.chapter=2; GameState.quest.step=0; GameState.quest.title='Bab 2: Pelanggan Pertama'; GameState.quest.desc='Periksa motor Mas Budi di depan halaman bengkelmu.'; const bike = interactables3d.find(i=>i.id==='customer_bike'); if(bike) bike.active=true; updateHUD(); showToast('Motor pelanggan telah tiba di bengkel!'); }}]);
        } else { openDialogue('Om Danu', `Ingat anak muda, jangan paksakan tenagamu kalau lelah atau lapar.`); }
      }
    },
    { id:'sparepart_shop', x:300, z:40, radius:50, name:'Pak Tejo (Toko Onderdil)', type:'npc', onInteract: () => {
        if(GameState.quest.chapter===1 && GameState.quest.step===1){
          openDialogue('Pak Tejo (Toko Onderdil)', `Saya ada <b>Paket Perkakas Mekanik Dasar</b>... Harganya <b>Rp 750.000</b>. Mau ambil?`, [{label:'Beli Paket Perkakas (Rp 750.000)', cb: ()=>{ if(GameState.player.cash>=750000){ GameState.player.cash-=750000; GameState.player.hasBasicTools=true; GameState.quest.step=2; GameState.quest.desc='Kembali lapor ke Om Danu bahwa alat sudah siap.'; audio.sndCash(); updateHUD(); showToast('Peralatan servis dasar berhasil dibeli!'); } else showToast('Uang tidak mencukupi!'); } }, {label:'Nanti dulu', cb: ()=>{}}]);
        } else { openDialogue('Pak Tejo', `Stok oli mesin MPX & Federal selalu ready.`); }
      }
    },
    { id:'warung', x:420, z:40, radius:50, name:'Bu Siti (Warung)', type:'shop', onInteract: () => {
        openDialogue('Bu Siti (Warung Makan)', `Monggo Mas ${GameState.player.name}...`, [{label:'Beli Nasi Rames (Rp 15.000)', cb: ()=>{ if(GameState.player.cash>=15000){ GameState.player.cash-=15000; GameState.player.hunger=Math.min(100,GameState.player.hunger+35); GameState.player.energy=Math.min(100,GameState.player.energy+15); audio.sndCash(); updateHUD(); showToast('Kenyang dan bertenaga!'); }} }, {label:'Beli Es Teh (Rp 5.000)', cb: ()=>{ if(GameState.player.cash>=5000){ GameState.player.cash-=5000; GameState.player.thirst=Math.min(100,GameState.player.thirst+40); audio.sndCash(); updateHUD(); showToast('Segar!'); } } }, {label:'Batal', cb: ()=>{}}]);
      }
    },
    { id:'bed', x:0, z:-30, radius:40, name:'Kasur Istirahat', type:'rest', onInteract: () => {
        openDialogue('Kamar Tidur', `Apakah kamu ingin beristirahat hingga besok pagi pukul 06:00 WIB?`, [{label:'Tidur Sekarang', cb: ()=>{ GameState.time.day+=1; GameState.time.hour=6; GameState.time.minute=0; GameState.player.energy=Math.min(100,GameState.player.energy+60); GameState.player.hp=Math.min(100,GameState.player.hp+20); GameState.player.hunger=Math.max(10,GameState.player.hunger-25); GameState.player.thirst=Math.max(10,GameState.player.thirst-30); audio.sndSuccess(); updateHUD(); showToast(`Selamat pagi! Hari ke-${GameState.time.day} dimulai.`); } }, {label:'Batal', cb: ()=>{}}]);
      }
    },
    { id:'customer_bike', x:0, z:80, radius:50, name:'Motor Pelanggan (Mas Budi)', type:'service', active:false, onInteract: () => { 
        // service minigame will be started by minigame module
        const ev = new CustomEvent('startService'); window.dispatchEvent(ev);
      }
    }
  ];

  return { player, npcs: {danu:npcDanu, tejo:npcTejo, warung:npcWarung}, obstacles, interactables3d };
}

export function checkCollisionFor(posX,posZ, obstacles){
  for(const o of obstacles){
    const minX = o.x - o.w/2 - 12; const maxX = o.x + o.w/2 + 12;
    const minZ = o.z - o.d/2 - 12; const maxZ = o.z + o.d/2 + 12;
    if(posX >= minX && posX <= maxX && posZ >= minZ && posZ <= maxZ) return true;
  }
  return false;
}
