/* CARREIRAS POLICIAIS — paginas.js
   Seções preservadas na ordem de dependência. Procure o título da seção para editar. */


/* ===== views/materias.js ===== */
/* ==========================================================================
   CARREIRAS POLICIAIS · VIEWS · MATÉRIAS
   --------------------------------------------------------------------------
   Duas telas na mesma pasta, como pede a regra 45 (uma por rota, sem HTML
   manual):
     #/materias             lista de todas as matérias, agrupada por área
     #/materia/<id>         Subjects of one discipline
   ========================================================================== */
(function (global) {
  'use strict';

  var U = global.GMUI, K = global.GMUIKit, P = global.GMProgresso,
      D = global.GMData, R = global.GMRouter;
  var esc = U.esc, icon = U.icon;

  var filtro = { texto: '', area: '', escopo: 'edital' };

  /* =====================================================================
     #/materias
     ===================================================================== */
  function renderLista(alvo) {
    var g = P.geral();

    alvo.innerHTML =
      K.pageHead({
        icone: 'fas fa-compass',
        titulo: 'Matérias',
        sub: 'Toda a teoria do núcleo comum das carreiras policiais, organizada ' +
             'por área. Use o seletor de foco no topo para ver só o que a sua ' +
             'corporação cobra.',
        badge: [
          { txt: D.materiasDoEdital().length + ' matérias do edital', cls: 'badge--gold' },
          { txt: D.assuntosTodos().length + ' assuntos', cls: 'badge--outline' }
        ],
        meta: U.bar(g.materias.feitos, g.materias.total, {
          label: 'Progresso geral', mat: true, texto: g.materias.feitos + '/' + g.materias.total
        }).replace('width:0%', 'width:' + g.materias.pct + '%')
      }) +
      '<div class="toolbar">' +
        '<div class="toolbar__search">' +
          '<i class="fas fa-magnifying-glass toolbar__search-icon" aria-hidden="true"></i>' +
          '<input type="search" class="input" placeholder="Buscar matéria…" value="' +
          esc(filtro.texto) + '" data-busca-mat aria-label="Buscar matéria">' +
        '</div>' +
        '<div class="toolbar__group">' +
          '<select class="select" data-f-area aria-label="Filtrar por área">' +
            '<option value="">Todas as áreas</option>' +
            D.areas.map(function (a) {
              return '<option value="' + esc(a.id) + '"' + (filtro.area === a.id ? ' selected' : '') +
                '>' + esc(a.nome) + '</option>';
            }).join('') +
          '</select>' +
          '<select class="select" data-f-escopo aria-label="Filtrar por reaproveitamento">' +
            '<option value="edital"' + (filtro.escopo === 'edital' ? ' selected' : '') + '>Somente edital</option>' +
            '<option value="comum"' + (filtro.escopo === 'comum' ? ' selected' : '') + '>Reaproveitáveis</option>' +
            '<option value="todos"' + (filtro.escopo === 'todos' ? ' selected' : '') + '>Todas</option>' +
          '</select>' +
        '</div>' +
        '<div class="toolbar__count" data-contagem></div>' +
      '</div>' +
      '<div data-grade-mat></div>';

    pintar(alvo);
    ligar(alvo);
  }

  function materiasVisiveis() {
    var t = U.norm(filtro.texto);
    var corp = (global.GMCorporacoes && global.GMCorporacoes.ativa() || {}).id || 'todas';
    return D.materias.filter(function (m) {
      if (!D.materiaCoberta(m, corp)) return false;
      if (filtro.escopo === 'edital' && m.utilitaria) return false;
      if (filtro.area && m.area !== filtro.area) return false;
      if (filtro.escopo === 'comum' && m.escopo !== 'comum') return false;
      if (t) {
        var alvo = U.norm(m.nome + ' ' + m.descricao + ' ' + (m.edital || ''));
        if (alvo.indexOf(t) === -1) return false;
      }
      return true;
    });
  }

  function pintar(alvo) {
    var lista = materiasVisiveis();
    var box = U.qs('[data-grade-mat]', alvo);
    var cnt = U.qs('[data-contagem]', alvo);
    if (cnt) cnt.textContent = lista.length + (lista.length === 1 ? ' matéria' : ' matérias');

    if (!lista.length) {
      box.innerHTML = K.vazio('fas fa-filter-circle-xmark', 'Nenhuma matéria encontrada',
        'Ajuste a busca ou os filtros.', '#/materias', 'Limpar filtros');
      return;
    }

    // agrupa por área do edital
    var grupos = [];
    D.areas.forEach(function (a) {
      var ms = lista.filter(function (m) { return m.area === a.id; });
      if (ms.length) grupos.push({ area: a, materias: ms });
    });

    box.innerHTML = grupos.map(function (g) {
      var tot = g.materias.reduce(function (t, m) { return t + D.assuntos(m.id).length; }, 0);
      return '<section>' +
        '<div class="sec-head' + (g.area.tipo === 'especifico' ? ' mat-accent' : '') + '"' +
        (g.area.tipo === 'especifico'
          ? ' style="--mat:var(--a-espec, var(--gold))"'
          : ' style="--mat:var(--a-comum, var(--accent-2))"') + '>' +
          '<span class="sec-head__icon">' +
            icon(g.area.tipo === 'comum' ? 'fas fa-layer-group' : 'fas fa-shield-halved') + '</span>' +
          '<div><h2 class="sec-head__title">' + esc(g.area.nome) + '</h2>' +
          '<p style="font-size:var(--fs-3xs);color:var(--text-faint);margin:0">' +
            esc(g.area.descricao) + '</p></div>' +
          '<span class="sec-head__sub">' + g.materias.length + ' matérias · ' + tot + ' assuntos</span>' +
        '</div>' +
        '<div class="materias-grid">' + g.materias.map(K.matCard).join('') + '</div>' +
        '</section>';
    }).join('');
  }

  function ligar(alvo) {
    U.on(alvo, 'input', '[data-busca-mat]', U.debounce(function (e, t) {
      filtro.texto = t.value; pintar(alvo);
    }, 180));
    U.on(alvo, 'change', 'select[data-f-area]', function (e, t) {
      filtro.area = t.value; pintar(alvo);
    });
    U.on(alvo, 'change', 'select[data-f-escopo]', function (e, t) {
      filtro.escopo = t.value; pintar(alvo);
    });
  }

  /* =====================================================================
     #/materia/<id>
     ===================================================================== */
  function renderMateria(alvo, params) {
    var m = D.materia(params.id);
    if (!m) {
      alvo.innerHTML = K.vazio('fas fa-circle-question', 'Matéria não encontrada',
        'O endereço #/materia/' + esc(params.id) + ' não corresponde a nenhuma matéria do edital.',
        '#/materias', 'Ver todas as matérias');
      return;
    }

    var assuntos = D.assuntos(m.id);
    var mt = D.assuntosMetricas(m.id);
    var p = P.materia(m.id);
    var hist = R.anterior();
    var voltar = hist && hist !== location.hash ? hist : '#/materias';

    alvo.innerHTML =
      K.pageHead({
        cor: m.cor, voltar: voltar,
        icone: m.icone,
        titulo: m.nome,
        sub: m.descricao,
        badge: [
          { txt: K.areaNome(m.area), cls: 'badge--outline' },
          { txt: m.escopo === 'comum' ? 'reaproveitável' : 'específico do concurso',
            cls: m.escopo === 'comum' ? 'badge--info' : 'badge--gold' },
          { txt: mt.total + ' assuntos', cls: 'badge--neutral' }
        ],
        meta: U.bar(p.feitos, p.total, {
          label: 'Seu progresso nesta matéria', mat: true, texto: p.feitos + '/' + p.total
        }).replace('width:0%', 'width:' + p.pct + '%')
      }) +

      (m.edital ? '<section class="card card--pad" style="margin-bottom:var(--sp-6)">' +
        '<div class="card__head" style="padding:0 0 var(--sp-3);border:0">' +
          '<h2 class="card__title">' + icon('fas fa-file-contract') + ' O que o edital pede</h2>' +
        '</div>' +
        '<p style="font-size:var(--fs-sm);color:var(--text-muted);line-height:1.7">' + esc(m.edital) + '</p>' +
      '</section>' : '') +

      cobertura(m, mt) +

      '<div class="sec-head' + matClass(m.id) + '"' + matStyle(m.id) + '>' +
        '<span class="sec-head__icon">' + icon(m.icone) + '</span>' +
        '<div><h2 class="sec-head__title">Assuntos</h2>' +
        '<p style="font-size:var(--fs-3xs);color:var(--text-faint);margin:0">' +
          mt.comTeoria + ' com teoria · ' + mt.comQuestoes + ' com questões · ' +
          mt.semTeoria + ' só no roteiro</p></div>' +
        '<div class="row row-2 row-end sec-head__sub"></div>' +
      '</div>' +
      '<div class="chips" style="margin-bottom:var(--sp-4)">' + chips(m.id) + '</div>' +
      '<div class="assuntos-grid" data-grade-assuntos data-materia-aberta="' +
        esc(m.id) + '">' + assuntos.map(K.assuntoCard).join('') + '</div>';

    ligarMateria(alvo, m);
  }

  function cobertura(m, mt) {
    if (!mt.total) return '';
    var pc = U.pct(mt.comTeoria, mt.total);
    var cls = pc === 100 ? 'total' : pc >= 50 ? 'parcial' : 'zero';
    var rot = pc === 100 ? 'cobertura total' : pc >= 50 ? 'cobertura parcial' : 'cobertura inicial';

    return '<div class="grid grid-3" style="margin-bottom:var(--sp-6)">' +
      '<div class="stat"><div class="stat__meta">' + icon('fas fa-book-open') + '</div>' +
        '<div class="stat__value" style="--stat-color:' + m.cor + '">' + mt.comTeoria + '</div>' +
        '<div class="stat__label">assuntos com teoria</div></div>' +
      '<div class="stat"><div class="stat__meta">' + icon('fas fa-list-check') + '</div>' +
        '<div class="stat__value" style="--stat-color:var(--info)">' + mt.questoes + '</div>' +
        '<div class="stat__label">questões de banca</div></div>' +
      '<div class="stat"><div class="stat__meta">' + icon('fas fa-coverage') + '</div>' +
        '<div class="stat__value" style="--stat-color:var(--' + cls + ', var(--text))">' + pc + '%</div>' +
        '<div class="stat__label"><span class="cob cob--' + cls + '">' + rot + '</span></div></div>' +
      '</div>';
  }

  var filtroAssunto = '';
  function chips(materiaId) {
    var lista = D.assuntos(materiaId);
    function n(cond) { return lista.filter(cond).length; }
    var out = ['<button class="chip' + (!filtroAssunto ? ' is-active' : '') + '" data-f-a="">' +
      icon('fas fa-grip') + ' Todos (' + lista.length + ')</button>'];
    out.push('<button class="chip' + (filtroAssunto === 'teoria' ? ' is-active' : '') + '" data-f-a="teoria">' +
      icon('fas fa-book-open') + ' Com teoria (' + n(function (a) { return a.origem.indexOf('teoria') > -1; }) + ')</button>');
    out.push('<button class="chip' + (filtroAssunto === 'questoes' ? ' is-active' : '') + '" data-f-a="questoes">' +
      icon('fas fa-list-check') + ' Com questões (' + n(function (a) { return a.questoes > 0; }) + ')</button>');
    if (n(function (a) { return a.semTeoria; })) {
      out.push('<button class="chip' + (filtroAssunto === 'sem' ? ' is-active' : '') + '" data-f-a="sem">' +
        icon('fas fa-triangle-exclamation') + ' Sem teoria (' +
        n(function (a) { return a.semTeoria; }) + ')</button>');
    }
    if (n(function (a) { return a.feito; })) {
      out.push('<button class="chip' + (filtroAssunto === 'feito' ? ' is-active' : '') + '" data-f-a="feito">' +
        icon('fas fa-circle-check') + ' Concluídos (' +
        n(function (a) { return a.feito; }) + ')</button>');
    }
    return out.join('');
  }

  function pintarAssuntos(alvo, materiaId) {
    var corp = global.GMCorporacoes ? global.GMCorporacoes.ativa() : null;
    var lista = D.assuntos(materiaId).filter(function (a) {
      /* Foco primeiro: a materia ja esta visivel, mas o assunto pode ser de
         outra corporacao. Aplicando o filtro, a grade fica vazia em vez de
         mostrar o edital de um concurso que o usuario nao esta mirando. */
      if (corp && D.assuntoCoberto && !D.assuntoCoberto(a, corp.id)) return false;
      if (!filtroAssunto) return true;
      if (filtroAssunto === 'teoria') return a.origem.indexOf('teoria') > -1;
      if (filtroAssunto === 'questoes') return a.questoes > 0;
      if (filtroAssunto === 'sem') return a.semTeoria;
      if (filtroAssunto === 'feito') return P.assunto(materiaId, a.id).feito;
      return true;
    });
    var box = U.qs('[data-grade-assuntos]', alvo);
    if (!box) return;
    box.innerHTML = lista.length
      ? lista.map(K.assuntoCard).join('')
      : K.vazio('fas fa-filter-circle-xmark', 'Nenhum assunto neste filtro',
          'Ajuste o filtro de assunto ou troque o Foco na barra superior para ver o conteúdo deste edital.');
  }

  function ligarMateria(alvo, m) {
    // marca os assuntos concluídos para o chip "Concluídos" funcionar
    D.assuntos(m.id).forEach(function (a) {
      a.feito = P.assunto(m.id, a.id).feito;
    });
    pintarAssuntos(alvo, m.id);

    U.on(alvo, 'click', '.chip[data-f-a]', function (e, t) {
      filtroAssunto = t.getAttribute('data-f-a');
      U.qs('.chips', alvo).innerHTML = chips(m.id);
      pintarAssuntos(alvo, m.id);
    });
  }

  function matClass(id) { return K.matClass(id); }
  function matStyle(id) { return K.matStyle(id); }

  global.GMViews = global.GMViews || {};
  global.GMViews.materias = {
    renderLista: renderLista,
    renderMateria: renderMateria,
    /* Repinta a grade da materia aberta. Chamado quando o Foco muda, para
       que os assuntos de outro concurso saiam da lista. Busca no documento
       inteiro: o alvo do repaint e a grade, e nao um container dela. */
    repintar: function () {
      var box = U.qs('[data-grade-assuntos][data-materia-aberta]');
      if (!box) return;
      pintarAssuntos(global.document, box.getAttribute('data-materia-aberta'));
    }
  };

})(window);


