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
  profile: { playerName:'Rian', shopName:'Bengkel Berkah', complete:false },
  story: {
    tutorialSeen:false,
    chapter:1,
    title:'Bab 1: Langkah Pertama',
    summary:'Rian memulai hari dengan tekad baru untuk membangun bengkel kecil di depan rumah.',
    text:'Hari pertamamu dimulai dengan semangat baru. Rumah kecil, alat terbatas, dan niat kuat untuk membangun bengkel motor yang siap melayani pelanggan.'
  },
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
  }
  GameState.profile.complete = true;
  GameState.boot.introComplete = true;
}

export function ensureStoryState() {
  GameState.story = {
    tutorialSeen: !!GameState.story?.tutorialSeen,
    chapter: Number(GameState.story?.chapter || 1),
    title: GameState.story?.title || 'Bab 1: Langkah Pertama',
    summary: GameState.story?.summary || 'Rian memulai harinya dengan semangat membangun bengkel baru.',
    text: GameState.story?.text || 'Hari pertamamu dimulai dengan rumah kecil, bengkel baru, dan harapan besar.'
  };

  if (!GameState.story.title || !GameState.story.text) {
    GameState.story.title = GameState.quest.title;
    GameState.story.summary = GameState.quest.desc;
    GameState.story.text = GameState.quest.desc;
  }
}

export function setStoryChapter(chapter = 1) {
  const safeChapter = Math.max(1, Number(chapter) || 1);
  const chapters = {
    1: {
      title: 'Bab 1: Langkah Pertama',
      summary: 'Rian memulai hari dengan tekad baru untuk membangun bengkel kecil di depan rumah.',
      text: 'Hari pertamamu dimulai dengan rumah sederhana, bengkel kecil, dan niat kuat untuk membuka usaha yang layak di masa depan.'
    },
    2: {
      title: 'Bab 2: Pelanggan Pertama',
      summary: 'Bengkel mulai dikenal dan langkah pertama pelanggan datang dengan kebutuhan servis.',
      text: 'Mas Budi datang membawa motor dengan keluhan sederhana, tetapi ini adalah momen penting untuk membangun reputasi dan kepercayaan pelanggan.'
    },
    3: {
      title: 'Bab 3: Masa Sulit, Semangat Tinggi',
      summary: 'Saldo mulai berkurang, tenaga menipis, tapi pengalaman dan reputasi terus tumbuh.',
      text: 'Setiap servis adalah ujian. Rian belajar menjaga tenaga, uang, dan kualitas kerja agar usaha bengkel ini tetap bertahan.'
    },
    4: {
      title: 'Bab 4: Jalan Menuju Bengkel Besar',
      summary: 'Bengkel mulai berkembang, kebutuhan alat bertambah, dan reputasi mulai menyebar.',
      text: 'Dari satu ruang kerja kecil, usaha ini mulai melangkah menuju bengkel yang lebih rapi, lebih profesional, dan lebih siap melayani banyak pelanggan.'
    }
  };

  const chapterData = chapters[safeChapter] || chapters[1];
  GameState.story.chapter = safeChapter;
  GameState.story.title = chapterData.title;
  GameState.story.summary = chapterData.summary;
  GameState.story.text = chapterData.text;
  GameState.quest.chapter = safeChapter;
  GameState.quest.title = chapterData.title;
  GameState.quest.desc = chapterData.summary;
}
