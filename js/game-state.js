export const SAVE_KEY = 'BENGKEL_TYCOON_SAVE_V1';

export const GameState = {
  player: {
    name: '',
    shopName: 'Bengkel Berkah',
    cash: 15000000,
    rep: 0,
    hp: 75,
    energy: 90,
    hunger: 80,
    thirst: 85,
    x: 0,
    y: 0,
    speed: 150,
    isSprinting: false,
    hasBasicTools: false
  },
  time: { day:1, hour:8, minute:0, timer:0 },
  quest: { chapter:1, step:0, title:'Bab 1: Langkah Pertama', desc:'Bicaralah dengan Om Danu (Mekanik Senior) di depan rumahnya.' },
  profile: { playerName:'', shopName:'Bengkel Berkah', complete:false },
  story: { tutorialSeen:false, chapter:1, heading:'Bab 1: Langkah Pertama', description:'Jalan panjangmu dimulai di rumah dan bengkel kecilmu.' },
  currentServiceCustomer: null,
  isPaused: false,
  boot: { introComplete:false }
};

export function formatRupiah(num){ return 'Rp ' + Math.floor(num).toLocaleString('id-ID'); }

export function applyProfile(profile = {}){
  const playerName = String(profile.playerName || '').trim();
  const shopName = String(profile.shopName || '').trim();
  if (playerName) {
    GameState.player.name = playerName;
    GameState.profile.playerName = playerName;
  }
  if (shopName) {
    GameState.player.shopName = shopName;
    GameState.profile.shopName = shopName;
  } else {
    GameState.player.shopName = GameState.player.shopName || 'Bengkel Berkah';
    GameState.profile.shopName = GameState.player.shopName;
  }
  GameState.profile.complete = true;
  GameState.boot.introComplete = true;
}