/* ===== views/assunto.js ===== */
/* ==========================================================================
   CARREIRAS POLICIAIS · VIEWS · ASSUNTO
   --------------------------------------------------------------------------
   Página de leitura de um assunto: theory, videos, questions, checklist and
   revision. É a tela que substitui as páginas HTML manuais do material
   antigo (regra 45).

   Regra 31 (sumário): a coluna lateral é gerada a partir dos próprios
   blocos de conteúdo, então acompanha qualquer matéria automaticamente.
   Regra 32 (voltar): o botão volta para a MATÉRIA, e não para a home.
   ========================================================================== */
(function (global) {
  'use strict';

  var U = global.GMUI, K = global.GMUIKit, P = global.GMProgresso,
      D = global.GMData, R = global.GMRouter, B = global.GMBlocos;
  var esc = U.esc, icon = U.icon;

  function render(alvo, params) {
    var m = D.materia(params.materia);
    if (!m) { naoEncontrado(alvo, params.materia, '#/materias'); return; }

    var a = D.assunto(params.materia, params.assunto);
    if (!a) { naoEncontrado(alvo, params.assunto, '#/materia/' + m.id); return; }

    var st = P.assunto(m.id, a.id);
    var temTeoria = D.assuntosTemTeoria(a);

    var btnFeito = '<button class="btn btn--sm ' +
      (st.feito ? 'btn--ghost' : 'btn--success') +
      '" data-marcar-feito>' +
      icon(st.feito ? 'fas fa-rotate-left' : 'fas fa-circle-check') + ' ' +
      (st.feito ? 'Reabrir assunto' : 'Marcar como estudado') +
      '</button>';

    /* O sumário precisa ser montado antes do conteúdo: é ele que dá id aos
       títulos, e sem isso os links do "Nesta página" não achavam o destino. */
    var corAssunto = K.assuntoCor(a);
    var sumarioHtml = temTeoria ? B.sumario(a.blocos, m.id, a.id)
      : '<nav class="sumario"><div class="sumario__title">Nesta página</div>' +
        '<div class="sumario__list">' +
        (a.videos && a.videos.length ? '<a class="sumario__link" href="#s-videos">Vídeos</a>' : '') +
        '<a class="sumario__link" href="#s-revisao">Revisão</a>' +
        '</div></nav>';

    alvo.innerHTML =
      K.pageHead({
        cor: K.assuntoCor(a),
        voltar: '#/materia/' + m.id,
        icone: m.icone,
        titulo: a.titulo,
        sub: m.nome,
        badge: badges(a),
        meta: metaLinha(a, st),
        acoes: btnFeito
      }) +

      '<div class="assunto-layout" style="--mat:' + corAssunto + ';--assunto-mat:' + corAssunto + '">' +
        '<div class="stack stack-5">' +
          (!temTeoria ? avisoSemTeoria(a) : '') +
          (temTeoria ? B.legendaCores() : '') +
          '<article class="prose' + K.matClass(m.id) + '" data-conteudo' + K.assuntoStyle(a) + '>' +
            (temTeoria ? B.renderAll(a.blocos, a.titulo) : '') +
          '</article>' +
          blocoVideos(m, a) +
          blocoRevisao(m, a, temTeoria) +
          blocoNavegacao(m, a) +
        '</div>' +
        '<div class="sumario-col">' +
          sumarioHtml +
        '</div>' +
      '</div>';

    ligar(alvo, m, a);
    observarSumario(alvo);
  }

  /* ------------------------------------------------------------------ */
  function naoEncontrado(alvo, id, voltar) {
    alvo.innerHTML = K.vazio('fas fa-circle-question', 'Assunto não encontrado',
      'O endereço #/assunto/…/' + esc(id) + ' não corresponde a nenhum assunto. ' +
      'Ele pode ter mudado de nome na reorganização do conteúdo.',
      voltar, 'Voltar');
  }

  function badges(a) {
    var out = [];
    if (a.kicker) out.push({ txt: a.kicker, cls: 'badge--outline' });
    if (a.origem.indexOf('teoria') > -1) out.push({ txt: 'teoria', cls: 'badge--gold' });
    if (a.questoes) out.push({ txt: a.questoes + ' questões', cls: 'badge--info' });
    if (a.dias && a.dias.length) out.push({ txt: 'dia ' + a.dias.join(', ') + ' do plano', cls: 'badge--neutral' });
    if (a.semTeoria) out.push({ txt: 'sem teoria', cls: 'badge--warning' });
    return out;
  }

  function metaLinha(a, st) {
    var partes = [];
    if (st.vistoEm) partes.push('<span class="badge badge--neutral">visto ' + U.tempoRelativo(st.vistoEm) + '</span>');
    if (st.concluidoEm) partes.push('<span class="badge badge--success">concluído ' + U.tempoRelativo(st.concluidoEm) + '</span>');
    if (a.fonte) partes.push('<span class="badge badge--outline">' + icon('fas fa-book') + ' ' + esc(a.fonte.split('/').pop()) + '</span>');
    return partes.join(' ');
  }

  function avisoSemTeoria(a) {
    return '<div class="alert alert--warning">' +
      '<span class="alert__icon">' + icon('fas fa-triangle-exclamation') + '</span>' +
      '<div class="alert__body"><div class="alert__title">Teoria ainda não escrita</div>' +
      'Este assunto existe no edital, mas a teoria ' +
      'correspondente ainda não foi redigida. Ele continua contando para ' +
      'o seu progresso.</div></div>';
  }

  /* ------------------------------------------------------------------ */
  function blocoVideos(m, a) {
    if (!a.videos || !a.videos.length) return '';
    return '<section id="s-videos" class="mt-8">' +
      '<div class="sec-head' + K.matClass(m.id) + '"' + K.assuntoStyle(a) + '>' +
        '<span class="sec-head__icon">' + icon('fas fa-play') + '</span>' +
        '<div><h2 class="sec-head__title">Vídeos de apoio</h2>' +
        '<p style="font-size:var(--fs-3xs);color:var(--text-faint);margin:0">' +
          a.videos.length + ' vídeo' + U.plural(a.videos.length - 1, '', 's') +
          (a.dias && a.dias.length ? ' · dia ' + a.dias.join(', ') + ' do plano' : '') + '</p></div>' +
      '</div>' +
      '<div class="video-grid">' + a.videos.map(function (v) {
        return K.videoCard(v, { materiaId: m.id, cor: K.assuntoCor(a) });
      }).join('') + '</div>' +
      '</section>';
  }

  function blocoRevisao(m, a, temTeoria) {
    var rev = P.revisao('assunto', m.id + ':' + a.id);
    return '<section id="s-revisao" class="mt-8">' +
      '<div class="card card--pad' + K.matClass(m.id) + '"' + K.assuntoStyle(a) + '>' +
        '<div class="row row-between row-wrap">' +
          '<div><h2 class="card__title">' + icon('fas fa-rotate') + ' Marcar para revisão</h2>' +
          '<p style="font-size:var(--fs-2xs);color:var(--text-faint);margin-top:4px;max-width:60ch">' +
            'Defina o assunto como pendente de revisão. Ele passa a aparecer na tela ' +
            'Revisão, para marcar o que ainda falta ver.</p></div>' +
          '<button class="btn ' + (rev ? 'btn--ghost' : 'btn--gold') + '" data-revisar>' +
            icon(rev ? 'fas fa-rotate-left' : 'fas fa-bookmark') + ' ' +
            (rev ? 'Remover da revisão' : 'Revisar depois') + '</button>' +
        '</div>' +
        (temTeoria ? '' : '') +
      '</div>' +
      '</section>';
  }

  function blocoNavegacao(m, a) {
    var lista = D.assuntos(m.id);
    var i = lista.findIndex ? lista.findIndex(function (x) { return x.id === a.id; }) : -1;
    var ant = i > 0 ? lista[i - 1] : null;
    var pro = i > -1 && i < lista.length - 1 ? lista[i + 1] : null;

    return '<nav class="row row-between row-wrap mt-8" aria-label="Navegação entre assuntos">' +
      (ant
        ? '<a class="btn btn--ghost btn--sm" href="#/assunto/' + esc(m.id) + '/' + esc(ant.id) + '">' +
            icon('fas fa-arrow-left') + ' ' + esc(ant.titulo.slice(0, 40)) + (ant.titulo.length > 40 ? '…' : '') + '</a>'
        : '<a class="btn btn--ghost btn--sm" href="#/materia/' + esc(m.id) + '">' +
            icon('fas fa-arrow-left') + ' Todos os assuntos</a>') +
      (pro
        ? '<a class="btn btn--subtle btn--sm" href="#/assunto/' + esc(m.id) + '/' + esc(pro.id) + '">' +
            esc(pro.titulo.slice(0, 40)) + (pro.titulo.length > 40 ? '…' : '') + ' ' + icon('fas fa-arrow-right') + '</a>'
        : '<a class="btn btn--subtle btn--sm" href="#/materia/' + esc(m.id) + '">' +
            'Voltar à matéria ' + icon('fas fa-arrow-right') + '</a>') +
      '</nav>';
  }

  /* ------------------------------------------------------------------ */
  function ligar(alvo, m, a) {
    U.on(alvo, 'click', '[data-marcar-feito]', function (e, t) {
      var st = P.assunto(m.id, a.id);
      P.marcarAssunto(m.id, a.id, 'feito', !st.feito);
      U.toast(!st.feito ? 'Assunto marcado como estudado' : 'Assunto reaberto',
              !st.feito ? 'success' : 'info');
      render(alvo, { materia: m.id, assunto: a.id });
    });

    U.on(alvo, 'click', '[data-revisar]', function (e, t) {
      var novo = P.alternarRevisao('assunto', m.id + ':' + a.id);
      U.toast(novo ? 'Adicionado às revisões' : 'Removido das revisões', 'info');
      render(alvo, { materia: m.id, assunto: a.id });
    });
  }

  /* ------------------------------------------------------------------
     Sumário: destaca o item conforme a rolagem (regra 31)
     ------------------------------------------------------------------ */
  function observarSumario(alvo) {
    var links = U.qsa('.sumario__link[data-sumario]', alvo);
    if (links.length < 2) return;
    var alvos = links.map(function (l) { return document.getElementById(l.getAttribute('data-sumario')); })
                     .filter(Boolean);
    if (!alvos.length) return;

    function marcar() {
      var topo = window.scrollY + 120, atual = alvos[0];
      alvos.forEach(function (el) { if (el.offsetTop <= topo) atual = el; });
      links.forEach(function (l) {
        l.classList.toggle('is-active', l.getAttribute('data-sumario') === atual.id);
      });
    }
    marcar();
    window.addEventListener('scroll', U.debounce(marcar, 120), { passive: true });
  }

  global.GMViews = global.GMViews || {};
  global.GMViews.assunto = { render: render };

})(window);


