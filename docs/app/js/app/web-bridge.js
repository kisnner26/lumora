// ============================================================
// web-bridge.js — lumora sin el puente de python (GitHub Pages).
// En la mac, bridge.py lee Música/Spotify con osascript y trae letras.
// En la web eso no existe, así que este archivo responde a los mismos
// endpoints (/now, /lyrics, ...) desde el navegador:
//   - lo que suena: API de Spotify (PKCE, sin servidor; el token vive solo en este navegador)
//   - letras: lrclib directo
// Solo se activa en *.github.io o con ?web=1. En la mac no hace nada.
// lumora · Kisnner Obando · polyform noncommercial
// ============================================================
(() => {
  if (!(location.hostname.endsWith('github.io') || /[?&]web=1/.test(location.search))) return;
  window.WEB = true;
  const CFG = window.LUMORA_WEB || {};
  const nativeFetch = window.fetch.bind(window);
  const J = o => new Response(JSON.stringify(o), { status: 200, headers: { 'Content-Type': 'application/json' } });
  const ls = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
  const cid = () => (CFG.clientId || ls.get('tc_cid') || '').replace(/^"|"$/g, '').trim();
  const tok = () => { try { return JSON.parse(ls.get('tc_tok')); } catch { return null; } };

  // ---------- spotify ----------
  const S = { state: 'off', pos: 0, at: 0, name: '', artist: '', album: '', dur: 0, art: '', error: '', id: '' };
  let backoff = 0;
  async function access() {
    let t = tok(); if (!t) return null;
    if (Date.now() > t.exp) {
      const r = await nativeFetch('https://accounts.spotify.com/api/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: cid(), grant_type: 'refresh_token', refresh_token: t.refresh }) });
      if (!r.ok) { ls.set('tc_tok', ''); return null; }
      const j = await r.json();
      t = { access: j.access_token, refresh: j.refresh_token || t.refresh, exp: Date.now() + j.expires_in * 1000 - 60000 }; ls.set('tc_tok', JSON.stringify(t));
    }
    return t.access;
  }
  window.WEB_STATE = S;                                       // para pruebas: S.fake = true congela el sondeo
  async function poll() {
    if (S.fake || Date.now() < backoff) return;
    try {
      const a = await access(); if (!a) { S.state = 'off'; S.error = ''; return; }
      const t0 = performance.now();
      const r = await nativeFetch('https://api.spotify.com/v1/me/player/currently-playing?additional_types=track,episode', { headers: { Authorization: 'Bearer ' + a } });
      if (r.status === 204) { S.state = 'stopped'; S.error = ''; return; }
      if (r.status === 429) { backoff = Date.now() + (+r.headers.get('Retry-After') || 5) * 1000; return; }
      if (r.status === 401) { ls.set('tc_tok', ''); S.state = 'off'; return; }
      if (r.status === 403) { S.state = 'off'; S.error = 'spotify no te dio acceso: pídele a kisnner26 que agregue tu correo'; return; }
      if (!r.ok) { S.error = 'spotify ' + r.status; return; }
      const j = await r.json(); if (!j.item) { S.state = 'stopped'; return; }
      const lat = (performance.now() - t0) / 2000;
      Object.assign(S, { state: j.is_playing ? 'playing' : 'paused', pos: j.progress_ms / 1000 + (j.is_playing ? lat : 0), at: Date.now() / 1000, name: j.item.name, artist: (j.item.artists || []).map(x => x.name).join(', ') || j.item.show?.publisher || j.item.show?.name || '', album: j.item.album?.name || j.item.show?.name || '', dur: (j.item.duration_ms || 0) / 1000, art: j.item.album?.images?.[0]?.url || j.item.images?.[0]?.url || '', error: '', id: j.item.id });
    } catch (e) { S.error = 'sin conexión con spotify'; }
  }
  setInterval(poll, 1100); poll();

  // ---------- letras (lrclib, igual que bridge.py) ----------
  const LC = {};
  const cleanTitle = t => t.replace(/\s*[(\[](feat|ft|with)\.?[^)\]]*[)\]]/i, '').replace(/\s*-\s*(remaster|live|radio edit|single version).*$/i, '').trim();
  const gj = async u => { try { const r = await nativeFetch(u); return r.ok ? await r.json() : null; } catch { return null; } };
  async function lyrics(artist, title, album, dur) {
    const key = (artist + '|' + title).toLowerCase(); if (LC[key]) return LC[key];
    const a = artist.split(',')[0].split('&')[0].trim(), t = cleanTitle(title), q = o => new URLSearchParams(o);
    let out = { none: true }, reached = false;
    let d = await gj('https://lrclib.net/api/get?' + q({ artist_name: a, track_name: t, album_name: album, duration: Math.round(dur) }));
    if (!(d && (d.syncedLyrics || d.plainLyrics)) && t !== title) d = await gj('https://lrclib.net/api/get?' + q({ artist_name: a, track_name: title, album_name: album, duration: Math.round(dur) }));
    if (d && d.instrumental) out = { instrumental: true };
    else if (d && d.syncedLyrics) out = { synced: d.syncedLyrics, source: 'lrclib' };
    else {
      let res = await gj('https://lrclib.net/api/search?' + q({ artist_name: a, track_name: t })); reached = res !== null;
      res = (res || []).filter(r => r.syncedLyrics || r.plainLyrics);
      const diff = r => Math.abs((r.duration || 0) - dur), by = (x, y) => diff(x) - diff(y);
      const synced = res.filter(r => r.syncedLyrics).sort(by);
      const plain = (d && d.plainLyrics) || (res.slice().sort(by).find(r => r.plainLyrics && diff(r) <= 3) || {}).plainLyrics || '';
      if (synced.length && diff(synced[0]) <= 3) out = { synced: synced[0].syncedLyrics, source: 'lrclib' };
      else if (synced.length && diff(synced[0]) <= 12 && synced[0].duration) out = { synced: synced[0].syncedLyrics, source: 'lrclib', approx: 'stretch', scale: dur / synced[0].duration };
      else if (plain) out = { plain, source: 'lrclib', approx: 'plain' };
    }
    if (d || reached) LC[key] = out;
    return out;
  }

  // ---------- los endpoints del puente ----------
  window.fetch = (input, init) => {
    const raw = typeof input === 'string' ? input : input.url;
    if (!raw || /^https?:/.test(raw) || raw.startsWith('//') || raw.startsWith('data:') || raw.startsWith('blob:')) return nativeFetch(input, init);
    const u = new URL(raw, location.href), p = u.pathname.replace(/^.*\/(?=[a-z]+$)/, '/');
    if (!/^\/[a-z]+$/.test(p) || p === '/index' ) return nativeFetch(input, init);
    switch (p) {
      case '/now': return Promise.resolve(J({ state: S.state, pos: S.pos, at: S.at, server: Date.now() / 1000, name: S.name, artist: S.artist, album: S.album, dur: S.dur, art: S.art, src: 'spotify', id: S.id, error: S.error }));
      case '/lyrics': { const g = k => u.searchParams.get(k) || ''; return lyrics(g('artist'), g('title'), g('album'), +g('dur') || 0).then(J); }
      case '/story': return Promise.resolve(J(u.searchParams.get('catalog') ? {} : { ready: false }));
      case '/translate': return Promise.resolve(J({ error: 'la traducción solo está en la versión de mac' }));
      case '/prefs': return Promise.resolve(J({ sessions: 0, text: '' }));
      case '/cmd': return Promise.resolve(J({ ok: false }));
      case '/bpm': case '/next': case '/like': case '/autor': case '/lights': case '/convert': case '/wiki': return Promise.resolve(J({}));
      default: return Promise.resolve(J({}));
    }
  };

  // ---------- tarjeta para conectar spotify + crédito ----------
  const css = document.createElement('style');
  css.textContent = `#webCard{position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:60;background:#f6ecd7;border:3px solid #2b2a7a;box-shadow:5px 5px 0 #f07a2b;padding:10px 14px;font:600 13px 'Martian Mono',monospace;color:#2b2a7a;display:flex;gap:10px;align-items:center;max-width:94vw;flex-wrap:wrap}
  #webCard button{font:inherit;background:#2b2a7a;color:#f6ecd7;border:0;padding:7px 12px;cursor:pointer}#webCard input{font:inherit;border:2px solid #2b2a7a;background:#fff8e8;padding:6px;width:260px;max-width:60vw;color:#2b2a7a}
  #webCredit{position:fixed;left:10px;bottom:8px;z-index:60;font:600 11px 'Martian Mono',monospace;color:#2b2a7a;background:#f6ecd7cc;padding:4px 8px;border:2px solid #2b2a7a}#webCredit a{color:#c24a0a}`;
  document.head.appendChild(css);
  const credit = document.createElement('div'); credit.id = 'webCredit';
  credit.innerHTML = 'lumora · hecho por <a href="https://github.com/kisnner26" target="_blank" rel="noopener">kisnner26</a> · uso no comercial, con créditos · <a href="https://github.com/kisnner26/lumora/blob/main/LICENSE.md" target="_blank" rel="noopener">licencia</a>';
  const card = document.createElement('div'); card.id = 'webCard';
  async function login() {
    const id = (document.getElementById('webCid') || {}).value || cid(); if (!id.trim()) return;
    ls.set('tc_cid', id.trim());
    const b64u = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const ver = b64u(crypto.getRandomValues(new Uint8Array(48))); ls.set('tc_verifier', ver);
    const ch = b64u(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ver)));
    location.href = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({ response_type: 'code', client_id: id.trim(), scope: 'user-read-currently-playing user-read-playback-state', redirect_uri: location.origin + location.pathname, code_challenge_method: 'S256', code_challenge: ch, show_dialog: 'true' });
  }
  function paint() {
    const on = !!tok() && (ls.get('tc_tok') || '').length > 5;
    if (on && S.state !== 'off') { card.style.display = 'none'; return; }
    card.style.display = 'flex';
    if (on) { card.innerHTML = '<span>' + (S.error || 'conectando con spotify…') + '</span>'; return; }
    card.innerHTML = 'para empezar, conecta spotify y dale play a una canción ' + (cid() ? '' : '<input id="webCid" placeholder="client id de spotify">') + '<button id="webLogin">conectar spotify</button>';
    card.querySelector('#webLogin').onclick = login;
  }
  addEventListener('DOMContentLoaded', () => { document.body.append(card, credit); paint(); setInterval(paint, 1500); });
})();
