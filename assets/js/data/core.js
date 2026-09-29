/* CARREIRAS POLICIAIS — core.js
   Seções preservadas na ordem de dependência. Procure o título da seção para editar. */


/* ===== core/content-repository.js ===== */
/* ======================================================================
   Repositório de conteúdo — interface de dados pronta para o futuro Admin.
   A base inicial vem de GMData; alterações do usuário ficam neste navegador.
   Nenhum HTML fornecido pelo usuário é executado por este módulo.
   ====================================================================== */
(function (global) {
  'use strict';

  var D = global.GMData;
  var STORAGE_KEY = 'gma_aj_u_admin_content_v1';
  var COLLECTIONS = { materias: true, cards: true };
  var FIELDS = {
    materias: ['id', 'nome', 'nomeCronograma', 'area', 'escopo', 'cor', 'icone',
      'ordem', 'descricao', 'edital', 'pasta', 'cor_card', 'imagem_url'],
    cards: ['id', 'materiaId', 'materia', 'pasta', 'titulo', 'descricao',
      'cor_card', 'imagem_url', 'conteudo_md_ou_html', 'ordem', 'kicker',
      'origem', 'fonte', 'dias', 'videos', 'questoes', 'semTeoria']
  };

  function freshState() {
    return { version: 1, materias: { novos: [], alterados: {}, removidos: [] },
      cards: { novos: [], alterados: {}, removidos: [] } };
  }
  function readState() {
    try {
      var parsed = JSON.parse(global.localStorage.getItem(STORAGE_KEY) || 'null');
      if (!parsed || parsed.version !== 1) return freshState();
      return parsed;
    } catch (e) { return freshState(); }
  }
  var state = readState();

  function copy(value) { return JSON.parse(JSON.stringify(value)); }
  function slug(value) {
    return String(value || '').toLowerCase().normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  function normalizarColor(value) {
    var color = String(value || '').trim();
    if (!color || /^(var\(--[a-z0-9-]+(?:\s*,\s*var\(--[a-z0-9-]+\))?\)|#[0-9a-f]{3,8}|[a-z]+)$/i.test(color)) return color;
    throw new Error('Use um token de cor do Design System ou uma cor CSS simples.');
  }
  function notificar(collection, action, id) {
    try {
      global.dispatchEvent(new CustomEvent('gm:content-change', {
        detail: { collection: collection, action: action, id: id }
      }));
    } catch (e) { /* Eventos são opcionais para consumidores externos. */ }
  }
  function persist(collection, action, id) {
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      throw new Error('Não foi possível salvar neste navegador. Verifique o espaço disponível.');
    }
    notificar(collection, action, id);
  }
  function itemBase(collection, id) {
    var list = collection === 'materias' ? D.materias : D.assuntosTodos();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }
  function normalizarBase(collection, source) {
    if (collection === 'materias') {
      var m = copy(source);
      m.pasta = m.pasta || m.id;
      m.cor_card = m.cor_card || m.cor || '';
      m.imagem_url = m.imagem_url || '';
      return m;
    }
    var materia = D.materia(source.materiaId) || {};
    return {
      id: source.id,
      materiaId: source.materiaId,
      materia: materia.nome || '',
      pasta: materia.pasta || materia.id || source.materiaId,
      titulo: source.titulo,
      descricao: source.kicker || '',
      cor_card: materia.cor_card || materia.cor || '',
      imagem_url: source.imagem_url || '',
      conteudo_md_ou_html: copy(source.blocos || []),
      ordem: source.ordem || 0,
      kicker: source.kicker || '',
      origem: source.origem || 'teoria',
      fonte: source.fonte || '',
      dias: copy(source.dias || []),
      videos: copy(source.videos || []),
      questoes: source.questoes || 0,
      semTeoria: !!source.semTeoria
    };
  }
  function list(collection, materiaId) {
    if (!COLLECTIONS[collection]) throw new Error('Coleção desconhecida.');
    var source = collection === 'materias' ? D.materias : D.assuntosTodos();
    var bucket = state[collection];
    var idsRemovidos = bucket.removidos;
    var result = source.filter(function (item) { return idsRemovidos.indexOf(item.id) === -1; })
      .map(function (item) {
        var output = normalizarBase(collection, item);
        var changed = bucket.alterados[item.id] || {};
        Object.keys(changed).forEach(function (key) { output[key] = copy(changed[key]); });
        return output;
      });
    result = result.concat(copy(bucket.novos));
    if (collection === 'cards' && materiaId) {
      result = result.filter(function (item) { return item.materiaId === materiaId; });
    }
    return result.sort(function (a, b) { return (a.ordem || 0) - (b.ordem || 0); });
  }
  function get(collection, id) {
    return list(collection).filter(function (item) { return item.id === id; })[0] || null;
  }
  function clean(collection, data, partial) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Envie um objeto de dados.');
    var result = {};
    FIELDS[collection].forEach(function (field) {
      if (!Object.prototype.hasOwnProperty.call(data, field)) return;
      result[field] = copy(data[field]);
    });
    if (result.cor_card) result.cor_card = normalizarColor(result.cor_card);
    if (result.imagem_url && !/^(https?:\/\/|\/|\.\/|\.\.\/|data:image\/)/i.test(result.imagem_url)) {
      throw new Error('A imagem deve usar URL http(s), caminho local ou data:image.');
    }
    if (!partial) {
      var title = collection === 'materias' ? result.nome : result.titulo;
      if (!title || !String(title).trim()) throw new Error('O título é obrigatório.');
      if (collection === 'cards' && !result.materiaId) throw new Error('Selecione a matéria do card.');
      if (collection === 'cards' && result.conteudo_md_ou_html === undefined) result.conteudo_md_ou_html = [];
      if (result.ordem === undefined) result.ordem = 999;
    }
    return result;
  }
  function uniqueId(collection, id, currentId) {
    if (!id) return false;
    return list(collection).every(function (item) { return item.id !== id || item.id === currentId; });
  }
  function create(collection, data) {
    if (!COLLECTIONS[collection]) throw new Error('Coleção desconhecida.');
    var item = clean(collection, data, false);
    item.id = item.id || slug(collection === 'materias' ? item.nome : item.titulo);
    if (!item.id) throw new Error('Não foi possível gerar um identificador para este item.');
    if (!uniqueId(collection, item.id)) throw new Error('Já existe um item com este identificador.');
    if (collection === 'cards') {
      var m = D.materia(item.materiaId);
      var customSubject = get('materias', item.materiaId);
      if (!m && !customSubject) throw new Error('A matéria selecionada não existe.');
      item.materia = item.materia || (customSubject && customSubject.nome) || m.nome;
      item.pasta = item.pasta || (customSubject && customSubject.pasta) || m.id;
    } else {
      item.pasta = item.pasta || item.id;
      item.cor_card = item.cor_card || item.cor || '';
    }
    state[collection].novos.push(item);
    persist(collection, 'create', item.id);
    return copy(item);
  }
  function update(collection, id, changes) {
    if (!COLLECTIONS[collection]) throw new Error('Coleção desconhecida.');
    var current = get(collection, id);
    if (!current) throw new Error('Item não encontrado.');
    var patch = clean(collection, changes, true);
    var bucket = state[collection];
    var created = bucket.novos.filter(function (item) { return item.id === id; })[0];
    if (created) {
      Object.keys(patch).forEach(function (key) { created[key] = patch[key]; });
    } else {
      bucket.alterados[id] = bucket.alterados[id] || {};
      Object.keys(patch).forEach(function (key) { bucket.alterados[id][key] = patch[key]; });
    }
    persist(collection, 'update', id);
    return get(collection, id);
  }
  function remove(collection, id) {
    if (!COLLECTIONS[collection]) throw new Error('Coleção desconhecida.');
    if (!get(collection, id)) return false;
    var bucket = state[collection];
    bucket.novos = bucket.novos.filter(function (item) { return item.id !== id; });
    delete bucket.alterados[id];
    var base = itemBase(collection, id);
    if (base && bucket.removidos.indexOf(id) === -1) bucket.removidos.push(id);
    persist(collection, 'delete', id);
    return true;
  }
  function reset() {
    state = freshState();
    persist('*', 'reset', '*');
  }

  global.GMContentRepository = {
    list: list,
    get: get,
    create: create,
    update: update,
    delete: remove,
    reset: reset,
    schema: copy(FIELDS),
    storageKey: STORAGE_KEY
  };
})(window);


/* ===== core/store.js ===== */
/* ==========================================================================
   CARREIRAS POLICIAIS · CORE · STORE
   --------------------------------------------------------------------------
   Persistência local com migração segura.

   As chaves originais ('gma30dias_data', 'gma_aj_u_settings') e o formato
   são preservados, para que nenhum dado de quem já usava o site seja
   perdido:

     {
       diasConcluidos:    boolean[30],
       materiasConcluidas:boolean[60],
       checklists:        { "diaIdx-matIdx": boolean[6], ... },
       videosAssistidos:  { "diaIdx-matIdx-vIdx": true, ... },
       revisoes:          { ... },   // existia no schema original, nunca usado
       simulado:          { realizado, acertos, erros, questoes }
     }

   Campos novos são adicionados de forma aditiva (sem renomear nem remover
   os existentes). Chaves legadas 'mv-review-*' (usadas pelo material antigo)
   são importadas para o novo sistema de revisões na primeira execução.
   ========================================================================== */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'gma30dias_data';
  var SETTINGS_KEY = 'gma_aj_u_settings';
  var LEGACY_REVIEW_PREFIX = 'mv-review-';
  var SCHEMA_VERSION = 2;

  /* ---------------------------------------------------------------------
     Leitura segura — nunca lança (private mode, quota, file://)
     --------------------------------------------------------------------- */
  function rawGet(key) {
    try { return global.localStorage.getItem(key); }
    catch (e) { return null; }
  }

  function rawSet(key, value) {
    try { global.localStorage.setItem(key, value); return true; }
    catch (e) { return false; }
  }

  function rawRemove(key) {
    try { global.localStorage.removeItem(key); return true; }
    catch (e) { return false; }
  }

  /* ---------------------------------------------------------------------
     Schema padrão
     --------------------------------------------------------------------- */
  function defaultState() {
    return {
      // ---- campos originais (preservados) ----
      diasConcluidos:     new Array(30).fill(false),
      materiasConcluidas: new Array(60).fill(false),
      checklists:         {},
      videosAssistidos:   {},
      revisoes:           {},
      simulado:           { realizado: false, acertos: 0, erros: 0, questoes: 20 },

      // ---- campos novos (aditivos) ----
      schema:        SCHEMA_VERSION,
      assuntos:      {},   // "materiaId:assuntoId" -> { feito, vistoEm, concluidoEm }
      questoes:      {},   // "materiaId:assuntoId#qId" -> { resposta, correta,respondidaEm }
      cronDiario:    {},   // "diaIdx" -> true (dia marcado como revisado)
      simulados:     [],   // histórico de simulados
      notas:         {}    // "materiaId:assuntoId" -> texto livre
    };
  }

  /* ---------------------------------------------------------------------
     Normalização — garante tipos corretos sem descartar dados
     --------------------------------------------------------------------- */
  function toBoolArray(value, length) {
    var out = new Array(length).fill(false);
    if (Array.isArray(value)) {
      for (var i = 0; i < length && i < value.length; i++) out[i] = !!value[i];
    }
    return out;
  }

  function toBoolMap(value) {
    var out = {};
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.keys(value).forEach(function (k) { out[k] = !!value[k]; });
    }
    return out;
  }

  function toObject(value) {
    return (value && typeof value === 'object' && !Array.isArray(value)) ? value : {};
  }

  function normalize(parsed, defaults) {
    var out = defaults;
    if (!parsed || typeof parsed !== 'object') return out;

    out.diasConcluidos     = toBoolArray(parsed.diasConcluidos, 30);
    out.materiasConcluidas = toBoolArray(parsed.materiasConcluidas, 60);
    out.checklists         = toObject(parsed.checklists);
    out.videosAssistidos   = toBoolMap(parsed.videosAssistidos);
    out.revisoes           = toObject(parsed.revisoes);

    // simulado: preserva o original, completa campos faltantes
    var sim = toObject(parsed.simulado);
    out.simulado = {
      realizado: !!sim.realizado,
      acertos:   Number(sim.acertos)   || 0,
      erros:     Number(sim.erros)     || 0,
      questoes:  Number(sim.questoes)  || 20
    };

    out.schema     = SCHEMA_VERSION;
    out.assuntos   = toObject(parsed.assuntos);
    out.questoes   = toObject(parsed.questoes);
    out.cronDiario = toObject(parsed.cronDiario);
    out.simulados  = Array.isArray(parsed.simulados) ? parsed.simulados : [];
    out.notas      = toObject(parsed.notas);
    return out;
  }

  /* ---------------------------------------------------------------------
     Store
     --------------------------------------------------------------------- */
  var state = null;
  var listeners = [];
  var saveTimer = null;

  function load() {
    var parsed = null;
    var raw = rawGet(STORAGE_KEY);
    if (raw) {
      try { parsed = JSON.parse(raw); } catch (e) { parsed = null; }
    }
    state = normalize(parsed, defaultState());
    return state;
  }

  function get() {
    if (!state) load();
    return state;
  }

  function save() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(flush, 120);
  }

  function flush() {
    saveTimer = null;
    if (!state) return;
    rawSet(STORAGE_KEY, JSON.stringify(state));
    listeners.forEach(function (fn) {
      try { fn(state); } catch (e) { /* ignora erro de listener */ }
    });
  }

  /* Marca alteração e notifica (debounce na gravação) */
  function commit(mutator) {
    var s = get();
    if (typeof mutator === 'function') mutator(s);
    save();
    return s;
  }

  function subscribe(fn) {
    if (typeof fn === 'function') listeners.push(fn);
    return function () {
      var i = listeners.indexOf(fn);
      if (i > -1) listeners.splice(i, 1);
    };
  }

  /* ---------------------------------------------------------------------
     Reinícios — era 3.x, preservados
     --------------------------------------------------------------------- */
  function resetProgresso() {
    return commit(function (s) {
      s.diasConcluidos     = new Array(30).fill(false);
      s.materiasConcluidas = new Array(60).fill(false);
      s.checklists         = {};
      s.videosAssistidos   = {};
      s.assuntos           = {};
      s.questoes           = {};
      s.cronDiario         = {};
    });
  }

  function resetTudo() {
    return commit(function (s) {
      var fresh = defaultState();
      Object.keys(fresh).forEach(function (k) { s[k] = fresh[k]; });
    });
  }

  /* ---------------------------------------------------------------------
     Migração das revisões legadas 'mv-review-*' (regra 27)
     Roda uma única vez; não apaga as chaves antigas.
     --------------------------------------------------------------------- */
  var migrouLegado = false;

  function migrarRevisoesLegadas() {
    if (migrouLegado) return 0;
    migrouLegado = true;

    var chaves = [];
    try {
      for (var i = 0; i < global.localStorage.length; i++) {
        var k = global.localStorage.key(i);
        if (k && k.indexOf(LEGACY_REVIEW_PREFIX) === 0) chaves.push(k);
      }
    } catch (e) { return 0; }

    if (!chaves.length) return 0;

    // Agrupa pelo prefixo da lista (o índice é o sufixo numérico)
    var grupos = {};
    chaves.forEach(function (k) {
      var m = k.match(/^(.*)-(\d+)$/);
      if (!m) return;
      var base = m[1], idx = parseInt(m[2], 10);
      (grupos[base] = grupos[base] || {})[idx] = rawGet(k) === '1';
    });

    var bases = Object.keys(grupos);
    if (!bases.length) return 0;

    commit(function (s) {
      s.revisoes.legado = s.revisoes.legado || {};
      bases.forEach(function (base) {
        var slug = base.slice(LEGACY_REVIEW_PREFIX.length);
        var itens = grupos[base];
        var total = Object.keys(itens).length;
        var feitos = 0;
        Object.keys(itens).forEach(function (i) { if (itens[i]) feitos++; });
        s.revisoes.legado[slug] = {
          origem: 'material-antigo',
          titulo: slug.replace(/-/g, ' '),
          itens: itens,
          total: total,
          concluidos: feitos,
          importadoEm: new Date().toISOString()
        };
      });
    });

    return bases.length;
  }

  /* ---------------------------------------------------------------------
     Exportar / Importar — preparação para API futura (regra 43)
     --------------------------------------------------------------------- */
  function exportar() {
    return {
      app: 'carreiras-policiais',
      versao: SCHEMA_VERSION,
      exportadoEm: new Date().toISOString(),
      dados: get()
    };
  }

  function importar(payload) {
    if (!payload || typeof payload !== 'object') return false;
    var dados = payload.dados || payload;
    var parsed;
    try { parsed = JSON.parse(JSON.stringify(dados)); }
    catch (e) { return false; }
    var novo = normalize(parsed, defaultState());
    return commit(function (s) {
      Object.keys(novo).forEach(function (k) { s[k] = novo[k]; });
    }) && true;
  }

  /* ---------------------------------------------------------------------
     Preferências (separadas do progresso, para que "limpar progresso"
     não apague o tema escolhido)

     REGRA 20 — o tema é uma preferência, não um estado de estudo.
     --------------------------------------------------------------------- */
  function defaultSettings() {
    return {
      tema: 'auto',            // 'auto' | 'dark' | 'light'
      densidade: 'normal',     // 'compacta' | 'normal' | 'ampla'
      fonte: 'padrao',         // 'padrao' | 'reduzida' | 'ampliada'
      movimento: true,         // respeita prefers-reduced-motion quando false
      mostrarGabarito: true,   // exibe a letra correta antes de responder
      siglaVideo: true,        // letra sobre a miniatura do vídeo (dia 1º/2º)
      ultimos: []              // buscas recentes (máx. 8)
    };
  }

  var settings = null;

  function carregarSettings() {
    var parsed = null;
    var raw = rawGet(SETTINGS_KEY);
    if (raw) { try { parsed = JSON.parse(raw); } catch (e) { parsed = null; } }
    var base = defaultSettings();
    if (parsed && typeof parsed === 'object') {
      Object.keys(base).forEach(function (k) {
        if (parsed[k] !== undefined && typeof parsed[k] === typeof base[k]) base[k] = parsed[k];
      });
      base.ultimos = Array.isArray(parsed.ultimos) ? parsed.ultimos.slice(0, 8) : [];
    }
    settings = base;
    return settings;
  }

  function getSettings() { return settings || carregarSettings(); }

  function setSetting(chave, valor) {
    var s = getSettings();
    s[chave] = valor;
    rawSet(SETTINGS_KEY, JSON.stringify(s));
    return s;
  }

  function resetSettings() {
    rawRemove(SETTINGS_KEY);
    return carregarSettings();
  }

  /* ---------------------------------------------------------------------
     Exporta
     --------------------------------------------------------------------- */
  global.GMStore = {
    STORAGE_KEY:      STORAGE_KEY,
    SETTINGS_KEY:     SETTINGS_KEY,
    SCHEMA_VERSION:   SCHEMA_VERSION,
    getSettings:      getSettings,
    setSetting:       setSetting,
    resetSettings:    resetSettings,
    defaultSettings:  defaultSettings,
    load:            load,
    get:             get,
    save:            save,
    flush:           flush,
    commit:          commit,
    subscribe:       subscribe,
    resetProgresso:  resetProgresso,
    resetTudo:       resetTudo,
    migrarRevisoesLegadas: migrarRevisoesLegadas,
    exportar:        exportar,
    importar:        importar
  };

})(window);


