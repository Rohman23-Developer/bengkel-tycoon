export const SAVE_KEY = 'BENGKEL_TYCOON_SAVE_V1';

export const GameState = {
  player: {
    name: 'Rian',
    shopName: 'Bengkel Rian',
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
    hasBasicTools: false,
    sleepDebt: 0,
    fatigue: 0
  },
  time: {
    day: 1,
    hour: 8,
    minute: 0,
    timer: 0
  },
  quest: {
    chapter: 1,
    step: 0,
    title: 'Bab 1: Langkah Pertama',
    desc: 'Bicaralah dengan Om Danu di depan rumah.'
  },
  currentServiceCustomer: null,
  isPaused: false,
  story: {
    chapter: 1,
    title: 'Bab 1: Langkah Pertama',
    summary: 'Rian mulai menjalani hari pertamanya di bengkel baru.',
    text: 'Hari pertamamu dimulai di rumah kecil dan bengkel baru yang sedang dibangun.'
  },
  profile: {
    complete: false
  },
  boot: {
    introComplete: false
  }
};

export function formatRupiah(num) {
  return 'Rp ' + Math.floor(num).toLocaleString('id-ID');
}

export function ensureStoryState() {
  if (!GameState.story) {
    GameState.story = {
      chapter: 1,
      title: 'Bab 1: Langkah Pertama',
      summary: 'Rian mulai menjalani hari pertamanya di bengkel baru.',
      text: 'Hari pertamamu dimulai di rumah kecil dan bengkel baru yang sedang dibangun.'
    };
  }

  if (!GameState.profile) {
    GameState.profile = { complete: false };
  }

  if (!GameState.boot) {
    GameState.boot = { introComplete: false };
  }
}

export function setStoryChapter(chapter) {
  ensureStoryState();

  const chapters = {
    1: {
      title: 'Bab 1: Langkah Pertama',
      summary: 'Mulai membangun bengkel dari nol.',
      text: 'Rian kembali ke rumah, menyiapkan area kerja, dan bertemu Om Danu untuk memulai usaha bengkel.'
    },
    2: {
      title: 'Bab 2: Servis Pertama',
      summary: 'Peralatan mulai lengkap dan pelanggan mulai datang.',
      text: 'Dengan perkakas dasar yang sudah terbeli, Rian siap menerima servis motor pertama dari pelanggan.'
    },
    3: {
      title: 'Bab 3: Membangun Reputasi',
      summary: 'Reputasi bengkel mulai tumbuh.',
      text: 'Semakin banyak pelanggan yang puas, reputasi bengkel semakin kuat dan membuka peluang baru.'
    }
  };

  const selected = chapters[chapter] || chapters[1];
  GameState.story.chapter = chapter;
  GameState.story.title = selected.title;
  GameState.story.summary = selected.summary;
  GameState.story.text = selected.text;
  GameState.quest.chapter = chapter;
  GameState.quest.title = selected.title;
  GameState.quest.desc = selected.summary;
}

export function saveGame() {
  try {
    if (typeof localStorage === 'undefined') return false;
    localStorage.setItem(SAVE_KEY, JSON.stringify(GameState));
    return true;
  } catch (error) {
    console.warn('saveGame failed:', error);
    return false;
  }
}

export function loadGame() {
  try {
    if (typeof localStorage === 'undefined') return false;
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return false;

    if (parsed.player) Object.assign(GameState.player, parsed.player);
    if (parsed.time) Object.assign(GameState.time, parsed.time);
    if (parsed.quest) Object.assign(GameState.quest, parsed.quest);
    if (parsed.story) GameState.story = parsed.story;
    if (parsed.profile) GameState.profile = parsed.profile;
    if (parsed.boot) GameState.boot = parsed.boot;

    GameState.currentServiceCustomer = parsed.currentServiceCustomer ?? null;
    GameState.isPaused = !!parsed.isPaused;

    ensureStoryState();
    return true;
  } catch (error) {
    console.warn('Save data invalid; using default state.', error);
    return false;
  }
}

export function updateHUD() {
  const hud = document.getElementById('hud');
  if (!hud) return;

  const moneyEl = document.getElementById('hud-money');
  const repEl = document.getElementById('hud-rep');
  const dayEl = document.getElementById('hud-day');
  const hpEl = document.getElementById('hud-health');
  const energyEl = document.getElementById('hud-energy');
  const hungerEl = document.getElementById('hud-hunger');
  const thirstEl = document.getElementById('hud-thirst');

  if (moneyEl) moneyEl.textContent = formatRupiah(GameState.player.cash);
  if (repEl) repEl.textContent = 'Rep ' + GameState.player.rep;
  if (dayEl) dayEl.textContent = 'Hari ' + GameState.time.day;
  if (hpEl) hpEl.textContent = 'HP ' + Math.max(0, Math.min(100, GameState.player.hp));
  if (energyEl) energyEl.textContent = 'Energy ' + Math.max(0, Math.min(100, GameState.player.energy));
  if (hungerEl) hungerEl.textContent = 'Lapar ' + Math.max(0, Math.min(100, GameState.player.hunger));
  if (thirstEl) thirstEl.textContent = 'Haus ' + Math.max(0, Math.min(100, GameState.player.thirst));
}
