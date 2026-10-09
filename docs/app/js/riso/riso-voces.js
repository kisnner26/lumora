// quién canta cada verso en las colaboraciones: el reparto se busca en la web (el puente lo pide a Claude y lo guarda) y aquí se consulta por verso.
// si no se sabe, se devuelve null y las escenas muestran a todos por igual: nada de repartir por turnos al azar.
(() => {
  const R = window.RISO; if (!R) return;
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
  const V = R.voices = { songKey: '', state: 'idle', blocks: [], source: '', retry: 0,
    // créditos: [{name}]; se pide una sola vez por canción; las colaboraciones ya resueltas se recuerdan en este navegador
    ensure(credits) {
      if (typeof fetch !== 'function' || typeof IN === 'undefined' || !credits || credits.length < 2) return;
      const key = (typeof ext !== 'undefined' ? ext.key() : '') + '|' + credits.map(c => norm(c.name)).sort().join(','), lines = IN.lines.map((l, i) => ({ i, text: l.text })).filter(l => l.text);
      if (!lines.length) return;
      if (this.songKey !== key) { this.songKey = key; this.state = 'idle'; this.blocks = []; this.source = ''; this.retry = 0;
        try { const c = JSON.parse(localStorage.getItem('lumora_voces_' + key) || 'null'); if (c && Array.isArray(c.blocks)) { this.blocks = c.blocks; this.source = c.fuente || ''; this.state = 'ok'; } } catch (e) {} }
      if (this.state !== 'idle' || Date.now() < this.retry) return; this.state = 'loading';
      const titulo = (typeof ext !== 'undefined' && ext.st.name) || '', myKey = key;
      fetch('/voces', { method: 'POST', body: JSON.stringify({ titulo, creditos: credits.map(c => c.name), lines }) }).then(r => r.ok ? r.json() : Promise.reject(new Error('sin reparto')))
        .then(j => { if (this.songKey !== myKey) return; this.blocks = (j.bloques || []).filter(b => Number.isFinite(b.desde) && Number.isFinite(b.hasta)); this.source = j.fuente || ''; this.state = 'ok'; try { localStorage.setItem('lumora_voces_' + myKey, JSON.stringify({ blocks: this.blocks, fuente: this.source })); } catch (e) {} dispatchEvent(new CustomEvent('lumora:voces')); })
        .catch(() => { if (this.songKey === myKey) { this.state = 'idle'; this.retry = Date.now() + 180000; } });
    },
    // quién canta el verso li: {name, conf}, 'varios' o null si no se sabe con suficiente seguridad
    singerAt(li) {
      const b = this.blocks.find(x => li >= x.desde && li <= x.hasta); if (!b || b.confianza < .5 || b.voz === 'desconocido') return null;
      return b.voz === 'varios' ? 'varios' : { name: b.voz, conf: b.confianza };
    },
  };
})();