/* ===== core/ui.js ===== */
/* ==========================================================================
   CARREIRAS POLICIAIS · CORE · UI
   Helpers de DOM, escape, ícones, formatação e utilidades de interface.
   ========================================================================== */
(function (global) {
  'use strict';

  /* ---------------------------------------------------------------------
     Escape — obrigatório em qualquer interpolação vinda de dados
     --------------------------------------------------------------------- */
  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  function esc(v) {
    if (v === null || v === undefined) return '';
    return String(v).replace(/[&<>"']/g, function (c) { return ESC[c]; });
  }

  /** Escapa texto e preserva quebras de linha como <br>. */
  function escNl(v) { return esc(v).replace(/\n/g, '<br>'); }

  /** Passa por um HTML já confiável (ex.: campo `comentario` do banco). */
  function raw(v) { return v === null || v === undefined ? '' : String(v); }

  /* ---------------------------------------------------------------------
     DOM
     --------------------------------------------------------------------- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else if (k.slice(0, 2) === 'on') node.addEventListener(k.slice(2), attrs[k]);
        else if (attrs[k] !== null && attrs[k] !== undefined && attrs[k] !== false) {
          node.setAttribute(k, attrs[k]);
        }
      });
    }
    (Array.isArray(children) ? children : children ? [children] : []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /** Delegate: um único listener para muitos elementos.
   *  Aceita `on(root, evt, sel, handler)` e também a forma abreviada
   *  `on(root, evt, handler)` — quando o 3º argumento é função, ela é o
   *  handler e o seletor é omitido (útil com debounce). */
  function on(root, evt, sel, handler) {
    if (typeof sel === 'function') { handler = sel; sel = null; }
    root.addEventListener(evt, function (e) {
      var t = e.target;
      if (sel) { t = t.closest(sel); if (!t || !root.contains(t)) return; }
      handler.call(t, e, t);
    });
  }

  /* ---------------------------------------------------------------------
     Formatação
     --------------------------------------------------------------------- */
  function pct(v, total) {
    if (!total) return 0;
    return Math.max(0, Math.min(100, Math.round((v / total) * 100)));
  }

  function plural(n, um, muitos) {
    return n === 1 ? um : (muitos || um + 's');
  }

  function dataCurta(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function tempoRelativo(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d)) return '';
    var s = Math.floor((Date.now() - d.getTime()) / 1000);
    if (s < 60) return 'agora';
    if (s < 3600) return Math.floor(s / 60) + ' min';
    if (s < 86400) return Math.floor(s / 3600) + ' h';
    if (s < 2592000) return Math.floor(s / 86400) + ' d';
    return dataCurta(iso);
  }

  /** Normaliza para busca: minúsculo, sem acento. */
  function norm(s) {
    if (s === null || s === undefined) return '';
    return String(s).toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function slug(s) {
    return norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  /** Debounce para campos de busca. */
  function debounce(fn, ms) {
    var t;
    return function () {
      var ctx = this, args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, ms || 180);
    };
  }

  /* ---------------------------------------------------------------------
     Ícones — Font Awesome já é dependência do projeto original
     --------------------------------------------------------------------- */
  function icon(cls, extra) {
    return '<i class="' + cls + (extra ? ' ' + extra : '') + '" aria-hidden="true"></i>';
  }

  /* ---------------------------------------------------------------------
     Barra de progresso
     --------------------------------------------------------------------- */
  function bar(valor, total, opts) {
    opts = opts || {};
    var p = pct(valor, total);
    return '<div class="progress' + (opts.mat ? ' progress--mat' : '') +
           (opts.size ? ' progress--' + opts.size : '') + '">' +
           (opts.semRotulo ? '' :
             '<div class="progress__head"><span class="progress__label">' + esc(opts.label || 'Progresso') +
             '</span><span class="progress__value">' + esc(opts.texto || (valor + '/' + total)) + '</span></div>') +
           '<div class="progress__track" role="progressbar" aria-valuenow="' + p +
           '" aria-valuemin="0" aria-valuemax="100" aria-label="' + esc(opts.rotulo || 'Progresso') + '">' +
           '<div class="progress__fill" style="width:' + p + '%"></div></div></div>';
  }

  function anel(valor, total, tamanho, cor) {
    var p = pct(valor, total);
    var r = (tamanho - 8) / 2;
    var c = 2 * Math.PI * r;
    return '<div class="ring" style="width:' + tamanho + 'px;height:' + tamanho + 'px;' +
           (cor ? '--ring-color:' + cor : '') + '">' +
           '<svg class="ring__svg" width="' + tamanho + '" height="' + tamanho + '" aria-hidden="true">' +
           '<circle class="ring__track" cx="' + tamanho / 2 + '" cy="' + tamanho / 2 + '" r="' + r + '" stroke-width="5"/>' +
           '<circle class="ring__bar" cx="' + tamanho / 2 + '" cy="' + tamanho / 2 + '" r="' + r + '" stroke-width="5" ' +
           'stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - p / 100)).toFixed(1) + '"/>' +
           '</svg><span class="ring__label" style="font-size:' + Math.round(tamanho / 3.6) + 'px">' + p + '%</span></div>';
  }

  /* ---------------------------------------------------------------------
     Badge de status — padrão único em toda a plataforma (regra 41)
     --------------------------------------------------------------------- */
  var STATUS = {
    concluido: { cls: 'concluido', txt: 'Concluído' },
    andamento: { cls: 'andamento', txt: 'Em andamento' },
    pendente:  { cls: 'pendente',  txt: 'Não iniciado' },
    hoje:      { cls: 'hoje',      txt: 'Hoje' },
    ausente:   { cls: 'ausente',   txt: 'Ausente' },
    parcial:   { cls: 'parcial',   txt: 'Parcial' },
    revisar:   { cls: 'revisar',   txt: 'Para revisar' }
  };

  function statusBadge(chave, texto) {
    var s = STATUS[chave] || STATUS.pendente;
    return '<span class="status status--' + s.cls + '">' + esc(texto || s.txt) + '</span>';
  }

  /* ---------------------------------------------------------------------
     Estado vazio
     --------------------------------------------------------------------- */
  function empty(icone, titulo, texto, acao) {
    return '<div class="empty">' +
           '<div class="empty__icon" aria-hidden="true">' + icone + '</div>' +
           '<div class="empty__title">' + esc(titulo) + '</div>' +
           (texto ? '<p class="empty__text">' + esc(texto) + '</p>' : '') +
           (acao || '') + '</div>';
  }

  /* ---------------------------------------------------------------------
     Modal (regra 28) — um único componente reutilizado
     --------------------------------------------------------------------- */
  var modalAberto = null;
  var ultimoFoco = null;

  function abrirModal(opts) {
    /* Aceita abrirModal({...}) e abrirModal('Título', '<html>', {largura: n}) */
    if (typeof opts === 'string') {
      var o2 = arguments[2] || {};
      o2.titulo = opts;
      o2.corpo = arguments[1] || '';
      opts = o2;
    }
    opts = opts || {};
    fecharModal();
    ultimoFoco = document.activeElement;

    var box = el('div', {
      class: 'modal__box' + (opts.largo ? ' modal__box--wide' : ''),
      role: 'dialog', 'aria-modal': 'true', 'aria-label': opts.titulo || 'Janela'
    });
    box.innerHTML =
      '<div class="modal__head"><div><h2 class="modal__title">' + esc(opts.titulo || '') + '</h2>' +
      (opts.sub ? '<p class="modal__sub">' + esc(opts.sub) + '</p>' : '') + '</div>' +
      '<button class="icon-btn" data-modal-close aria-label="Fechar">' + icon('fas fa-xmark') + '</button></div>' +
      '<div class="modal__body">' + (opts.corpo || '') + '</div>' +
      (opts.rodape ? '<div class="modal__foot">' + opts.rodape + '</div>' : '');

    var ov = el('div', { class: 'modal', id: 'gmModal' });
    ov.appendChild(box);
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';

    // fecha em clique fora, no X e no Esc
    ov.addEventListener('click', function (e) {
      if (e.target === ov || e.target.closest('[data-modal-close]')) fecharModal();
    });
    document.addEventListener('keydown', escFecha);

    requestAnimationFrame(function () { ov.classList.add('is-open'); });

    // foco no primeiro elemento utilizável
    setTimeout(function () {
      var f = box.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (f) f.focus();
    }, 60);

    if (opts.aoAbrir) opts.aoAbrir(box);
    modalAberto = ov;
    return ov;
  }

  function escFecha(e) { if (e.key === 'Escape') fecharModal(); }

  function fecharModal() {
    if (!modalAberto) return;
    var ov = modalAberto;
    modalAberto = null;
    document.removeEventListener('keydown', escFecha);
    ov.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 260);
    if (ultimoFoco && ultimoFoco.focus) {
      try { ultimoFoco.focus(); } catch (e) { /* ignora */ }
    }
  }

  function confirmar(opts) {
    /* Aceita as duas formas, para não obrigar toda tela a montar objeto:
         confirmar({ titulo, texto, ... }, callback)
         confirmar('Título', 'Texto', callback)                        */
    var cb = null, o;
    if (typeof opts === 'string') {
      o = { titulo: opts, texto: arguments[1] };
      cb = typeof arguments[2] === 'function' ? arguments[2] : null;
    } else {
      o = opts || {};
      cb = typeof arguments[1] === 'function' ? arguments[1] : null;
    }

    return new Promise(function (resolve) {
      var ov = abrirModal({
        titulo: o.titulo || 'Confirmar',
        corpo: '<p style="font-size:var(--fs-sm);line-height:1.6">' + esc(o.texto || '') + '</p>',
        rodape:
          '<button class="btn btn--ghost" data-modal-close>' + esc(o.cancelar || 'Cancelar') + '</button>' +
          '<button class="btn ' + (o.perigo ? 'btn--danger' : '') + '" data-confirmar>' +
          esc(o.confirmar || 'Confirmar') + '</button>'
      });
      function responder(v) {
        resolve(v);
        if (cb) cb(v);
      }
      ov.addEventListener('click', function (e) {
        if (e.target.closest('[data-confirmar]')) { fecharModal(); responder(true); }
        else if (e.target === ov || e.target.closest('[data-modal-close]')) { responder(false); }
      });
    });
  }

  /* ---------------------------------------------------------------------
     Toast
     --------------------------------------------------------------------- */
  function toast(msg, tipo) {
    var box = qs('.toasts');
    if (!box) {
      box = el('div', { class: 'toasts', role: 'status', 'aria-live': 'polite' });
      document.body.appendChild(box);
    }
    var ic = tipo === 'danger' ? 'fas fa-circle-exclamation'
           : tipo === 'success' ? 'fas fa-circle-check'
           : 'fas fa-circle-info';
    var t = el('div', { class: 'toast toast--' + (tipo || 'info') });
    t.innerHTML = icon(ic) + '<span>' + esc(msg) + '</span>';
    box.appendChild(t);
    setTimeout(function () {
      t.classList.add('is-out');
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 300);
    }, 3200);
  }

  /* ---------------------------------------------------------------------
     Accordion
     --------------------------------------------------------------------- */
  function acordeao(titulo, conteudo, aberto) {
    return '<div class="acc' + (aberto ? ' is-open' : '') + '">' +
      '<button class="acc__btn" aria-expanded="' + (aberto ? 'true' : 'false') + '">' +
      '<span>' + esc(titulo) + '</span>' +
      '<i class="fas fa-chevron-down acc__caret" aria-hidden="true"></i></button>' +
      '<div class="acc__panel">' + conteudo + '</div></div>';
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('.acc__btn');
    if (!b) return;
    var a = b.parentNode;
    var aberto = a.classList.toggle('is-open');
    b.setAttribute('aria-expanded', aberto ? 'true' : 'false');
  });

  /* ---------------------------------------------------------------------
     Preferências → atributos no <html>

     REGRA 19 (tema) e REGRA 22 (acessibilidade):
       · "auto" segue a preferência do sistema operacional;
       · a densidade e o tamanho do texto mexem em variáveis do Design
         System, não em estilos avulsos — assim a preferência vale para
         todas as telas sem exceção;
       · "movimento: off" também desliga a animação, independentemente do
         que o sistema pedir.
     --------------------------------------------------------------------- */
  function mqEscuro() {
    return global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function aplicarPreferencias() {
    var root = document.documentElement;
    var s = (global.GMStore && global.GMStore.getSettings) ? global.GMStore.getSettings() : {};

    // ---- tema (regra 19) ----
    var t = s.tema || 'auto';
    var efetivo = t === 'auto' ? (mqEscuro() ? 'dark' : 'light') : t;
    root.setAttribute('data-theme', efetivo);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', efetivo === 'light' ? '#f5f7fa' : '#0d1117');

    // ---- densidade (espaçamento) ----
    root.setAttribute('data-densidade', s.densidade || 'normal');

    // ---- tamanho do texto ----
    root.setAttribute('data-fonte', s.fonte || 'padrao');

    // ---- movimento (regra 22) ----
    var semMov = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.setAttribute('data-movimento', (s.movimento === false || semMov) ? 'reduzido' : 'completo');
  }

  // se o sistema operacional mudar o tema, "automático" acompanha sozinho
  if (global.matchMedia) {
    var mq = global.matchMedia('(prefers-color-scheme: dark)');
    var lig = function () {
      var s = (global.GMStore && global.GMStore.getSettings) ? global.GMStore.getSettings() : {};
      if (!s.tema || s.tema === 'auto') aplicarPreferencias();
    };
    if (mq.addEventListener) mq.addEventListener('change', lig);
    else if (mq.addListener) mq.addListener(lig);
  }

  /* ---------------------------------------------------------------------
     Exporta
     --------------------------------------------------------------------- */
  global.GMUI = {
    esc: esc, escNl: escNl, raw: raw,
    el: el, qs: qs, qsa: qsa, on: on,
    pct: pct, plural: plural, dataCurta: dataCurta, tempoRelativo: tempoRelativo,
    norm: norm, slug: slug, debounce: debounce,
    icon: icon, bar: bar, anel: anel,
    statusBadge: statusBadge, STATUS: STATUS,
    empty: empty,
    abrirModal: abrirModal, fecharModal: fecharModal, confirmar: confirmar,
    toast: toast, acordeao: acordeao,
    aplicarPreferencias: aplicarPreferencias
  };

})(window);


