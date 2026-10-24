/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · NÚCLEO DE DADOS
   --------------------------------------------------------------------------
   Fonte única da hierarquia  Concurso → Área → Matéria → Assunto  e do
   índice de assuntos, derivada das pastas de tópico.

   Isto substitui concurso.js, corporacoes.js, assuntos.js e complementos.js:
   nada aqui lista matéria à mão. Pasta nova em materias/ vira matéria nova,
   .js novo em topicos/ vira assunto novo — o carregador entrega a lista e o
   índice é montado no evento `gm:topicos-prontos`.

   Ordem no index.html: este arquivo ANTES do carregar-topicos.js, porque a
   parte síncrona (concurso, áreas, corporações) tem que existir quando os
   componentes lerem, e a parte montada no evento tem que ouvir antes dele.
   ========================================================================== */
(function (global) {
  'use strict';

  var D = global.GMData = global.GMData || {};
  var RAIZ = 'assets/js/data/materias';

  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 ]/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }

  /* =====================================================================
     1. PARTE SÍNCRONA — não depende das pastas
     ===================================================================== */

  D.concurso = {
    id: 'carreiras-policiais',
    nome: 'Carreiras Policiais',
    nomeCurto: 'Carreiras Policiais',
    orgao: 'Plataforma de estudo para carreiras policiais',
    banca: 'Plataforma de estudo',
    cidade: 'Brasil',
    uf: 'BR',
    edital: 'Núcleo comum das carreiras policiais',
    editalData: null,
    vigente: true,
    observacao: 'Plataforma genérica: o mesmo núcleo de matérias atende a ' +
      'Polícia Rodoviária Federal, Polícia Militar, Polícia Civil, Polícia ' +
      'Federal, Guarda Municipal e Polícia Penal. Escolha o foco na barra ' +
      'superior para ver só as matérias cobradas pela corporação.'
  };

  D.areas = [
    { id: 'comum', nome: 'Conhecimentos Comuns', tipo: 'comum',
      descricao: 'Conteúdo reutilizável em diversos concursos de guardas e polícias.' },
    { id: 'especifico', nome: 'Conhecimentos Específicos', tipo: 'especifico',
      descricao: 'Conteúdo de Direito, legislação extravagante e normas locais.' }
  ];
  D.areasPorId = D.areas.reduce(function (mapa, a) { mapa[a.id] = a; return mapa; }, {});

  D.bancosQuestoes = [];      /* o banco de questões saiu da plataforma */

  /* Foco (corporação). Sem campo `corpora` em lugar nenhum, toda matéria é
     coberta por toda corporação: o filtro existe e funciona, só não esconde
     nada. Se um dia voltar a existir corpora por matéria, é aqui que se lê. */
  var CORPORACOES = [
    { id: 'prf', sigla: 'PRF', nome: 'Polícia Rodoviária Federal' },
    { id: 'pf',  sigla: 'PF',  nome: 'Polícia Federal' },
    { id: 'pc',  sigla: 'PC',  nome: 'Polícia Civil' },
    { id: 'pm',  sigla: 'PM',  nome: 'Polícia Militar' },
    { id: 'gm',  sigla: 'GM',  nome: 'Guarda Municipal' },
    { id: 'pp',  sigla: 'PP',  nome: 'Polícia Penal' }
  ];
  var foco = null;

  global.GMCorporacoes = {
    lista: CORPORACOES,
    ativa: function () { return foco; },
    definir: function (id) {
      foco = id ? (CORPORACOES.filter(function (c) { return c.id === id; })[0] || null) : null;
    },
    cobre: function (materiaId) {
      return D.materiaCoberta(D.materia(materiaId), foco ? foco.id : null);
    }
  };

  /* =====================================================================
     2. MATÉRIAS — uma por pasta que tenha .js em topicos/
     ===================================================================== */

  D.materias = [];

  /* Nome do arquivo da cor no Design System. Só o desvio: o token não leva
     o id da pasta. O fallback var(--accent-2) cobre pasta sem token. */
  var TOKEN = {
    'atualidades': 'atual', 'direitos-humanos': 'humanos', 'informatica': 'info',
    'portugues': 'lingua', 'processo-penal': 'processo', 'raciocinio-logico': 'logica'
  };

  var NOMES = {
    'portugues': 'Língua Portuguesa', 'matematica': 'Matemática',
    'raciocinio-logico': 'Raciocínio Lógico', 'informatica': 'Informática',
    'direitos-humanos': 'Direitos Humanos', 'processo-penal': 'Processo Penal'
  };

  function nomeDe(id) {
    if (NOMES[id]) return NOMES[id];
    return id.split('-').map(function (p) { return p.charAt(0).toUpperCase() + p.slice(1); }).join(' ');
  }

  function montarMaterias(pastas) {
    D.materias = (pastas || []).map(function (p, i) {
      var id = p.id === 'guardas' ? 'guarda-programa' : p.id;
      var nome = nomeDe(id);
      var n = (p.arquivos || []).length;
      return {
        id: id,
        nome: nome,
        nomeCronograma: nome,
        area: 'comum',
        escopo: 'comum',
        cor: 'var(--d-' + (TOKEN[id] || id) + ', var(--accent-2))',
        icone: 'fas fa-book-open',
        ordem: i + 1,
        descricao: n ? 'Teoria de ' + nome + ' · ' + n + ' tópicos' : nome,
        edital: '',
        utilitaria: false,
        pasta: RAIZ + '/' + p.id,
        corpora: null
      };
    });
  }

  /* =====================================================================
     3. ÍNDICE DE ASSUNTOS — de GMData.conteudoTeoria
     ===================================================================== */

  var indice = {};      // materiaId -> [assunto]
  var porChave = {};    // "materiaId::assuntoId" -> assunto

  function normalizarBlocos(blocos) {
    (blocos || []).forEach(function (b) {
      if (!b) return;
      if (b.texto == null && typeof b.conteudo === 'string') b.texto = b.conteudo;
      if (typeof b.texto === 'string') b.texto = b.texto.replace(/\\n/g, '\n');
    });
    return blocos || [];
  }

  function montarIndice() {
    var vids = D.videoaulasComplementares || [];

    D.materias.forEach(function (m) {
      var lista = indice[m.id] = indice[m.id] || [];
      var mod = (D.conteudoTeoria || {})[m.id];
      var usados = {};

      (mod ? mod.assuntos : []).forEach(function (a, i) {
        if (!a || !a.id || usados[a.id]) return;
        usados[a.id] = true;
        var blocos = normalizarBlocos(a.blocos);
        var videos = vids.filter(function (v) {
          return v.materiaId === m.id && norm(v.titulo) === norm(a.titulo);
        }).map(function (v) {
          return { titulo: v.videoTitulo || v.titulo, canal: v.canal, url: v.url, tipo: 'video' };
        });

        var item = {
          id: a.id,
          materiaId: m.id,
          titulo: a.titulo,
          kicker: a.kicker || '',
          ordem: a.ordem == null ? (i + 1) * 10 : a.ordem,
          origem: a.origem || 'teoria',
          origemSecao: a.origemSecao || '',
          corpora: a.corpora || null,
          editalComplementar: !!a.editalComplementar,
          fonte: (mod && mod.fonteOriginal) || '',
          blocos: blocos,
          dias: [],
          videos: videos,
          questoes: 0,
          bancoId: null
        };
        item.semTeoria = !(blocos.length > 1);
        porChave[m.id + '::' + a.id] = item;
        lista.push(item);
      });

      lista.sort(function (a, b) {
        if (a.ordem !== b.ordem) return a.ordem - b.ordem;
        return a.titulo.localeCompare(b.titulo, 'pt-BR');
      });
    });
  }

  /* =====================================================================
     4. API
     ===================================================================== */

  D.materia = function (id) {
    return D.materias.filter(function (m) { return m.id === id; })[0] || null;
  };
  D.materiasDaArea = function (areaId) {
    return D.materias.filter(function (m) { return m.area === areaId; });
  };
  D.materiasDoEdital = function () {
    return D.materias.filter(function (m) { return !m.utilitaria; });
  };
  D.materiaCoberta = function (m, corporacaoId) {
    if (!m || !corporacaoId || corporacaoId === 'todas') return true;
    var c = m.corpora;
    if (!c || !c.length) return true;
    return c.indexOf('todas') > -1 || c.indexOf(corporacaoId) > -1;
  };
  D.materiasDaCorporacao = function (corporacaoId) {
    return D.materias.filter(function (m) { return D.materiaCoberta(m, corporacaoId); });
  };
  D.assuntoCoberto = function (a, corporacaoId) {
    if (!a || !corporacaoId || corporacaoId === 'todas') return true;
    var c = a.corpora;
    if (!c || !c.length) return true;
    return c.indexOf('todas') > -1 || c.indexOf(corporacaoId) > -1;
  };

  D.assuntos = function (materiaId) { return indice[materiaId] || []; };
  D.assuntosTodos = function () {
    var out = [];
    Object.keys(indice).forEach(function (mid) { out = out.concat(indice[mid]); });
    return out;
  };
  D.assunto = function (materiaId, assuntoId) {
    return porChave[materiaId + '::' + assuntoId] || null;
  };
  D.assuntosTemTeoria = function (a) { return !!(a && a.blocos && a.blocos.length > 1); };
  D.assuntosMetricas = function (materiaId) {
    var lista = D.assuntos(materiaId);
    return {
      total: lista.length,
      comTeoria: lista.filter(D.assuntosTemTeoria).length,
      comQuestoes: lista.filter(function (a) { return a.questoes > 0; }).length,
      semTeoria: lista.filter(function (a) { return !D.assuntosTemTeoria(a); }).length,
      questoes: lista.reduce(function (t, a) { return t + (a.questoes || 0); }, 0)
    };
  };
  D.similaridade = function (a, b) {
    var pa = norm(a).split(' ').filter(Boolean), pb = norm(b).split(' ').filter(Boolean);
    if (!pa.length || !pb.length) return 0;
    var comuns = pa.filter(function (p) { return pb.indexOf(p) > -1; }).length;
    return comuns / Math.max(pa.length, pb.length);
  };

  /* Resultado: { tipo:'assunto', mat, url, trecho } — o formato que a tela
     de busca espera. Título pesa mais que corpo; o trecho é o pedaço do
     texto onde o termo apareceu. */
  D.assuntosBuscar = function (q) {
    var t = norm(q);
    if (!t) return [];
    var out = [];
    D.assuntosTodos().forEach(function (a) {
      var titulo = norm(a.titulo);
      var trecho = null, achou = false;
      if (titulo.indexOf(t) > -1) { achou = true; }
      else {
        for (var i = 0; i < a.blocos.length && !achou; i++) {
          var txt = String(a.blocos[i].texto || a.blocos[i].html || '');
          var pos = norm(txt).indexOf(t);
          if (pos > -1) {
            achou = true;
            trecho = txt.substr(Math.max(0, pos - 40), 120).trim();
          }
        }
      }
      if (achou) out.push({
        tipo: 'assunto', mat: a,
        url: '#/assunto/' + a.materiaId + '/' + a.id, trecho: trecho
      });
    });
    return out.slice(0, 60);
  };

  /* =====================================================================
     5. LIGAÇÃO com o carregador de tópicos
     ===================================================================== */

  function aoProntos(ev) {
    montarMaterias(ev && ev.detail && ev.detail.materias);
    montarIndice();
    D.materiasProntas = true;
  }

  if (global.GMTopicosPronto === true) {
    aoProntos();
  } else {
    document.addEventListener('gm:topicos-prontos', aoProntos);
  }

})(window);