/* ===== views/anotacoes.js ===== */
/* ==========================================================================
   CARREIRAS POLICIAIS · VIEWS · ANOTAÇÕES PESSOAIS
   --------------------------------------------------------------------------
   Interface para gerenciar notas pessoais com editor rich text.
   
   Modos: lista (todas as notas) ou editor (criar/editar uma nota)
   Rich text: contenteditable + toolbar (B, I, U, H1, H2, lista, imagem)
   Imagens: modal com upload file + URL externa
   ========================================================================== */
(function (global) {
  'use strict';

  var manager = global.GMAnotacoes;
  var U = global.GMUI;
  var icon = U ? U.icon : function (name) { return ''; };
  var esc = U ? U.esc : function (txt) { return txt || ''; };

  var currentNota = null; // null = lista, { id, titulo, conteudo_html } = editor
  var autoSaveTimer = null;

  function pararAutoSave() {
    if (autoSaveTimer) { clearInterval(autoSaveTimer); autoSaveTimer = null; }
  }

  /* Toast local (sem dependências): substitui alert() nesta tela. */
  function toast(msg, tipo) {
    var box = document.querySelector('.anotacoes-toasts');
    if (!box) {
      box = document.createElement('div');
      box.className = 'anotacoes-toasts';
      document.body.appendChild(box);
    }
    var el = document.createElement('div');
    el.className = 'toast ' + (tipo || 'info');
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 3500);
  }

  /* ---------------------------------------------------------------------
     Render: lista OU editor
     --------------------------------------------------------------------- */
  function render(container) {
    pararAutoSave();
    if (currentNota === null) {
      renderLista(container);
    } else {
      renderEditor(container);
    }
  }

  /* ---------------------------------------------------------------------
     Lista de notas
     --------------------------------------------------------------------- */
  function renderLista(container) {
    var notas = manager.loadNotas();
    var quota = manager.getStorageQuota();
    var quotaPct = Math.round(quota * 100);

    var html = '<div class="anotacoes-lista">';
    
    // Header com botões
    html += '<div class="anotacoes-header">';
    html += '<h1>' + icon('fas fa-pen') + ' Anotações Pessoais</h1>';
    html += '<div class="anotacoes-actions">';
    html += '<button class="btn" data-action="nova">' + icon('fas fa-plus') + ' Nova Nota</button>';
    html += '<button class="btn btn--subtle" data-action="importar">' + icon('fas fa-upload') + ' Importar</button>';
    html += '<button class="btn btn--subtle" data-action="exportar-md">' + icon('fas fa-download') + ' Exportar .md</button>';
    html += '<button class="btn btn--subtle" data-action="exportar">' + icon('fas fa-box-archive') + ' Backup</button>';
    html += '</div>';
    html += '</div>';

    // Aviso: nota vive só neste navegador — exportar é o seguro
    html += '<div class="anotacoes-aviso">';
    html += icon('fas fa-triangle-exclamation') + ' <span><strong>Exporte suas anotações.</strong> ' +
      'Elas ficam salvas só neste navegador: se o site atualizar ou os dados forem limpos, ' +
      'tudo pode ser perdido. Use <strong>Exportar .md</strong> ou <strong>Backup</strong> regularmente.</span>';
    html += '</div>';

    // Quota warning
    if (quota >= 0.8) {
      html += '<div class="anotacoes-quota-warning">';
      html += icon('fas fa-triangle-exclamation') + ' Espaço usado: ' + quotaPct + '%. ';
      if (quota >= 0.95) html += '<strong>Crítico! Exporte backup e remova notas antigas.</strong>';
      else html += 'Considere exportar backup.';
      html += '</div>';
    }

    // Busca + cards (a busca repinta só a grade: o foco do campo é preservado)
    html += '<div class="anotacoes-busca">';
    html += '<i class="fas fa-magnifying-glass" aria-hidden="true"></i>';
    html += '<input type="search" data-busca-notas placeholder="Buscar nas notas…" aria-label="Buscar nas notas">';
    html += '</div>';
    html += '<div class="anotacoes-cards" data-cards></div>';

    html += '</div>';
    container.innerHTML = html;

    var campoBusca = container.querySelector('[data-busca-notas]');
    var grade = container.querySelector('[data-cards]');

    function pintar() { pintarCards(grade, campoBusca.value); }
    pintar();

    campoBusca.addEventListener('input', function () { pintar(); });

    // Eventos
    container.querySelector('[data-action="nova"]').addEventListener('click', function () {
      currentNota = { id: null, titulo: '', conteudo_html: '' };
      render(container);
    });

    var btnExportar = container.querySelector('[data-action="exportar"]');
    if (btnExportar) {
      btnExportar.addEventListener('click', function () {
        manager.exportarBackup();
        toast('Backup JSON baixado', 'success');
      });
    }

    var btnExportarMd = container.querySelector('[data-action="exportar-md"]');
    if (btnExportarMd) {
      btnExportarMd.addEventListener('click', function () {
        var n = manager.exportarTodosMd();
        toast(n ? n + ' nota(s) exportada(s) em .md' : 'Nenhuma nota para exportar', n ? 'success' : 'error');
      });
    }

    var btnImportar = container.querySelector('[data-action="importar"]');
    if (btnImportar) {
      btnImportar.addEventListener('click', function () {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.md,.markdown,.txt,.json';
        input.multiple = true;
        input.onchange = function (e) {
          var files = e.target.files;
          if (files && files.length) {
            manager.importarArquivos(files, function (result) {
              var partes = [];
              if (result.count) partes.push(result.count + ' nota(s) importada(s)');
              (result.errors || []).forEach(function (er) { partes.push(er); });
              toast(partes.join(' · ') || 'Nada importado', result.count ? 'success' : 'error');
              pintar();
            });
          }
        };
        input.click();
      });
    }

    // Delegação nos cards: nova (estado vazio), editar, .md, deletar
    grade.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-action]') : null;
      if (!btn) return;
      var acao = btn.getAttribute('data-action');
      var id = btn.getAttribute('data-id');
      if (acao === 'nova') {
        currentNota = { id: null, titulo: '', conteudo_html: '' };
        render(container);
      } else if (acao === 'editar') {
        currentNota = manager.obter(id);
        render(container);
      } else if (acao === 'md') {
        if (!manager.exportarMd(id)) toast('Nota não encontrada', 'error');
      } else if (acao === 'deletar') {
        if (confirm('Deletar nota permanentemente?')) {
          manager.deletar(id);
          pintar();
        }
      }
    });

    // Arrastar .md/.txt/.json para a grade importa direto
    grade.addEventListener('dragover', function (e) {
      e.preventDefault();
      grade.classList.add('drop-over');
    });
    grade.addEventListener('dragleave', function () {
      grade.classList.remove('drop-over');
    });
    grade.addEventListener('drop', function (e) {
      e.preventDefault();
      grade.classList.remove('drop-over');
      var files = e.dataTransfer && e.dataTransfer.files;
      if (files && files.length) {
        manager.importarArquivos(files, function (result) {
          toast(result.count ? result.count + ' nota(s) importada(s)' : 'Nada importado',
            result.count ? 'success' : 'error');
          pintar();
        });
      }
    });
  }

  function pintarCards(box, termo) {
    var notas = manager.loadNotas();
    var t = (termo || '').toLowerCase().trim();
    if (t) {
      notas = notas.filter(function (n) {
        var texto = (n.titulo + ' ' + String(n.conteudo_html || '').replace(/<[^>]+>/g, ' ')).toLowerCase();
        return texto.indexOf(t) > -1;
      });
    }
    if (!notas.length) {
      box.innerHTML = '<div class="anotacoes-empty"><p>' +
        (t ? 'Nenhuma nota para esta busca.' : 'Nenhuma nota criada ainda.') + '</p>' +
        (t ? '' : '<button class="btn" data-action="nova">' + icon('fas fa-plus') + ' Criar primeira nota</button>') +
        '</div>';
      return;
    }
    box.innerHTML = notas.map(renderCard).join('');
  }

  function renderCard(nota) {
    var dataCriacao = new Date(nota.data_criacao).toLocaleDateString('pt-BR');
    var dataModificacao = new Date(nota.data_modificacao).toLocaleDateString('pt-BR');
    
    // Preview: strip tags e truncate
    var preview = nota.conteudo_html
      .replace(/<[^>]+>/g, '')
      .substring(0, 150);
    if (nota.conteudo_html.length > 150) preview += '...';

    var html = '<div class="anotacao-card">';
    html += '<h3>' + esc(nota.titulo) + '</h3>';
    html += '<div class="anotacao-preview">' + esc(preview) + '</div>';
    html += '<div class="anotacao-meta">';
    html += '<span>' + icon('fas fa-calendar-days') + ' Criada: ' + dataCriacao + '</span>';
    if (dataCriacao !== dataModificacao) {
      html += '<span>' + icon('fas fa-pen') + ' Modificada: ' + dataModificacao + '</span>';
    }
    html += '</div>';
    html += '<div class="anotacao-actions">';
    html += '<button class="btn btn--sm" data-action="editar" data-id="' + nota.id + '">' + icon('fas fa-pen') + ' Editar</button>';
    html += '<button class="btn btn--sm" data-action="md" data-id="' + nota.id + '" title="Baixar como Markdown">' + icon('fas fa-download') + ' .md</button>';
    html += '<button class="btn btn--danger btn--sm" data-action="deletar" data-id="' + nota.id + '">' + icon('fas fa-trash-can') + ' Deletar</button>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  /* ---------------------------------------------------------------------
     Editor rich text
     --------------------------------------------------------------------- */
  function renderEditor(container) {
    /* Re-render com o editor aberto (ex.: troca de Foco repinta a rota):
       recolhe o rascunho do DOM antes de reconstruir, senão o digitado
       não salvo evapora "do nada". Com id, persiste na hora. */
    var velhoConteudo = container.querySelector('.editor-content');
    var velhoTitulo = container.querySelector('.editor-titulo');
    if (velhoConteudo && currentNota) {
      currentNota.conteudo_html = velhoConteudo.innerHTML;
      if (velhoTitulo) currentNota.titulo = velhoTitulo.value;
      if (currentNota.id) manager.atualizar(currentNota.id, currentNota.titulo, currentNota.conteudo_html);
    }

    var html = '<div class="anotacoes-editor">';
    
    // Header
    html += '<div class="editor-header">';
    html += '<button class="btn btn--subtle" data-action="voltar">' + icon('fas fa-arrow-left') + ' Voltar</button>';
    html += '<input type="text" class="editor-titulo" placeholder="Título da nota" value="' + esc(currentNota.titulo) + '">';
    html += '<button class="btn" data-action="salvar">' + icon('fas fa-save') + ' Salvar</button>';
    html += '</div>';

    // Toolbar
    html += '<div class="editor-toolbar">';
    html += '<button data-cmd="bold" title="Negrito (Ctrl+B)">' + icon('fas fa-bold') + '</button>';
    html += '<button data-cmd="italic" title="Itálico (Ctrl+I)">' + icon('fas fa-italic') + '</button>';
    html += '<button data-cmd="underline" title="Sublinhado (Ctrl+U)">' + icon('fas fa-underline') + '</button>';
    html += '<span class="toolbar-separator"></span>';
    html += '<button data-cmd="formatBlock" data-arg="h1" title="Título 1">H1</button>';
    html += '<button data-cmd="formatBlock" data-arg="h2" title="Título 2">H2</button>';
    html += '<button data-cmd="formatBlock" data-arg="p" title="Parágrafo">P</button>';
    html += '<span class="toolbar-separator"></span>';
    html += '<button data-cmd="insertUnorderedList" title="Lista">' + icon('fas fa-list-ul') + '</button>';
    html += '<button data-cmd="insertOrderedList" title="Lista Numerada">' + icon('fas fa-list-ol') + '</button>';
    html += '<span class="toolbar-separator"></span>';
    html += '<button data-action="imagem" title="Inserir Imagem">' + icon('fas fa-image') + '</button>';
    html += '</div>';

    // Contenteditable + barra de estado (Modificado/Salvo + contagem)
    html += '<div class="editor-content" contenteditable="true" data-placeholder="Digite suas anotações aqui...">';
    html += manager.sanitizar ? manager.sanitizar(currentNota.conteudo_html) : '';
    html += '</div>';
    html += '<div class="anotacoes-status"><span data-status>Pronto</span><span data-words></span></div>';

    html += '</div>';

    container.innerHTML = html;

    var editorContent = container.querySelector('.editor-content');
    var editorTitulo = container.querySelector('.editor-titulo');
    var statusEl = container.querySelector('[data-status]');
    var wordsEl = container.querySelector('[data-words]');
    var sujo = false;

    function palavras() {
      var t = (editorContent.innerText || '').trim();
      return t ? t.split(/\s+/).length : 0;
    }
    function pintarStatus() {
      if (statusEl) statusEl.textContent = sujo ? 'Modificado — Ctrl+S salva' : 'Salvo';
      if (wordsEl) wordsEl.textContent = palavras() + ' palavras';
    }
    /* Salva sem sair do editor; cria na primeira vez para o auto-save.
       Nós desanexados (timer de sessão antiga) não escrevem. */
    function salvarSilencioso() {
      if (!editorContent.isConnected) return false;
      var titulo = editorTitulo.value.trim() || 'Nota sem título';
      var conteudo = editorContent.innerHTML;
      if (currentNota.id) manager.atualizar(currentNota.id, titulo, conteudo);
      else currentNota = manager.criar(titulo, conteudo);
      sujo = false;
      pintarStatus();
    }
    pintarStatus();

    editorContent.addEventListener('input', function () { sujo = true; pintarStatus(); });
    editorTitulo.addEventListener('input', function () { sujo = true; pintarStatus(); });

    function ctrlS(e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        salvarSilencioso();
        toast('Nota salva', 'success');
      }
    }
    editorContent.addEventListener('keydown', ctrlS);
    editorTitulo.addEventListener('keydown', ctrlS);

    autoSaveTimer = setInterval(function () {
      if (sujo && currentNota) salvarSilencioso();
    }, 30000);

    // Eventos toolbar
    container.querySelectorAll('[data-cmd]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var cmd = btn.getAttribute('data-cmd');
        var arg = btn.getAttribute('data-arg') || null;
        document.execCommand(cmd, false, arg);
        editorContent.focus();
      });
    });

    // Botão imagem
    container.querySelector('[data-action="imagem"]').addEventListener('click', function () {
      showImageModal(container, editorContent);
    });

    // Voltar (salva antes se houve edição)
    container.querySelector('[data-action="voltar"]').addEventListener('click', function () {
      if (sujo) salvarSilencioso();
      currentNota = null;
      render(container);
    });

    // Salvar
    container.querySelector('[data-action="salvar"]').addEventListener('click', function () {
      salvarSilencioso();
      toast('Nota salva', 'success');
      currentNota = null;
      render(container);
    });

    // Drag & drop imagens
    editorContent.addEventListener('dragover', function (e) {
      e.preventDefault();
      editorContent.classList.add('drag-over');
    });

    editorContent.addEventListener('dragleave', function () {
      editorContent.classList.remove('drag-over');
    });

    editorContent.addEventListener('drop', function (e) {
      e.preventDefault();
      editorContent.classList.remove('drag-over');
      
      var file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        insertImageFromFile(file, editorContent);
      }
    });
  }

  /* ---------------------------------------------------------------------
     Modal inserir imagem
     --------------------------------------------------------------------- */
  function showImageModal(container, editorContent) {
    var modal = document.createElement('div');
    modal.className = 'anotacoes-modal';
    modal.innerHTML = '<div class="modal-content">' +
      '<h3>Inserir Imagem</h3>' +
      '<div class="modal-tabs">' +
      '<button class="tab-active" data-tab="upload">Upload Local</button>' +
      '<button data-tab="url">URL Externa</button>' +
      '</div>' +
      '<div class="modal-body">' +
      '<div class="tab-panel tab-active" data-panel="upload">' +
      '<input type="file" accept="image/*" id="imageUpload">' +
      '<p class="modal-hint">Máximo 500KB. Maior que isso? Use URL externa.</p>' +
      '</div>' +
      '<div class="tab-panel" data-panel="url">' +
      '<input type="text" placeholder="https://exemplo.com/imagem.jpg" id="imageUrl">' +
      '<p class="modal-hint">Imagem hospedada externamente.</p>' +
      '</div>' +
      '</div>' +
      '<div class="modal-actions">' +
      '<button class="btn btn--subtle" data-action="cancelar">Cancelar</button>' +
      '<button class="btn" data-action="inserir">Inserir</button>' +
      '</div>' +
      '</div>';

    document.body.appendChild(modal);

    // Tabs
    modal.querySelectorAll('[data-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tab = btn.getAttribute('data-tab');
        modal.querySelectorAll('[data-tab]').forEach(function (b) { b.classList.remove('tab-active'); });
        modal.querySelectorAll('[data-panel]').forEach(function (p) { p.classList.remove('tab-active'); });
        btn.classList.add('tab-active');
        modal.querySelector('[data-panel="' + tab + '"]').classList.add('tab-active');
      });
    });

    // Cancelar
    modal.querySelector('[data-action="cancelar"]').addEventListener('click', function () {
      modal.remove();
    });

    // Inserir
    modal.querySelector('[data-action="inserir"]').addEventListener('click', function () {
      var activeTab = modal.querySelector('.tab-panel.tab-active');
      if (activeTab.getAttribute('data-panel') === 'upload') {
        var file = modal.querySelector('#imageUpload').files[0];
        if (file) {
          insertImageFromFile(file, editorContent);
          modal.remove();
        } else {
          toast('Selecione um arquivo', 'error');
        }
      } else {
        var url = modal.querySelector('#imageUrl').value.trim();
        if (url) {
          insertImageFromUrl(url, editorContent);
          modal.remove();
        } else {
          toast('Insira uma URL', 'error');
        }
      }
    });
  }

  function insertImageFromFile(file, editorContent) {
    manager.uploadImagem(file, function (result) {
      if (result.success) {
        var img = '<img src="' + result.dataUrl + '" alt="Imagem" style="max-width: 100%; height: auto;">';
        document.execCommand('insertHTML', false, img);
      } else {
        toast(result.error, 'error');
      }
    });
  }

  function insertImageFromUrl(url, editorContent) {
    var img = '<img src="' + esc(url) + '" alt="Imagem" style="max-width: 100%; height: auto;">';
    document.execCommand('insertHTML', false, img);
  }

  /* ---------------------------------------------------------------------
     API Pública
     --------------------------------------------------------------------- */
  global.GMViews = global.GMViews || {};
  global.GMViews.anotacoes = {
    render: render
  };

})(this);


