// ============================================================
// riso-store.js — memoria local de lumora (todo queda en este navegador).
// IndexedDB con respaldo en localStorage. Colecciones: historial, letras, posters,
// dedicatorias, criatura, misc. Cada una tiene un tope y se limpia sola (lo más viejo primero).
//   await RISOSTORE.set('misc', 'clave', valor) · get · add(col, valor) -> id · list(col, {limit}) · del · clear
// Además registra cada canción que suena (historial y letras) para el atlas, los pósters y la criatura.
// ============================================================
const RISOSTORE = window.RISOSTORE = (() => {
  const CAPS = { historial: 1500, letras: 300, posters: 60, dedicatorias: 40, criatura: 5, misc: 200 };
  const DB = 'lumora', mem = {}; let dbp = null, useLS = false;
  const open = () => dbp || (dbp = new Promise(res => {
    try {
      const rq = indexedDB.open(DB, 1);
      rq.onupgradeneeded = () => { for (const c of Object.keys(CAPS)) if (!rq.result.objectStoreNames.contains(c)) rq.result.createObjectStore(c, { keyPath: 'k' }); };
      rq.onsuccess = () => res(rq.result); rq.onerror = () => { useLS = true; res(null); };
    } catch (e) { useLS = true; res(null); }
  }));
  const lsRead = c => { try { return JSON.parse(localStorage.getItem('lumora_' + c) || '[]'); } catch (e) { return mem[c] || []; } };
  const lsWrite = (c, arr) => { mem[c] = arr; try { localStorage.setItem('lumora_' + c, JSON.stringify(arr)); } catch (e) { while (arr.length > 4) { arr.shift(); try { localStorage.setItem('lumora_' + c, JSON.stringify(arr)); return; } catch (e2) {} } } };
  const tx = async (c, mode, fn) => { const db = await open(); if (!db) return null;
    return new Promise((res, rej) => { const t = db.transaction(c, mode), os = t.objectStore(c); let out; try { out = fn(os); } catch (e) { return rej(e); }
      t.oncomplete = () => res(out && 'result' in out ? out.result : out); t.onerror = () => rej(t.error); }); };
  async function all(c) {
    await open(); if (useLS) return lsRead(c);
    const db = await dbp; return new Promise(res => { const r = db.transaction(c).objectStore(c).getAll(); r.onsuccess = () => res(r.result || []); r.onerror = () => res([]); });
  }
  async function prune(c) { const rows = await all(c); if (rows.length <= CAPS[c]) return; rows.sort((a, b) => (a.t || 0) - (b.t || 0));
    for (const r of rows.slice(0, rows.length - CAPS[c])) await del(c, r.k); }
  async function set(c, k, v) {
    const row = { k: String(k), v, t: Date.now() }; await open();
    if (useLS) { const arr = lsRead(c).filter(r => r.k !== row.k); arr.push(row); lsWrite(c, arr); }
    else await tx(c, 'readwrite', os => os.put(row));
    prune(c); return v;
  }
  async function get(c, k) {
    await open(); if (useLS) return (lsRead(c).find(r => r.k === String(k)) || {}).v;
    const db = await dbp; return new Promise(res => { const r = db.transaction(c).objectStore(c).get(String(k)); r.onsuccess = () => res(r.result?.v); r.onerror = () => res(undefined); });
  }
  async function del(c, k) { await open(); if (useLS) return lsWrite(c, lsRead(c).filter(r => r.k !== String(k))); return tx(c, 'readwrite', os => os.delete(String(k))); }
  async function add(c, v) { const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6); await set(c, id, v); return id; }
  async function list(c, o = {}) { const rows = (await all(c)).sort((a, b) => (b.t || 0) - (a.t || 0)); return (o.limit ? rows.slice(0, o.limit) : rows).map(r => ({ id: r.k, t: r.t, ...(typeof r.v === 'object' && r.v ? r.v : { valor: r.v }) })); }
  async function clear(c) { await open(); if (useLS) return lsWrite(c, []); return tx(c, 'readwrite', os => os.clear()); }
  async function size() { const o = {}; for (const c of Object.keys(CAPS)) o[c] = (await all(c)).length; return o; }

  // ---------- registro de canciones ----------
  const cur = { key: '', t0: 0, ended: false, rec: null };
  const songKey = () => (typeof ext !== 'undefined' && ext.key && ext.key()) || '';
  const moodTop = () => { try { const c = {}; for (const p of SEM.plans || []) if (p?.mood) c[p.mood] = (c[p.mood] || 0) + 1; return Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0] || ''; } catch (e) { return ''; } };
  async function begin() {
    const s = ext.st, key = songKey(); if (!key || !s.name) return;
    if (cur.key === key && !cur.ended) return;                      // reanudar la misma no cuenta otra vez
    cur.key = key; cur.t0 = Date.now(); cur.ended = false;
    const prev = (await get('historial', key)) || {};
    cur.rec = { key, name: s.name, artist: s.artist || '', album: s.album || '', dur: s.dur || 0, genre: prev.genre || '', mood: prev.mood || '', veces: (prev.veces || 0) + 1, primera: prev.primera || Date.now(), ultima: Date.now() };
    await set('historial', key, cur.rec);
  }
  async function finish(why) {
    if (!cur.rec || cur.ended) return; cur.ended = true;
    const snap = { lineas: (IN.lines || []).filter(l => l.text).map(l => [Math.round(l.t * 100) / 100, l.text]), cuts: (IN.cuts || []).slice(), synced: IN.synced };   // se toma ya: startProc reinicia IN enseguida
    cur.rec.genre = (typeof IN !== 'undefined' && IN.genre) || cur.rec.genre; cur.rec.mood = moodTop() || cur.rec.mood; cur.rec.ultima = Date.now(); cur.rec.completa = why === 'fin';
    await set('historial', cur.rec.key, cur.rec);
    try { if (snap.lineas.length && snap.synced) await set('letras', cur.rec.key, { name: cur.rec.name, artist: cur.rec.artist, lineas: snap.lineas, cuts: snap.cuts }); } catch (e) {}
    window.dispatchEvent(new CustomEvent('riso:cancion-fin', { detail: { ...cur.rec, why } }));
  }
  // al empezar una canción (y al cambiar a otra, la anterior se cierra)
  if (typeof startProc === 'function') { const _sp = startProc; startProc = function () { const k = songKey(); if (cur.key && k !== cur.key) finish('cambio'); const r = _sp.apply(this, arguments); setTimeout(begin, 300); return r; }; }
  window.addEventListener('riso:outro', () => finish('fin'));
  return { get, set, add, list, del, clear, size, caps: CAPS, finish, begin, get actual() { return cur.rec; } };
})();
