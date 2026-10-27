/* Leitor de legislação. Os textos vêm de assets/js/data/leis/<id>.js (Markdown do acervo ctresb/leis).
   Funciona abrindo o index direto do disco: cada lei é carregada como script, sem fetch. */
(() => {
  'use strict';
  const base = document.currentScript ? document.currentScript.src.replace(/legislacao\.js.*$/, '') : 'assets/js/';
  const $ = (s, r = document) => r.querySelector(s);
  const cartoes = [...document.querySelectorAll('.lei-card')];
  const leitor = $('#leitor');
  if (!leitor) return;
  const el = {
    titulo: $('#leitor-titulo'), meta: $('#leitor-meta'), texto: $('#lei-texto'), busca: $('#lei-busca'),
    ir: $('#lei-ir'), resultados: $('#lei-resultados'), indice: $('#lei-indice'), btnIndice: $('#lei-btn-indice'),
    barra: $('#leitor-barra'), vazio: $('#leitor-vazio'), aviso: $('#leitor-aviso')
  };
  window.LEIS_DADOS = window.LEIS_DADOS || {};
  let atual = null, paragrafos = [], artigos = new Map();

  const norm = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  function inline(t) {
    let s = esc(t);
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
    return s;
  }
  function idArtigo(txt, usados) {
    const m = txt.match(/^\*\*\s*Art\.?\s*(\d+(?:\.\d+)*)\s*(?:[º°o]|\.)?\s*[-–]?\s*([A-Z])?\b/);
    if (!m) return null;
    let id = 'art-' + m[1].replace(/\./g, '') + (m[2] ? '-' + m[2].toLowerCase() : '');
    const k = usados.get(id) || 0; usados.set(id, k + 1);
    return { id: k ? id + '-v' + (k + 1) : id, num: m[1].replace(/\./g, '') + (m[2] || '') };
  }
  function classePar(t) {
    const s = t.replace(/^\*+/, '');
    if (/^(§|Parágrafo único)/.test(s)) return 'par';
    if (/^[IVXLCDM]+\s*[-–—]\s/.test(s)) return 'inc';
    if (/^[a-z]\)\s/.test(s)) return 'ali';
    return '';
  }
  function tabela(linhas) {
    const cel = l => l.trim().replace(/^\||\|$/g, '').split('|').map(c => inline(c.trim()));
    const cab = cel(linhas[0]), corpo = linhas.slice(2).map(cel);
    return '<div class="tabela"><table><thead><tr>' + cab.map(c => '<th>' + c + '</th>').join('') + '</tr></thead><tbody>' +
      corpo.map(r => '<tr>' + r.map(c => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
  }
  function renderizar(md) {
    const linhas = md.replace(/\r/g, '').split('\n');
    const out = [], toc = [], usados = new Map(), indiceArt = new Map(), blocos = [];
    let i = 0;
    while (i < linhas.length) {
      const l = linhas[i];
      if (!l.trim()) { i++; continue; }
      let m;
      if ((m = l.match(/^(#{1,5})\s+(.*)$/))) {
        const nivel = Math.min(5, Math.max(2, m[1].length + (m[1].length === 1 ? 1 : 0)));
        const id = 'sec-' + toc.length;
        toc.push({ id, nivel, texto: m[2].replace(/\*+/g, '') });
        out.push('<h' + nivel + ' id="' + id + '">' + inline(m[2]) + '</h' + nivel + '>');
        i++; continue;
      }
      if (/^\s*(---+|\*\*\*+)\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
      if (l.startsWith('>')) {
        const q = [];
        while (i < linhas.length && linhas[i].startsWith('>')) q.push(linhas[i++].replace(/^>\s?/, ''));
        out.push('<blockquote>' + inline(q.join(' ')) + '</blockquote>'); continue;
      }
      if (l.trim().startsWith('|') && linhas[i + 1] && /^\s*\|?\s*:?-{2,}/.test(linhas[i + 1])) {
        const t = [];
        while (i < linhas.length && linhas[i].trim().startsWith('|')) t.push(linhas[i++]);
        out.push(tabela(t)); continue;
      }
      const par = [];
      while (i < linhas.length && linhas[i].trim() && !/^(#{1,5}\s|>|---+\s*$)/.test(linhas[i])) par.push(linhas[i++]);
      let txt = '';
      par.forEach((p, k) => { txt += (k ? (/ {2,}$/.test(par[k - 1]) ? '<br>' : ' ') : '') + inline(p.replace(/ {2,}$/, '')); });
      const bruto = par[0].trim();
      const a = idArtigo(bruto, usados);
      if (a) {
        if (!indiceArt.has(a.num.toLowerCase())) indiceArt.set(a.num.toLowerCase(), a.id);
        out.push('<p class="art" id="' + a.id + '" data-art="' + a.num + '">' + txt + '</p>');
      } else {
        const c = classePar(bruto);
        out.push('<p' + (c ? ' class="' + c + '"' : '') + '>' + txt + '</p>');
      }
    }
    return { html: out.join('\n'), toc, indiceArt };
  }

  function carregar(id) {
    return new Promise((ok, falha) => {
      if (window.LEIS_DADOS[id]) return ok(window.LEIS_DADOS[id]);
      const s = document.createElement('script');
      s.src = base + 'data/leis/' + id + '.js';
      s.onload = () => window.LEIS_DADOS[id] ? ok(window.LEIS_DADOS[id]) : falha(new Error('dados ausentes'));
      s.onerror = () => falha(new Error('arquivo não encontrado'));
      document.head.append(s);
    });
  }

  async function abrir(id, artigo) {
    const card = cartoes.find(c => c.dataset.id === id);
    if (!card) return;
    cartoes.forEach(c => c.setAttribute('aria-current', String(c === card)));
    el.vazio.hidden = true; leitor.hidden = false;
    el.titulo.textContent = card.dataset.nome;
    el.meta.textContent = 'Carregando texto…';
    el.texto.innerHTML = '';
    let lei;
    try { lei = await carregar(id); }
    catch (e) { el.meta.textContent = 'Não foi possível carregar esta lei (' + e.message + ').'; return; }
    if (card.getAttribute('aria-current') !== 'true') return;      // usuário trocou de lei durante o carregamento
    const r = renderizar(lei.md);
    el.texto.innerHTML = r.html;
    paragrafos = [...el.texto.children].filter(n => n.tagName === 'P' || /^H[2-5]$/.test(n.tagName)).map(n => ({ n, t: norm(n.textContent) }));
    artigos = r.indiceArt; atual = lei;
    el.meta.innerHTML = '';
    const partes = [lei.referencia, lei.ementa, lei.artigos + ' artigos'].filter(Boolean);
    el.meta.append(document.createTextNode(partes.join(' · ') + ' · '));
    if (/^https?:\/\//.test(lei.fonte)) {
      const a = document.createElement('a'); a.href = lei.fonte; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = 'fonte oficial';
      el.meta.append(a);
    }
    if (lei.baixadoEm) el.meta.append(document.createTextNode(' · texto obtido em ' + lei.baixadoEm.split('-').reverse().join('/')));
    el.indice.innerHTML = r.toc.filter(t => t.nivel <= 4).map(t => '<a href="#' + t.id + '" data-n="' + t.nivel + '">' + esc(t.texto) + '</a>').join('');
    el.indice.hidden = true; el.btnIndice.setAttribute('aria-expanded', 'false');
    el.resultados.hidden = true; el.busca.value = ''; el.ir.value = '';
    el.aviso.hidden = false;
    history.replaceState(null, '', '#' + id + (artigo ? '/' + artigo : ''));
    if (artigo) irParaArtigo(artigo, false); else leitor.scrollIntoView({ block: 'start' });
  }

  function destacar(n, suave) {
    el.texto.querySelectorAll('.alvo').forEach(x => x.classList.remove('alvo'));
    n.classList.add('alvo');
    n.scrollIntoView({ block: 'start', behavior: suave ? 'smooth' : 'auto' });
    if (!n.hasAttribute('tabindex')) n.setAttribute('tabindex', '-1');
    n.focus({ preventScroll: true });
  }
  function irParaArtigo(valor, suave = true) {
    const v = String(valor).toLowerCase().replace(/^art\.?\s*/, '').replace(/[º°.\s]/g, '').replace(/^(\d+)-?([a-z])$/, '$1$2');
    const id = artigos.get(v) || artigos.get(v.replace(/-/g, ''));
    const n = id && document.getElementById(id);
    if (!n) { el.ir.setCustomValidity('Artigo não encontrado'); el.ir.reportValidity(); el.ir.setCustomValidity(''); return false; }
    destacar(n, suave); return true;
  }

  function buscar(q) {
    const termo = norm(q.trim());
    if (termo.length < 3) { el.resultados.hidden = true; el.resultados.innerHTML = ''; return; }
    const achados = [];
    for (const p of paragrafos) {
      const pos = p.t.indexOf(termo);
      if (pos < 0) continue;
      achados.push({ p, pos });
      if (achados.length >= 60) break;
    }
    el.resultados.hidden = false;
    if (!achados.length) { el.resultados.innerHTML = '<p class="leitor-meta" style="padding:8px 10px">Nenhum trecho com “' + esc(q) + '”.</p>'; return; }
    el.resultados.innerHTML = '';
    achados.forEach(({ p, pos }, k) => {
      const b = document.createElement('button'); b.type = 'button';
      const txt = p.n.textContent;
      const ini = Math.max(0, pos - 40);
      const trecho = txt.slice(ini, ini + 170);
      const rel = pos - ini;
      const ref = p.n.dataset.art ? 'Art. ' + p.n.dataset.art : (/^H/.test(p.n.tagName) ? 'Seção' : '§');
      b.innerHTML = '<span class="ref">' + esc(ref) + '</span>' + (ini ? '… ' : '') + esc(trecho.slice(0, rel)) + '<mark>' + esc(trecho.slice(rel, rel + termo.length)) + '</mark>' + esc(trecho.slice(rel + termo.length)) + ' …';
      b.addEventListener('click', () => destacar(p.n, true));
      el.resultados.append(b);
    });
  }

  let temp;
  el.busca.addEventListener('input', () => { clearTimeout(temp); temp = setTimeout(() => buscar(el.busca.value), 160); });
  el.ir.addEventListener('keydown', e => { if (e.key === 'Enter' && el.ir.value.trim()) { e.preventDefault(); if (irParaArtigo(el.ir.value)) history.replaceState(null, '', '#' + atual.id + '/' + el.ir.value.trim().toLowerCase().replace(/[^0-9a-z]/g, '')); } });
  el.btnIndice.addEventListener('click', () => {
    const abrirIdx = el.indice.hidden; el.indice.hidden = !abrirIdx; el.btnIndice.setAttribute('aria-expanded', String(abrirIdx));
  });
  el.indice.addEventListener('click', e => {
    const a = e.target.closest('a'); if (!a) return;
    e.preventDefault();
    const alvo = document.getElementById(a.getAttribute('href').slice(1));
    if (alvo) { destacar(alvo, true); el.indice.hidden = true; el.btnIndice.setAttribute('aria-expanded', 'false'); }
  });
  cartoes.forEach(c => c.addEventListener('click', e => { e.preventDefault(); abrir(c.dataset.id); }));

  function doHash() {
    const m = location.hash.slice(1).match(/^([a-z0-9-]+)(?:\/([0-9a-z]+))?$/);
    if (m && cartoes.some(c => c.dataset.id === m[1])) abrir(m[1], m[2]);
  }
  addEventListener('hashchange', () => { if (!atual || location.hash.slice(1).split('/')[0] !== atual.id) doHash(); });
  doHash();
})();
