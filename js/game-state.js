export const SAVE_KEY = 'BENGKEL_TYCOON_SAVE_V1';

export const GameState = {
  player: {
    name: 'Rian',
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
  currentServiceCustomer: null,
  isPaused: false
};

export function formatRupiah(num){ return 'Rp ' + Math.floor(num).toLocaleString('id-ID'); }
