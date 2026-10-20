import { GameState, SAVE_KEY, ensureStoryState, setStoryChapter } from './game-state.js';

const STORY_PANEL_ID = 'story-panel';

function ensurePanel() {
  let panel = document.getElementById(STORY_PANEL_ID);
  if (panel) return panel;

  panel = document.createElement('div');
  panel.id = STORY_PANEL_ID;
  panel.style.position = 'absolute';
  panel.style.left = '50%';
  panel.style.bottom = '72px';
  panel.style.transform = 'translateX(-50%)';
  panel.style.width = 'min(92vw, 540px)';
  panel.style.background = 'rgba(15, 20, 30, 0.9)';
  panel.style.border = '1px solid rgba(243, 156, 18, 0.8)';
  panel.style.borderRadius = '16px';
  panel.style.boxShadow = '0 12px 30px rgba(0,0,0,0.35)';
  panel.style.padding = '16px 18px';
  panel.style.color = '#fff';
  panel.style.zIndex = '120';
  panel.style.display = 'none';
  panel.style.fontFamily = 'Segoe UI, Tahoma, sans-serif';

  const title = document.createElement('div');
  title.id = 'story-title';
  title.style.fontSize = '14px';
  title.style.fontWeight = '800';
  title.style.color = '#f5b942';
  title.style.marginBottom = '8px';
  title.style.letterSpacing = '0.04em';

  const summary = document.createElement('div');
  summary.id = 'story-summary';
  summary.style.fontSize = '12px';
  summary.style.color = '#dfe7f4';
  summary.style.marginBottom = '6px';

  const text = document.createElement('div');
  text.id = 'story-text';
  text.style.fontSize = '12px';
  text.style.lineHeight = '1.6';
  text.style.color = '#f2f5f8';

  const close = document.createElement('button');
  close.textContent = 'Lanjut';
  close.style.marginTop = '12px';
  close.style.border = 'none';
  close.style.borderRadius = '10px';
  close.style.padding = '8px 14px';
  close.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
  close.style.color = '#fff';
  close.style.fontWeight = '700';
  close.style.cursor = 'pointer';
  close.onclick = () => panel.style.display = 'none';

  panel.appendChild(title);
  panel.appendChild(summary);
  panel.appendChild(text);
  panel.appendChild(close);

  document.getElementById('game-container')?.appendChild(panel);
  return panel;
}

export function syncStoryPanel() {
  ensureStoryState();
  const panel = ensurePanel();
  const title = document.getElementById('story-title');
  const summary = document.getElementById('story-summary');
  const text = document.getElementById('story-text');

  if (!title || !summary || !text) return;

  title.textContent = GameState.story.title || 'Bab 1: Langkah Pertama';
  summary.textContent = GameState.story.summary || 'Rian memulai hari dengan tekad baru.';
  text.textContent = GameState.story.text || 'Hari pertamamu dimulai di rumah kecil dan bengkel baru.';

  if (GameState.profile?.complete || GameState.boot?.introComplete) {
    panel.style.display = 'block';
  }
}

export function advanceStoryChapter(nextChapter) {
  setStoryChapter(nextChapter);
  syncStoryPanel();
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(GameState));
  } catch (e) {
    console.warn('Story save sync failed', e);
  }
}

export function initStorySystem() {
  ensureStoryState();
  syncStoryPanel();
}

export function hideStoryPanel() {
  const panel = document.getElementById(STORY_PANEL_ID);
  if (panel) panel.style.display = 'none';
}

export function showStoryPanel() {
  const panel = ensurePanel();
  syncStoryPanel();
  panel.style.display = 'block';
}