/* ===== views/configuracoes.js ===== */
/* ==========================================================================
   CARREIRAS POLICIAIS · VIEWS · CONFIGURAÇÕES
   --------------------------------------------------------------------------
   Preferências, dados e diagnóstico.

   REGRA 21 — quem usa a ferramenta tem direito de saber onde o progresso
   está guardado e como levá-lo junto. Por isso: exportar, importar, zerar
   progresso (só o estudo) e zerar tudo (inclusive preferências) são ações
   separadas e cada uma explica exatamente o que apaga.
   ========================================================================== */
(function (global) {
  'use strict';

  var U = global.GMUI, K = global.GMUIKit, P = global.GMProgresso,
      D = global.GMData, R = global.GMRouter, S = global.GMStore;
  var esc = U.esc, icon = U.icon;

  function render(alvo) {
    var s = S.getSettings();
    var st = S.get();
    var g = P.geral();
    var mq = window.matchMedia ? window.matchMedia('(max-width: 900px)') : null;
    var notas = 0;
    try {
      if (global.GMAnotacoes && global.GMAnotacoes.loadNotas) notas = global.GMAnotacoes.loadNotas().length;
    } catch (e) { notas = 0; }

    alvo.innerHTML =
      K.pageHead({
        icone: 'fas fa-gear',
        titulo: 'Configurações',
        sub: 'Aparência, dados salvos e diagnóstico da plataforma.'
      }) +

      '<div class="grid grid-2">' +

        /* ----------------aparência---------------- */
        '<section class="card card--pad">' +
          '<div class="card__head" style="padding:0 0 var(--sp-4);border:0">' +
            '<h2 class="card__title">' + icon('fas fa-palette') + ' Aparência</h2>' +
          '</div>' +

          grupo('Tema', 'Escuro por padrão; claro disponível para uso diurno.', [
            opcoes('tema', [
              { v: 'auto',   r: 'Automático', i: 'fas fa-circle-half-stroke' },
              { v: 'dark',   r: 'Escuro',     i: 'fas fa-moon' },
              { v: 'light',  r: 'Claro',     i: 'fas fa-sun' }
            ], s.tema)
          ]) +

          grupo('Densidade', 'Espaçamento entre linhas e blocos de texto.', [
            opcoes('densidade', [
              { v: 'compacta', r: 'Compacta' },
              { v: 'normal',   r: 'Normal' },
              { v: 'ampla',    r: 'Ampla' }
            ], s.densidade)
          ]) +

          grupo('Tamanho do texto', 'Aumenta todo o texto da plataforma, não só este formulário.', [
            opcoes('fonte', [
              { v: 'reduzida', r: 'Reduzida' },
              { v: 'padrao',   r: 'Padrão' },
              { v: 'ampliada', r: 'Ampliada' }
            ], s.fonte)
          ]) +

          grupo('Movimento', 'Desligue se animação atrapalha a leitura.', [
            interruptor('movimento', 'Animações e transições', s.movimento)
          ]) +

          grupo('Estudo', 'Preferências que mudam como você responde e estuda.', [
            interruptor('mostrarGabarito', 'Mostrar o gabarito antes de responder', s.mostrarGabarito),
            interruptor('siglaVideo', 'Mostrar a letra do dia sobre o vídeo', s.siglaVideo)
          ]) +
        '</section>' +

        /* ----------------dados---------------- */
        '<section class="card card--pad">' +
          '<div class="card__head" style="padding:0 0 var(--sp-4);border:0">' +
            '<h2 class="card__title">' + icon('fas fa-database') + ' Seus dados</h2>' +
          '</div>' +
          '<p style="font-size:var(--fs-sm);color:var(--text-muted);line-height:1.7">' +
            'Todo o progresso fica <strong>no seu navegador</strong>, na chave ' +
            '<code>' + esc(S.STORAGE_KEY) + '</code> do localStorage. Nada é enviado ' +
            'para servidor nenhum. Se você limpar os dados do navegador ou trocar de ' +
            'aparelho, o progresso vai junto — por isso vale exportar de vez em quando.' +
          '</p>' +

          '<div class="grid grid-2 mt-6">' +
            dado('Assuntos concluídos', g.materias.feitos + '/' + g.materias.total) +
            dado('Anotações criadas', notas) +
            dado('Questões respondidas', g.questoes.respondidas + '/' + g.questoes.disponiveis) +
            dado('Vídeos marcados', Object.keys(st.videosAssistidos).length) +
          '</div>' +

          '<div class="stack stack-2 mt-6">' +
            '<button class="btn btn--subtle btn--block" data-exportar>' +
              icon('fas fa-download') + ' Exportar meus dados (JSON)</button>' +
            '<button class="btn btn--subtle btn--block" data-importar>' +
              icon('fas fa-upload') + ' Importar de um arquivo</button>' +
            '<input type="file" accept="application/json,.json" data-arq-json hidden>' +
          '</div>' +

          '<div class="divider"></div>' +

          '<div class="stack stack-2">' +
            botaoPerigo('data-reset-progresso', 'fas fa-eraser', 'Zerar só o progresso de estudo',
              'Apaga dias, matérias, checklists, vídeos, questões e assuntos marcados. ' +
              'As preferências e as revisões importadas continuam.') +
            botaoPerigo('data-reset-tudo', 'fas fa-triangle-exclamation', 'Zerar tudo',
              'Apaga o progresso E as preferências, voltando ao estado de primeira execução.') +
          '</div>' +
        '</section>' +
      '</div>' +

      /* ----------------diagnóstico---------------- */
      '<section class="card card--pad" style="margin-top:var(--sp-6)">' +
        '<div class="card__head" style="padding:0 0 var(--sp-4);border:0">' +
          '<h2 class="card__title">' + icon('fas fa-stethoscope') + ' Diagnóstico</h2>' +
          '<span class="t-xs t-faint">para relatar problemas</span>' +
        '</div>' +
        '<div class="table-wrap"><table class="table table--compact">' +
        '<tbody>' +
        linhaDiag('Versão do esquema de dados', S.SCHEMA_VERSION + ' (chave <code>' + esc(S.STORAGE_KEY) + '</code>)') +
        linhaDiag('Disciplinas', D.materias.length + ' (' + D.materiasDoEdital().length + ' do edital + ' +
          D.materias.filter(function (m) { return m.utilitaria; }).length + ' auxiliar)') +
        linhaDiag('Áreas do edital', D.areas.length) +
        linhaDiag('Assuntos mapeados', D.assuntosTodos().length) +
        linhaDiag('Assuntos com teoria escrita', D.assuntosTodos().filter(D.assuntosTemTeoria).length) +
        linhaDiag('Vídeos vinculados', D.assuntosTodos().reduce(function (t, a) {
          return t + (a.videos || []).length; }, 0)) +
        linhaDiag('Chave de preferências', '<code>' + esc(S.SETTINGS_KEY) + '</code>') +
        linhaDiag('Revisões importadas do material antigo', Object.keys(st.revisoes.legado || {}).length + ' listas') +
        linhaDiag('Largura da janela', (window.innerWidth || 0) + 'px' +
          (mq && mq.matches ? ' · até 900px (menu lateral vira gaveta)' : ' · acima de 900px (menu fixo)')) +
        '</tbody></table></div>' +
      '</section>';

    ligar(alvo);
  }

  /* ------------------------------------------------------------------ */
  function grupo(titulo, sub, controles) {
    return '<div class="c-h5" style="margin:0 0 var(--sp-1)">' + esc(titulo) + '</div>' +
      (sub ? '<p class="t-xs t-faint" style="margin:0 0 var(--sp-3)">' + esc(sub) + '</p>' : '') +
      '<div class="stack stack-3" style="margin-bottom:var(--sp-6)">' + controles.join('') + '</div>';
  }

  function opcoes(nome, ops, atual) {
    return '<div class="field"><span class="field__label" id="lbl-' + nome + '">' +
      esc(nome.charAt(0).toUpperCase() + nome.slice(1)) + '</span>' +
      '<div class="seg-opts" role="radiogroup" aria-labelledby="lbl-' + nome + '">' +
      ops.map(function (o) {
        return '<button class="seg-opts__btn' + (atual === o.v ? ' is-active' : '') + '" ' +
          'role="radio" aria-checked="' + (atual === o.v) + '" data-set="' + nome + '" data-val="' +
          esc(o.v) + '">' + (o.i ? icon(o.i) + ' ' : '') + esc(o.r) + '</button>';
      }).join('') + '</div></div>';
  }

  function interruptor(chave, rot, val) {
    return '<label class="check check--row"><input type="checkbox" data-set-toggle="' + chave + '"' +
      (val ? ' checked' : '') + '><span class="checklist__text">' + esc(rot) + '</span></label>';
  }

  function dado(rot, val) {
    return '<div class="stat" style="--stat-color:var(--accent-2)">' +
      '<div class="stat__value" style="font-size:var(--fs-lg)">' + esc(String(val)) + '</div>' +
      '<div class="stat__label">' + esc(rot) + '</div></div>';
  }

  function botaoPerigo(sel, ic, titulo, sub) {
    return '<div><button class="btn btn--danger btn--sm" ' + sel + '>' + icon(ic) + ' ' +
      esc(titulo) + '</button><p class="t-xs t-faint" style="margin-top:5px">' + esc(sub) + '</p></div>';
  }

  function linhaDiag(k, v) {
    return '<tr><td style="color:var(--text-muted)">' + esc(k) + '</td><td>' + v + '</td></tr>';
  }

  /* ------------------------------------------------------------------ */
  function ligar(alvo) {
    U.on(alvo, 'click', '[data-set]', function (e, t) {
      var chave = t.getAttribute('data-set');
      S.setSetting(chave, t.getAttribute('data-val'));
      U.aplicarPreferencias();
      U.toast('Preferência salva', 'success');
      render(alvo);
    });

    U.on(alvo, 'change', '[data-set-toggle]', function (e, t) {
      S.setSetting(t.getAttribute('data-set-toggle'), t.checked);
      U.aplicarPreferencias();
      U.toast('Preferência salva', 'success');
    });

    U.on(alvo, 'click', '[data-exportar]', function () {
      var dados = S.exportar();
      var blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'carreiras-policiais-progresso-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      U.toast('Arquivo gerado', 'success');
    });

    U.on(alvo, 'click', '[data-importar]', function () {
      var inp = U.qs('[data-arq-json]', alvo);
      if (!inp) return;
      inp.click();
    });

    U.on(alvo, 'change', '[data-arq-json]', function (e, t) {
      var file = t.files && t.files[0];
      if (!file) return;
      var fr = new FileReader();
      fr.onload = function () {
        var ok = false;
        try { ok = S.importar(JSON.parse(fr.result)); } catch (err) { ok = false; }
        U.toast(ok ? 'Dados importados' : 'Arquivo inválido', ok ? 'success' : 'danger');
        if (ok) render(alvo);
      };
      fr.readAsText(file);
    });

    U.on(alvo, 'click', '[data-reset-progresso]', function () {
      U.confirmar('Zerar o progresso de estudo?',
        'Dias concluídos, matérias, checklists, vídeos, questões respondidas e ' +
        'assuntos marcados serão apagados. As suas preferências (tema, densidade) ' +
        'e as revisões importadas do material antigo continuam. Esta ação não tem volta.',
        function () {
          S.resetProgresso();
          U.toast('Progresso zerado', 'info');
          R.go('/materias', { replace: true });
        });
    });

    U.on(alvo, 'click', '[data-reset-tudo]', function () {
      U.confirmar('Zerar TUDO?',
        'Isso apaga o progresso de estudo E as preferências, exatamente como se ' +
        'você tivesse acabado de abrir a plataforma pela primeira vez. ' +
        'As revisões importadas do material antigo também são apagadas. Esta ação ' +
        'não tem volta — exporte antes se tiver dúvida.',
        function () {
          S.resetTudo();
          U.aplicarPreferencias();
          U.toast('Tudo zerado', 'info');
          R.go('/materias', { replace: true });
        });
    });
  }

  global.GMViews = global.GMViews || {};
  global.GMViews.configuracoes = { render: render };

})(window);