/* ===== core/router.js ===== */
/* ==========================================================================
   CARREIRAS POLICIAIS · CORE · ROUTER
   --------------------------------------------------------------------------
   Roteamento por hash. Um único par de funções para toda a plataforma:

     #/materias
     #/materia/<materiaId>
     #/assunto/<materiaId>/<assuntoId>
     #/anotacoes
     #/configuracoes
     #/busca?q=termo

   O botão voltar devolve ao contexto real. Por isso cada navegação guarda
   a origem e a interface usa window.history.back() quando existe histórico;
   o link "voltar" da página de assunto aponta sempre para a matéria.

   O histórico é persistido (sessionStorage) para que o botão voltar do
   navegador funcione igual ao botão "Voltar" da interface.
   ========================================================================== */
(function (global) {
  'use strict';

  var HIST_KEY = 'gma_aj_u_historico';
  var MAX_HIST = 40;

  var rotas = [];
  var atual = null;
  var onChange = null;

  /* ---------------------------------------------------------------------
     Histórico de navegação (sessionStorage)
     --------------------------------------------------------------------- */
  function lerHist() {
    try { return JSON.parse(sessionStorage.getItem(HIST_KEY)) || []; }
    catch (e) { return []; }
  }

  function gravarHist(h) {
    try { sessionStorage.setItem(HIST_KEY, JSON.stringify(h.slice(-MAX_HIST))); }
    catch (e) { /* ignora */ }
  }

  function empilhar(hash) {
    var h = lerHist().filter(function (x) { return x !== hash; });
    h.push(hash);
    gravarHist(h);
  }

  function histAnterior() {
    var h = lerHist();
    if (h.length < 2) return null;
    return h[h.length - 2];
  }

  function limparHist(hash) { gravarHist([hash]); }

  /* ---------------------------------------------------------------------
     Parse
     --------------------------------------------------------------------- */
  function parse() {
    var bruto = (location.hash || '').replace(/^#/, '');
    // `segs` precisa existir mesmo vazio: casa() compara comprimento com ele.
    // `#/` (hash vazio com barra) também cai aqui, senão vira "rota não encontrada".
    if (!bruto || /^\/+$/.test(bruto)) return { path: '/materias', segs: ['materias'], params: {}, query: {} };

    var qs = {};
    var qi = bruto.indexOf('?');
    if (qi > -1) {
      bruto.slice(qi + 1).split('&').forEach(function (par) {
        if (!par) return;
        var e = par.split('=');
        qs[decodeURIComponent(e[0])] = decodeURIComponent((e[1] || '').replace(/\+/g, ' '));
      });
      bruto = bruto.slice(0, qi);
    }

    var segs = bruto.split('/').filter(Boolean).map(decodeURIComponent);
    return { path: '/' + segs.join('/'), segs: segs, params: {}, query: qs };
  }

  /* ---------------------------------------------------------------------
     Registro
     ---------------------------------------------------------------------
     padrao: '/materia/:id'
     Chamadas: GMRouter.on('/materia/:id', fn)
     --------------------------------------------------------------------- */
  function on(padrao, fn) {
    var partes = padrao.split('/').filter(Boolean);
    rotas.push({ partes: partes, fn: fn, padrao: padrao });
  }

  function casa(rota, segs) {
    if (rota.partes.length !== segs.length) return null;
    var p = {};
    for (var i = 0; i < segs.length; i++) {
      var d = rota.partes[i];
      if (d.charAt(0) === ':') p[d.slice(1)] = segs[i];
      else if (d !== segs[i]) return null;
    }
    return p;
  }

  /* ---------------------------------------------------------------------
     Navegação
     --------------------------------------------------------------------- */
  function go(hash, opts) {
    opts = opts || {};
    var h = hash.charAt(0) === '#' ? hash : '#' + hash;
    if (opts.replace) {
      limparHist(location.hash || h);
      location.replace(location.pathname + location.search + h);
      return;
    }
    if (location.hash === h) { resolver(true); return; }
    location.hash = h;
  }

  function voltar() {
    var h = histAnterior();
    if (h && h !== location.hash) {
      history.back();
    } else {
      // sem histórico útil: cai na rota inicial
      go('/materias', { replace: true });
    }
  }

  /* ---------------------------------------------------------------------
     Resolução
     --------------------------------------------------------------------- */
  function resolver(forcar) {
    var r = parse();

    if (!forcar) {
      var anterior = location.hash;
      empilhar(anterior);
    }

    for (var i = 0; i < rotas.length; i++) {
      var p = casa(rotas[i], r.segs);
      if (p) {
        atual = { rota: rotas[i].padrao, params: p, query: r.query, path: r.path };
        if (onChange) {
          try { onChange(atual, rotas[i].fn); }
          catch (e) { console.error('[router] erro ao renderizar', atual.rota, e); }
        }
        return;
      }
    }

    // rota desconhecida → matérias, com aviso
    console.warn('[router] rota não encontrada:', r.path);
    if (r.path !== '/materias') { go('/materias', { replace: true }); }
  }

  function start(cb) {
    onChange = cb;
    global.addEventListener('hashchange', function () { resolver(false); });
    if (!location.hash) {
      // Normaliza o hash antes de resolver. `replaceState` não dispara
      // `hashchange`, então a primeira tela é desenhada uma vez só — e a
      // rota casa de verdade, em vez de cair no aviso de rota desconhecida.
      limparHist('#/materias');
      history.replaceState(null, '',
        location.pathname + location.search + '#/materias');
    } else {
      limparHist(location.hash);
    }
    resolver(true);
  }

  /* ---------------------------------------------------------------------
     Exporta
     --------------------------------------------------------------------- */
  global.GMRouter = {
    on: on,
    go: go,
    voltar: voltar,
    start: start,
    resolver: resolver,
    parse: parse,
    atual: function () { return atual; },
    historico: lerHist,
    anterior: histAnterior
  };

})(window);


/* ===== core/progresso.js ===== */
/* ==========================================================================
   CARREIRAS POLICIAIS · CORE · PROGRESSO
   --------------------------------------------------------------------------
   Camada que traduz o localStorage bruto (regra 27) em números que a
   interface usa. Concentrar isso aqui evita que cada tela recalcule e,
   principalmente, evita que uma tela leia a estrutura antiga de um jeito e
   outra de outro.

   O esquema original é preservado byte a byte onde importa:

     diasConcluidos[30]              -> dia do cronograma concluído
     materiasConcluidas[60]           -> entrada do cronograma concluída
                                        (índice global = diaIdx*2 + matIdx)
     checklists["diaIdx-matIdx"]     -> [bool, ...] 6 itens
     videosAssistidos["d-m-v"]       -> true
     revisoes{}                       -> (existia, nunca usado; agora é o
                                         novo sistema de revisão)
     simulado{realizado,acertos,erros,questoes}

   Tudo o que é novo (assuntos, questões, simulado acumulativo) é aditivo.
   ========================================================================== */
(function (global) {
  'use strict';

  var S = global.GMStore, D = global.GMData, U = global.GMUI;
  var cache = null;

  function estado() {
    if (!cache) cache = S.get();
    return cache;
  }
  S.subscribe(function () { cache = null; });

  /* ---------------------------------------------------------------------
     Cronograma
     --------------------------------------------------------------------- */
  function diaConcluido(i) { return !!estado().diasConcluidos[i]; }
  function concluirDia(i, v) {
    S.commit(function (s) { s.diasConcluidos[i] = !!v; });
  }

  function materiaConcluida(diaIdx, matIdx) {
    return !!estado().materiasConcluidas[diaIdx * 2 + matIdx];
  }
  function concluirMateria(diaIdx, matIdx, v) {
    S.commit(function (s) { s.materiasConcluidas[diaIdx * 2 + matIdx] = !!v; });
  }

  function statusDia(i) {
    if (diaConcluido(i)) return 'concluido';
    if (i === diaAtual()) return 'hoje';
    return 'andamento';
  }
  function diaAtual() {
    // dia 1 do plano é o primeiro dia ainda não concluído após o último
    // concluído; se tudo estiver concluído, devolve o último.
    var s = estado().diasConcluidos;
    var ultimo = -1;
    for (var i = 0; i < s.length; i++) if (s[i]) ultimo = i;
    return Math.min(ultimo + 1, s.length - 1);
  }

  function progressoCronograma() {
    // Plano fixo removido: o histórico antigo segue na chave de dados, mas as
    // telas usam o progresso por matéria (materiaGlobal). Mantido só para
    // não quebrar leitura de dados legados.
    var s = estado();
    var dias = s.diasConcluidos.filter(Boolean).length;
    var mats = s.materiasConcluidas.filter(Boolean).length;
    return {
      dias: dias, totalDias: s.diasConcluidos.length,
      materias: mats, totalMaterias: s.materiasConcluidas.length,
      pct: U.pct(dias, s.diasConcluidos.length)
    };
  }

  /* ---------------------------------------------------------------------
     Checklists e vídeos (chaves originais preservadas)
     --------------------------------------------------------------------- */
  function checklist(diaIdx, matIdx) {
    return estado().checklists[diaIdx + '-' + matIdx] || [];
  }
  function marcarChecklist(diaIdx, matIdx, i, v) {
    S.commit(function (s) {
      var k = diaIdx + '-' + matIdx;
      var arr = s.checklists[k] ? s.checklists[k].slice() : new Array(6).fill(false);
      arr[i] = !!v;
      s.checklists[k] = arr;
    });
  }
  function checklistCompleto(diaIdx, matIdx, itens) {
    var arr = checklist(diaIdx, matIdx);
    if (!arr.length) arr = new Array(itens).fill(false);
    return arr.length > 0 && arr.every(Boolean);
  }

  function videoVisto(diaIdx, matIdx, vIdx) {
    return !!estado().videosAssistidos[diaIdx + '-' + matIdx + '-' + vIdx];
  }
  function marcarVideo(diaIdx, matIdx, vIdx, v) {
    S.commit(function (s) {
      s.videosAssistidos[diaIdx + '-' + matIdx + '-' + vIdx] = !!v;
    });
  }

  /* ---------------------------------------------------------------------
     Assuntos (novo) — liga um assunto a um dia do cronograma
     --------------------------------------------------------------------- */
  function chaveAssunto(materiaId, assuntoId) { return materiaId + ':' + assuntoId; }

  function assunto(materiaId, assuntoId) {
    var r = estado().assuntos[chaveAssunto(materiaId, assuntoId)];
    if (!r) return { visto: false, feito: false };
    return {
      visto: !!r.visto, feito: !!r.feito,
      vistoEm: r.vistoEm || null, concluidoEm: r.concluidoEm || null
    };
  }
  function marcarAssunto(materiaId, assuntoId, prop, v) {
    S.commit(function (s) {
      var k = chaveAssunto(materiaId, assuntoId);
      var r = s.assuntos[k] || { visto: false, feito: false };
      r[prop] = !!v;
      r[prop === 'feito' ? 'concluidoEm' : 'vistoEm'] = v ? new Date().toISOString() : null;
      s.assuntos[k] = r;
    });
  }

  /** Progresso de uma matéria, contando só os assuntos dela. */
  function materia(materiaId) {
    var lista = D.assuntos(materiaId) || [];
    var feitos = 0;
    lista.forEach(function (a) {
      if (assunto(materiaId, a.id).feito) feitos++;
    });
    return { feitos: feitos, total: lista.length, pct: U.pct(feitos, lista.length) };
  }

  function materiaGlobal() {
    var t = 0, f = 0;
    (D.materias || []).forEach(function (m) {
      var p = materia(m.id);
      t += p.total; f += p.feitos;
    });
    return { feitos: f, total: t, pct: U.pct(f, t) };
  }

  /* ---------------------------------------------------------------------
     Questões
     --------------------------------------------------------------------- */
  function resposta(materiaId, qid) {
    return estado().questoes[materiaId + '#' + qid] || null;
  }
  function responder(materiaId, qid, respostaIdx, correta) {
    S.commit(function (s) {
      s.questoes[materiaId + '#' + qid] = {
        resposta: respostaIdx, correta: !!correta, respondidaEm: new Date().toISOString()
      };
    });
  }
  function limparResposta(materiaId, qid) {
    S.commit(function (s) { delete s.questoes[materiaId + '#' + qid]; });
  }
  function statsQuestoes() {
    // Sem banco de questões na plataforma, o indicador fica zerado.
    var s = estado().questoes || {}, acertos = 0, errados = 0;
    Object.keys(s).forEach(function (k) {
      if (s[k].correta) acertos++; else errados++;
    });
    var respondidas = acertos + errados;
    return {
      respondidas: respondidas, acertos: acertos, erros: errados,
      pct: U.pct(acertos, respondidas),
      disponiveis: 0
    };
  }

  /** Erros marcados para revisão — base do novo sistema de revisões. */
  function erros() {
    // Sem banco de questões, não há erros para revisar.
    var s = estado().questoes || {}, out = [];
    Object.keys(s).forEach(function (k) {
      if (s[k].correta) return;
      var p = k.split('#');
      var q = null;
      (D.bancosQuestoes || []).forEach(function (b) {
        if (b.materiaId !== p[0]) return;
        b.questoes.forEach(function (x) { if (x.id === p[1]) q = x; });
      });
      if (q) {
        var a = D.assunto(p[0], p[1]);
        out.push({ materiaId: p[0], questao: q, quando: s[k].respondidaEm,
                   assunto: a ? a.titulo : null });
      }
    });
    out.sort(function (a, b) { return (b.quando || '').localeCompare(a.quando || ''); });
    return out;
  }

  /* ---------------------------------------------------------------------
     Revisões (novo) — sem colisão com o objeto `revisoes` original
     --------------------------------------------------------------------- */
  function revisao(tipo, ref) {
    var s = estado().revisoes;
    s[tipo] = s[tipo] || {};
    return !!s[tipo][ref];
  }
  function alternarRevisao(tipo, ref) {
    var novo = !revisao(tipo, ref);
    S.commit(function (s) {
      s.revisoes[tipo] = s.revisoes[tipo] || {};
      s.revisoes[tipo][ref] = novo;
    });
    return novo;
  }
  function contarRevisoes(tipo) {
    var s = estado().revisoes[tipo] || {};
    return Object.keys(s).filter(function (k) { return s[k]; }).length;
  }

  /* ---------------------------------------------------------------------
     Simulado
     --------------------------------------------------------------------- */
  function simulado() { return estado().simulado; }
  function registrarSimulado(r) {
    S.commit(function (s) {
      s.simulado = {
        realizado: true,
        acertos: r.acertos, erros: r.erros, questoes: r.total
      };
      s.simulados.push({
        em: new Date().toISOString(),
        acertos: r.acertos, erros: r.erros, total: r.total,
        pct: U.pct(r.acertos, r.total)
      });
    });
  }
  function historicoSimulados() {
    return (estado().simulados || []).slice().reverse();
  }

  /* ---------------------------------------------------------------------
     Visão geral
     --------------------------------------------------------------------- */
  function geral() {
    var cron = progressoCronograma();
    var mat = materiaGlobal();
    var q = statsQuestoes();
    return {
      cronograma: cron, materias: mat, questoes: q,
      revisoes: contarRevisoes('questao'),
      simulado: simulado(),
      simuladoPct: simulado().realizado ? U.pct(simulado().acertos, simulado().questoes) : 0
    };
  }

  global.GMProgresso = {
    diaConcluido: diaConcluido, concluirDia: concluirDia, statusDia: statusDia,
    diaAtual: diaAtual, progressoCronograma: progressoCronograma,
    materiaConcluida: materiaConcluida, concluirMateria: concluirMateria,
    checklist: checklist, marcarChecklist: marcarChecklist,
    checklistCompleto: checklistCompleto,
    videoVisto: videoVisto, marcarVideo: marcarVideo,
    assunto: assunto, marcarAssunto: marcarAssunto,
    materia: materia, materiaGlobal: materiaGlobal,
    resposta: resposta, responder: responder, limparResposta: limparResposta,
    statsQuestoes: statsQuestoes, erros: erros,
    revisao: revisao, alternarRevisao: alternarRevisao, contarRevisoes: contarRevisoes,
    simulado: simulado, registrarSimulado: registrarSimulado,
    historicoSimulados: historicoSimulados,
    geral: geral
  };

})(window);