/* ===== views/busca.js ===== */
/* ==========================================================================
   CARREIRAS POLICIAIS · VIEWS · BUSCA
   --------------------------------------------------------------------------
   A busca é global e atravessa:

     · títulos de assunto (teoria e questões);
     · o texto integral das teorias;
     · o enunciado das questões de banca;
     · os vídeos e as matérias.

   Os resultados são agrupados por tipo, com a ocorrência destacada no
   trecho encontrado.
   ========================================================================== */
(function (global) {
  'use strict';

  var U = global.GMUI, K = global.GMUIKit, D = global.GMData,
      R = global.GMRouter, S = global.GMStore;
  var esc = U.esc, icon = U.icon;

  function render(alvo, params) {
    var q = (params && params.query && params.query.q) || '';
    S.setSetting('ultimos', [q].concat(
      (S.getSettings().ultimos || []).filter(function (x) { return x && x !== q; })
    ).slice(0, 8));

    var recentes = (S.getSettings().ultimos || []).filter(function (x) { return x && x !== q; });

    if (!q) {
      alvo.innerHTML =
        K.pageHead({ icone: 'fas fa-magnifying-glass', titulo: 'Busca',
          sub: 'Procure em toda a plataforma: teoria, questões, vídeos e matérias.' }) +
        corpoVazio(recentes);
      ligar(alvo);
      return;
    }

    var res = D.assuntosBuscar(q);
    var grupos = {
      assunto: res.filter(function (r) { return r.tipo === 'assunto'; })
    };

    alvo.innerHTML =
      K.pageHead({
        icone: 'fas fa-magnifying-glass',
        titulo: 'Busca',
        badge: [{ txt: res.length + ' resultado' + U.plural(res.length - 1, '', 's'), cls: 'badge--gold' }]
      }) +
      '<div class="toolbar">' +
        '<div class="toolbar__search">' +
          '<i class="fas fa-magnifying-glass toolbar__search-icon" aria-hidden="true"></i>' +
          '<input type="search" class="input" value="' + esc(q) + '" data-busca-global ' +
            'aria-label="Termo de busca" placeholder="' + esc(q) + '">' +
        '</div>' +
        '<div class="toolbar__count">' + esc(q) + '</div>' +
      '</div>' +
      (res.length ? corpoResultados(q, grupos)
                  : corpoSem(q, recentes));

    ligar(alvo);
  }

  /* ------------------------------------------------------------------ */
  function corpoVazio(recentes) {
    /* Assuntos com mais texto primeiro; blocos podem ter `html` ou `texto`. */
    function peso(a) {
      return (a.blocos || []).reduce(function (n, b) {
        return n + (b.html || b.texto || '').length;
      }, 0);
    }
    var mais = D.assuntosTodos().filter(D.assuntosTemTeoria)
      .sort(function (a, b) { return peso(b) - peso(a); })
      .slice(0, 8);

    return '<div class="grid grid-2">' +
      '<section class="card card--pad">' +
        '<div class="card__head" style="padding:0 0 var(--sp-4);border:0">' +
          '<h2 class="card__title">' + icon('fas fa-clock-rotate-left') + ' Buscas recentes</h2>' +
        '</div>' +
        (recentes.length
          ? '<div class="chips">' + recentes.map(function (r) {
              return '<a class="chip" href="#/busca?q=' + encodeURIComponent(r) + '">' +
                icon('fas fa-magnifying-glass') + ' ' + esc(r) + '</a>';
            }).join('') + '</div>'
          : '<p class="t-sm t-faint">Suas buscas ficam guardadas só neste navegador.</p>') +
        '<div class="divider"></div>' +
        '<h3 class="c-h5" style="margin:0 0 var(--sp-3)">Sugestões</h3>' +
        '<div class="chips">' +
          ['abuso de autoridade', 'Estatuto das Guardas Municipais', 'Maria da Penha',
           'homicídio', 'improbidade administrativa', 'crimes contra a pessoa']
            .filter(function (s) { return /^[a-zA-ZÀ-ÿ0-9 ,.§º\-]+$/.test(s); })
            .map(function (s) {
              return '<a class="chip" href="#/busca?q=' + encodeURIComponent(s) + '">' + esc(s) + '</a>';
            }).join('') +
        '</div>' +
      '</section>' +

      '<section class="card card--pad">' +
        '<div class="card__head" style="padding:0 0 var(--sp-4);border:0">' +
          '<h2 class="card__title">' + icon('fas fa-book-open') + ' Onde a busca procura</h2>' +
        '</div>' +
        '<dl class="deflist">' +
          '<div class="deflist__row"><dt>Títulos de assunto</dt><dd>' +
            D.assuntosTodos().length + '</dd></div>' +
          '<div class="deflist__row"><dt>Texto das teorias</dt><dd>' +
            D.assuntosTodos().filter(D.assuntosTemTeoria).length + ' assuntos</dd></div>' +
          '<div class="deflist__row"><dt>Enunciados de questão</dt><dd>' +
            '—</dd></div>' +
          '<div class="deflist__row"><dt>Matérias e áreas</dt><dd>' + D.materias.length + '</dd></div>' +
        '</dl>' +
        '<div class="divider"></div>' +
        '<h3 class="c-h5" style="margin:0 0 var(--sp-3)">Assuntos mais longos</h3>' +
        '<div class="stack stack-1">' + mais.map(K.assuntoCard).join('') + '</div>' +
      '</section>' +
    '</div>';
  }

  function corpoResultados(q, g) {
    return (g.assunto.length ? secao('assuntos', 'fas fa-book-open', 'Assuntos', g.assunto, q) : '');
  }

  function secao(tipo, ic, titulo, lista, q) {
    return '<div class="sec-head"><span class="sec-head__icon">' + icon(ic) + '</span>' +
      '<div><h2 class="sec-head__title">' + esc(titulo) + '</h2>' +
      '<p style="font-size:var(--fs-3xs);color:var(--text-faint);margin:0">' +
        lista.length + ' resultado' + U.plural(lista.length - 1, '', 's') + '</p></div></div>' +
      '<div class="stack stack-2">' + lista.map(function (r) {
        var a = r.mat;
        var m = D.materia(a.materiaId);
        var tags = [];
        if (a.origem.indexOf('teoria') > -1) tags.push('teoria');
        if (a.questoes) tags.push(a.questoes + ' questões');
        if (a.videos && a.videos.length) tags.push(a.videos.length + ' vídeos');
        if (a.semTeoria) tags.push('sem teoria');

        return '<a class="assunto-card' + K.matClass(a.materiaId) + '" href="' + esc(r.url) + '"' +
          K.assuntoStyle(a) + '>' +
          '<span class="mat-card__icon" style="width:32px;height:32px;font-size:var(--fs-2xs)">' +
            icon(m ? m.icone : 'fas fa-book') + '</span>' +
          '<span class="assunto-card__body">' +
            '<span class="assunto-card__title">' + realce(a.titulo, q) + '</span>' +
            (r.trecho
              ? '<span class="assunto-card__snippet">…' + realce(r.trecho, q) + '…</span>'
              : '<span class="assunto-card__meta">' + esc(m ? m.nomeCronograma : '') +
                (tags.length ? ' · ' + tags.join(' · ') : '') + '</span>') +
          '</span>' +
          '<i class="fas fa-chevron-right assunto-card__arrow" aria-hidden="true"></i>' +
          '</a>';
      }).join('') + '</div>';
  }

  function corpoSem(q, recentes) {
    var termo = U.norm(q);
    // sugestão dematteria por título
    var prox = D.materias.map(function (m) {
      return { m: m, s: D.similaridade(m.nome, q) };
    }).sort(function (a, b) { return b.s - a.s; }).slice(0, 3);

    return K.vazio('fas fa-magnifying-glass', 'Nada encontrado para "' + q + '"',
      'A busca procura em títulos de assunto, no texto das teorias e nos ' +
      'enunciados das questões de banca. Tente uma palavra mais curta.',
      null) +
      (recentes.length
        ? '<div class="chips" style="justify-content:center;margin-top:var(--sp-5)">' +
          recentes.map(function (r) {
            return '<a class="chip" href="#/busca?q=' + encodeURIComponent(r) + '">' + esc(r) + '</a>';
          }).join('') + '</div>'
        : '') +
      '<section class="card card--pad" style="margin-top:var(--sp-6)">' +
        '<h2 class="card__title" style="font-size:var(--fs-md)">' +
          icon('fas fa-compass') + ' Se você procurava uma matéria</h2>' +
        '<div class="assuntos-grid mt-4">' + prox.map(function (p) {
          return K.matCard(p.m);
        }).join('') + '</div></section>';
  }

  /** Destaca o termo encontrado sem quebrar o HTML. */
  function realce(texto, q) {
    var saida = esc(texto);
    var alvo = U.norm(q).split(' ').filter(function (w) { return w.length > 2; });
    if (!alvo.length) return saida;
    // realça tanto o termo com acento quanto sua forma normalizada
    var re = new RegExp('(' + alvo.map(function (w) {
      return w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }).join('|') + ')', 'gi');
    return saida.replace(re, '<mark class=\"hl\">$1</mark>');
  }

  /* ------------------------------------------------------------------ */
  function ligar(alvo) {
    U.on(alvo, 'input', '[data-busca-global]', U.debounce(function (e, t) {
      var v = t.value.trim();
      if (v.length < 2) { R.go('/busca', { replace: true }); return; }
      R.go('/busca?q=' + encodeURIComponent(v), { replace: true });
    }, 320));
  }

  global.GMViews = global.GMViews || {};
  global.GMViews.busca = { render: render };

})(window);


/* ===== app.js ===== */
/* ==========================================================================
   CARREIRAS POLICIAIS · APP
   --------------------------------------------------------------------------
   A casca da plataforma: sidebar, topo, busca, breadcrumb, rodapé, tema,
   atalhos de teclado e o registro das rotas.

   Um único menu e uma única barra de topo: todas as telas passam a ser só
   rotas desta casca. O seletor de foco (corporação) vive em
   components/filtro-corporacao.js e repinta o menu via evento.
   ========================================================================== */
(function (global) {
  'use strict';

  var U = global.GMUI, S = global.GMStore, D = global.GMData,
      R = global.GMRouter, P = global.GMProgresso;
  var esc = U.esc, icon = U.icon;

  var el = {};

  /* =====================================================================
     ÍNDICE DE NAVEGAÇÃO — a única lista de menu da plataforma
     ===================================================================== */
  function menu() {
    return [
      { icone: 'fas fa-compass', rot: 'Matérias',  rota: '/materias',   ex: 'M' },
      { icone: 'fas fa-note-sticky', rot: 'Anotações', rota: '/anotacoes', ex: 'N' },
      { icone: 'fas fa-magnifying-glass', rot: 'Busca', rota: '/busca', ex: 'B' }
    ];
  }

  /* Matérias no menu, por área — respeitando o foco (corporação) ativo */
  function menuMaterias() {
    var corp = (global.GMCorporacoes && global.GMCorporacoes.ativa() || {}).id || 'todas';
    return D.areas.map(function (a) {
      return {
        tipo: 'secao', rot: a.nome, cor: a.cor,
        itens: D.materias.filter(function (m) {
            return m.area === a.id && D.materiaCoberta(m, corp);
          })
          .sort(function (x, y) { return x.ordem - y.ordem; })
          .map(function (m) {
            return {
              icone: m.icone, rot: m.nomeCronograma, rota: '/materia/' + m.id,
              cor: m.cor, utilitaria: m.utilitaria,
              conta: function () { var p = P.materia(m.id); return p.pct === 100 ? null : p.pct + '%'; }
            };
          })
      };
    }).filter(function (g) { return g.itens.length; });
  }

  /* =====================================================================
     CASCA
     ===================================================================== */
  function montar() {
    var c = D.concurso;

    el.app = U.qs('#app');
    el.side = U.qs('#sidebar');
    el.nav = U.qs('#sidebar-nav');
    el.top = U.qs('#topbar-title');
    el.sub = U.qs('#topbar-sub');
    el.crumbs = U.qs('#breadcrumb');
    el.busca = U.qs('#busca-global');
    el.main = U.qs('#main');
    el.over = U.qs('#overlay');
    el.progresso = U.qs('#topbar-progress');

    // marca da marca
    var brand = U.qs('.sidebar-brand__mark');
    if (brand) brand.innerHTML = icon('fas fa-shield-halved');
    var bt = U.qs('.sidebar-brand__title');
    if (bt) bt.textContent = c.nome;
    var bs = U.qs('.sidebar-brand__sub');
    if (bs) bs.textContent = c.banca + ' · ' + c.edital;

    el.fundo = U.qs('.app-footer__links');
    if (el.fundo) {
      el.fundo.innerHTML = [
        ['#/configuracoes', 'Configurações'],
        ['#/busca', 'Busca'], ['#/materias', 'Matérias'], ['#/anotacoes', 'Anotações']
      ].map(function (l) { return '<a href="' + l[0] + '">' + l[1] + '</a>'; }).join('') +
      '<span>·</span><span>núcleo comum das carreiras policiais</span>';
    }

    pintarNav();
    ligarCasca();
  }

  /* ---------------------------------------------------------------------
     Menu lateral
     --------------------------------------------------------------------- */
  function pintarNav() {
    var partes = [];

    partes.push('<nav class="sidebar-nav" aria-label="Navegação principal">');
    partes.push('<div class="sidebar-section">');
    menu().forEach(function (it) {
      partes.push(itemNav(it));
    });
    partes.push('</div>');

    menuMaterias().forEach(function (g) {
      partes.push('<div class="sidebar-section">');
      partes.push('<div class="sidebar-section__title" style="--mat:' + g.cor + '">' +
        esc(g.rot) + '</div>');
      g.itens.forEach(function (it) { partes.push(itemNav(it, true)); });
      partes.push('</div>');
    });

    outrasMaterias().forEach(function (it) {
      partes.push('<div class="sidebar-section">' + itemExterno(it) + '</div>');
    });

    partes.push('<div class="sidebar-section">' +
      itemNav({ icone: 'fas fa-gear', rot: 'Configurações', rota: '/configuracoes' }) +
      '</div>');

    partes.push('</nav>');
    partes.push('<div class="sidebar-foot">' +
      '<button class="sidebar-theme" data-tema title="Alternar tema claro/escuro" ' +
        'aria-label="Alternar tema claro e escuro">' +
        '<i class="fas fa-moon sidebar-theme__icon-dark" aria-hidden="true"></i>' +
        '<i class="fas fa-sun sidebar-theme__icon-light" aria-hidden="true"></i>' +
        '<span data-tema-rot>Tema</span></button>' +
      '</div>');

    el.nav.innerHTML = partes.join('');
  }

  function itemNav(it, materia) {
    var conta = '';
    if (it.conta) {
      try { conta = it.conta(); } catch (e) { conta = ''; }
    }
    return '<a class="nav-item' + (materia ? ' nav-item--materia' : '') + '" ' +
      'href="#' + esc(it.rota) + '" data-rota="' + esc(it.rota) + '"' +
      (it.cor ? ' style="--mat:' + it.cor + '"' : '') + '>' +
      '<span class="nav-item__icon">' + icon(it.icone) + '</span>' +
      '<span class="nav-item__label">' + esc(it.rot) +
        (it.utilitaria ? ' <span class="badge badge--neutral" style="font-size:.55rem">aux</span>' : '') +
      '</span>' +
      (conta ? '<span class="nav-item__count">' + esc(String(conta)) + '</span>' : '') +
      '</a>';
  }

  /* ---------------------------------------------------------------------
     Outras Matérias — links externos, declarados no index.html
     ---------------------------------------------------------------------
     Os links vivem no <script id="outras-materias"> do index.html.
     Editar o HTML é o suficiente; nada aqui precisa mudar. */
  function outrasMaterias() {
    var el = document.getElementById('outras-materias');
    if (!el) return [];
    try {
      var lista = JSON.parse(el.textContent);
      return Array.isArray(lista) ? lista.filter(function (l) { return l && l.url; }) : [];
    } catch (e) { return []; }
  }

  /* Link externo: abre em aba nova e fecha o menu no mobile. */
  function itemExterno(it) {
    var rot = it.rotulo || it.rot || it.url;
    return '<a class="nav-item" href="' + esc(it.url) + '" target="_blank" rel="noopener noreferrer"' +
      ' data-externo="1" title="' + esc(rot) + '">' +
      '<span class="nav-item__icon">' + icon('fas fa-arrow-up-right-from-square') + '</span>' +
      '<span class="nav-item__label">' + esc(rot) + '</span>' +
      '</a>';
  }

  /* ---------------------------------------------------------------------
     Casca: eventos globais
     --------------------------------------------------------------------- */
  function ligarCasca() {
    // busca global
    U.on(el.busca, 'input', U.debounce(function () {
      var v = el.busca.value.trim();
      if (v.length < 2) { if (R.atual() && R.atual().rota === '/busca') R.go('/busca', { replace: true }); return; }
      if (R.atual() && R.atual().rota === '/busca') { R.resolver(true); return; }
      R.go('/busca?q=' + encodeURIComponent(v));
    }, 320));
    U.on(el.busca, 'keydown', function (e) {
      if (e.key === 'Escape') { el.busca.value = ''; el.busca.blur(); }
      if (e.key === 'Enter' && el.busca.value.trim().length >= 2) {
        R.go('/busca?q=' + encodeURIComponent(el.busca.value.trim()));
      }
    });

    // busca rápida entre as rotas, com "/" (regra 42)
    document.addEventListener('keydown', function (e) {
      var emCampo = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
      if (emCampo) return;

      if (e.key === '/') { e.preventDefault(); el.busca.focus(); el.busca.select(); return; }
      if (e.key === '?') { e.preventDefault(); U.abrirAjuda(); return; }
      if (e.key === 'Escape' && el.side.classList.contains('is-open')) {
        fecharMenu();
        return;
      }

      // atalhos por letra
      if (!e.ctrlKey && !e.metaKey && !e.altKey && /^[a-zà-úA-ZÀ-Ú]$/.test(e.key)) {
        var alvo = menu().filter(function (m) { return m.ex === e.key.toUpperCase(); })[0];
        if (alvo) { e.preventDefault(); R.go(alvo.rota); }
      }
    });

    // gaveta lateral no mobile
    U.on(document, 'click', '[data-toggle-sidebar]', function () {
      el.side.classList.contains('is-open') ? fecharMenu() : abrirMenu();
    });
    U.on(el.over, 'click', fecharMenu);
    U.on(el.nav, 'click', 'a.nav-item', function () { fecharMenu(); });

    // fechar o menu ao voltar para desktop
    window.addEventListener('resize', U.debounce(function () {
      if (window.innerWidth > 1024) fecharMenu();
    }, 200));

    // tema
    U.on(document, 'click', '[data-tema]', function () {
      var s = S.getSettings();
      var prox = s.tema === 'light' ? 'dark' : 'light';
      S.setSetting('tema', prox);
      U.aplicarPreferencias();
      atualizarRodapeTema();
    });

    // voltar
    U.on(document, 'click', '[data-voltar]', function () { R.voltar(); });
  }

  function abrirMenu() {
    el.side.classList.add('is-open');
    el.over.classList.add('is-visible');
    el.over.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    U.qsa('[data-toggle-sidebar]').forEach(function (btn) {
      btn.setAttribute('aria-expanded', 'true');
    });
  }
  function fecharMenu() {
    el.side.classList.remove('is-open');
    el.over.classList.remove('is-visible');
    el.over.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    U.qsa('[data-toggle-sidebar]').forEach(function (btn) {
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  function atualizarRodapeTema() {
    var t = S.getSettings().tema;
    var rot = U.qs('[data-tema-rot]');
    if (rot) rot.textContent = t === 'light' ? 'Claro' : t === 'dark' ? 'Escuro' : 'Automático';
  }

  /* =====================================================================
     ROTAS
     ===================================================================== */
  function registrarRotas() {
    R.on('/materias', function (a) {
      global.GMViews.materias.renderLista(el.main);
      crumb([['Matérias', '']]);
    });
    R.on('/materia/:id', function (a) {
      var m = D.materia(a.params.id);
      global.GMViews.materias.renderMateria(el.main, a.params);
      crumb([['Matérias', '#/materias'],
             [m ? m.nomeCronograma : a.params.id, '']]);
    });
    R.on('/assunto/:materia/:assunto', function (a) {
      var m = D.materia(a.params.materia);
      var s = D.assunto(a.params.materia, a.params.assunto);
      global.GMViews.assunto.render(el.main, a.params);
      crumb([['Matérias', '#/materias'],
             [m ? m.nomeCronograma : a.params.materia, '#/materia/' + a.params.materia],
             [s ? s.titulo : a.params.assunto, '']]);
    });

    R.on('/anotacoes', function (a) {
      global.GMViews.anotacoes.render(el.main);
      crumb([['Anotações', '']]);
    });

    R.on('/configuracoes', function (a) {
      global.GMViews.configuracoes.render(el.main);
      crumb([['Configurações', '']]);
    });
    R.on('/busca', function (a) {
      global.GMViews.busca.render(el.main, a);
      crumb([['Busca', '']]);
    });
  }

  /* ---------------------------------------------------------------------
     Breadcrumb
     --------------------------------------------------------------------- */
  function crumb(itens) {
    if (!el.crumbs) return;
    if (!itens.length) { el.crumbs.innerHTML = ''; el.crumbs.hidden = true; return; }
    el.crumbs.hidden = false;
    el.crumbs.innerHTML = itens.map(function (it, i) {
      var ultimo = i === itens.length - 1;
      return '<span class="breadcrumb__item">' +
        (ultimo || !it[1]
          ? '<span aria-current="page">' + esc(it[0]) + '</span>'
          : '<a href="' + esc(it[1]) + '">' + esc(it[0]) + '</a>') +
        '</span>' + (ultimo ? '' : '<span class="breadcrumb__sep" aria-hidden="true">/</span>');
    }).join('');
  }

  /* ---------------------------------------------------------------------
     Cabeçalho da tela
     --------------------------------------------------------------------- */
  function titulo(t, sub) {
    el.top.textContent = t;
    el.sub.textContent = sub || '';
    el.sub.hidden = !sub;
    document.title = t + ' · ' + D.concurso.nome;
  }

  /* =====================================================================
     APÓS CADA ROTA
     ===================================================================== */
  var TITULOS = {
    '/materias': ['Matérias', 'Toda a teoria do núcleo comum'],
    '/anotacoes': ['Anotações', 'Seu bloco de notas de estudo'],
    '/configuracoes': ['Configurações', 'Aparência, dados e diagnóstico'],
    '/busca': ['Busca', 'Em toda a plataforma']
  };

  function posRender() {
    var r = R.atual();
    if (!r) return;

    // título
    if (TITULOS[r.rota]) titulo(TITULOS[r.rota][0], TITULOS[r.rota][1]);
    else if (r.rota === '/materia/:id') {
      var m = D.materia(r.params.id);
      titulo(m ? m.nomeCronograma : 'Matéria', m ? K_area(m) : '');
    } else if (r.rota === '/assunto/:materia/:assunto') {
      var mm = D.materia(r.params.materia);
      var s = D.assunto(r.params.materia, r.params.assunto);
      titulo(s ? s.titulo : 'Assunto', mm ? mm.nomeCronograma : '');
    }

    // filtro de corporação: esconde o que o foco atual não cobre
    if (global.GMFiltroCorporacao) global.GMFiltroCorporacao.aplicar();

    // mapas mentais: as trilhas são medidas no DOM, então só dá para
    // desenhá-las depois que a tela entrou no documento
    if (global.GMDesenharMapasApos) global.GMDesenharMapasApos();

    // item de menu ativo

    // item de menu ativo
    U.qsa('.nav-item', el.nav).forEach(function (a) {
      var rota = a.getAttribute('data-rota');
      if (!rota) return;   // link externo (Material Específico) não é rota interna
      var alvo = rota;
      if (r.rota.indexOf('/:') > -1) {
        alvo = rota.split('/:')[0];
        var usado = r.rota.replace(/\/:.*$/, '');
        if (rota.split('/:')[0] !== usado) return;
      }
      a.classList.toggle('is-active',
        rota === r.path || alvo === r.path ||
        (r.rota.indexOf('/:') > -1 && rota.split('/:')[0] === r.path.split('/')[1] + '/' + r.path.split('/')[2]));
    });

    // progresso no topo
    atualizarProgressoTopo();

    // rolagem
    window.scrollTo(0, 0);
    fecharMenu();

    // esconde a busca ao trocar de tela se ela não fizer sentido
    el.busca.value = (r.rota === '/busca' && r.query.q) ? r.query.q : '';
  }

  function K_area(m) { return m.descricao; }

  function atualizarProgressoTopo() {
    if (!el.progresso) return;
    var g = P.geral();
    var pc = g.materias.pct;
    el.progresso.innerHTML =
      '<div class="topbar-progress__value">' + pc + '%</div>' +
      U.bar(0, 0, { semRotulo: true, size: 'sm' }).replace('width:0%', 'width:' + pc + '%');
  }

  /* =====================================================================
     AJUDA (tecla ?)
     ===================================================================== */
  function ajuda() {
    var itens = [
      ['/', 'Focar a busca'],
      ['?', 'Esta ajuda'],
      ['Esc', 'Fechar menus e diálogos'],
      ['M', 'Ir para Matérias'],
      ['N', 'Ir para Anotações'],
      ['B', 'Ir para a Busca'],
      ['Alt + ←', 'Voltar para a tela anterior']
    ];
    U.abrirModal(
      'Atalhos de teclado',
      '<div class="table-wrap"><table class="table table--compact"><tbody>' +
      itens.map(function (i) {
        return '<tr><td style="width:110px"><kbd class="kbd">' + esc(i[0]) + '</kbd></td>' +
          '<td>' + esc(i[1]) + '</td></tr>';
      }).join('') + '</tbody></table></div>',
      { largura: 460 }
    );
  }
  U.abrirAjuda = ajuda;

  /* =====================================================================
     BOOT
     ===================================================================== */
  function boot() {
    S.load();
    S.migrarRevisoesLegadas();
    U.aplicarPreferencias();
    montar();
    atualizarRodapeTema();
    registrarRotas();

    // seletor de foco (corporação) na barra superior
    if (global.GMFiltroCorporacao) global.GMFiltroCorporacao.init();
    document.addEventListener('gm:corporacao-change', function () {
      pintarNav();
      R.resolver(true);
    });

    // O roteador entrega a rota resolvida e a função que casa com ela.
    // Sem chamar `fn`, nenhuma tela é desenhada — só o enfeite de depois.
    R.start(function (rota, fn) {
      if (typeof fn === 'function') fn(rota);
      posRender();
    });

    // primeiro uso: mostra onde o progresso fica
    if (!localStorage.getItem('gm_aj_u_boas_vindas')) {
      try { localStorage.setItem('gm_aj_u_boas_vindas', new Date().toISOString()); } catch (e) {}
      setTimeout(function () {
        U.abrirModal('Bem-vindo às Carreiras Policiais',
          '<div class="prose">' +
          '<p>Este site reúne a teoria do núcleo comum das carreiras policiais ' +
          '(PRF, PM, PC, PF, Guarda Municipal e Polícia Penal), organizada por assunto.</p>' +
          '<p>Escolha o <strong>foco</strong> na barra superior para ver só as matérias ' +
          'cobradas pela sua corporação.</p>' +
          '<p><strong>Seu progresso fica no seu navegador</strong>, não em servidor nenhum. ' +
          'Nada será perdido ao recarregar a página — mas também não será compartilhado ' +
          'entre aparelhos. Em Configurações você pode exportar um arquivo de backup.</p>' +
          '<p>Comece pelas <a href="#/materias">Matérias</a>, ou abra o seu ' +
          '<a href="#/anotacoes">Bloco de anotações</a>. Pressione <kbd class="kbd">?</kbd> para ver ' +
          'os atalhos de teclado.</p>' +
          '</div>', { largura: 560 });
      }, 700);
    }

    // Inicializar Lucide Icons para componentes novos
    if (typeof lucide !== 'undefined') {
      try { lucide.createIcons(); } catch (e) {}
    }
    // KaTeX: renderizar fórmulas pendentes
    if (typeof katex !== 'undefined') {
      try {
        document.querySelectorAll('[data-katex]').forEach(function (el) {
          katex.render(el.textContent.trim(), el, { throwOnError: false, displayMode: el.dataset.katex === 'display' });
        });
      } catch (e) {}
    }
  }

  /* O carregador de tópicos é assíncrono: o boot só roda com a página
     montada E o índice de assuntos pronto (nucleo.js monta no mesmo evento). */
  var dom = document.readyState !== 'loading';
  var dados = global.GMTopicosPronto === true;
  function tentar() { if (dom && dados) boot(); }
  if (!dom) document.addEventListener('DOMContentLoaded', function () { dom = true; tentar(); });
  if (!dados) document.addEventListener('gm:topicos-prontos', function () { dados = true; tentar(); });
  tentar();

  global.GMApp = { menu: menu, ajuda: ajuda, fecharMenu: fecharMenu };

})(window);
