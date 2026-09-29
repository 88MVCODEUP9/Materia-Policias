/* CARREIRAS POLICIAIS — componentes.js
   Seções preservadas na ordem de dependência. Procure o título da seção para editar. */


/* ===== components/blocos.js ===== */
/* ==========================================================================
    CARREIRAS POLICIAIS · COMPONENTES · BLOCOS DE CONTEUDO
    Renderiza conteudo educacional estruturado a partir de dados.

    REGRA 45 — não depender de HTML manual. Cada assunto é uma lista de
    blocos { tipo, ... }. Este arquivo é o "renderizador" que transforma
    esses blocos nos mesmos componentes visuais em qualquer matéria.

    REGRA 13 — Texto normal = página normal. Card = conteúdo que necessita
    de destaque pedagógico. Blocos do tipo texto/p não viram cards.

     Tipos suportados:
       texto, p, h2, h3, h4, h5, ul, ol, tabela, definicao, definicoes,
       conceito, exemplo, exemploResolvido, observacao, dica, atencao,
       pegadinha, resumo, passos, formula, calc, comparacao, lei, artigo,
       figura, diagrama, fonte, referencia, questao, acordeao, destaque,
       secao, subsecao, lista, lei-seca, verificacao, tabela-comparativa,
       tabela-certo-errado, tabela-revisao, imagem, mapa-mental
     ========================================================================== */
(function (global) {
  'use strict';

  var U = global.GMUI;
  var esc = U.esc, escNl = U.escNl, icon = U.icon;

  /* ---------------------------------------------------------------------
     Helpers
     --------------------------------------------------------------------- */
  function inline(txt) {
    if (!txt) return '';
    return esc(txt)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|\s)_([^_]+)_/g, '$1<em>$2</em>')
      .replace(/`([^`]+)`/g, '<code class="t-mono">$1</code>')
      .replace(/\\\((.*?)\\\)/g, '<span class="katex-inline">$1</span>');
  }

  function renderLatex(str) {
    try {
      if (typeof katex !== 'undefined') {
        return katex.renderToString(str, { throwOnError: false, displayMode: false });
      }
    } catch (e) { /* fallback */ }
    return '<code class="t-mono">' + esc(str) + '</code>';
  }

  function renderLatexDisplay(str) {
    try {
      if (typeof katex !== 'undefined') {
        return katex.renderToString(str, { throwOnError: false, displayMode: true });
      }
    } catch (e) { /* fallback */ }
    return '<div class="formula"><code class="t-mono">' + esc(str) + '</code></div>';
  }

  /* Só trata como fórmula o que parece matemática. "R$ 100.000; serviços até
     R$ 50.000" cai entre dois $ e viraria KaTeX quebrado (e avisaria no
     console) se passasse direto. */
  function ehFormula(expr) {
    if (/\d\s*[.,]\d/.test(expr)) return false;
    if (/[áéíóúâêôãõçÁÉÍÓÚÂÊÔÃÕÇ]/.test(expr)) return false;
    if (/^[^\\^_={}<>]*\s\s+/.test(expr)) return false;
    return true;
  }

  /** Substitui $...$ por KaTeX; se não for fórmula, devolve o trecho intacto. */
  function fmtMath(str) {
    return String(str).replace(/\$([^$]+)\$/g, function (m, expr) {
      return ehFormula(expr.trim()) ? renderLatex(expr.trim()) : m;
    });
  }

  var SEMANTICA = {
    explicacao: {rotulo: 'Explicação', icone: 'fa-book-open'},
    exemplo: {rotulo: 'Exemplo', icone: 'fa-lightbulb'},
    certo: {rotulo: 'Certo', icone: 'fa-circle-check'},
    errado: {rotulo: 'Errado', icone: 'fa-circle-xmark'},
    bizu: {rotulo: 'Bizu', icone: 'fa-bolt'},
    atencao: {rotulo: 'Atenção', icone: 'fa-triangle-exclamation'},
    conceito: {rotulo: 'Conceito', icone: 'fa-lightbulb'},
    definicao: {rotulo: 'Definição', icone: 'fa-book'},
    /* As três de baixo já tinham cor no CSS (.study-block--*) e nunca eram
       emitidas: os rótulos existiam no acervo sem nenhum lugar cair. */
    lei: {rotulo: 'Legislação', icone: 'fa-gavel'},
    jurisprudencia: {rotulo: 'Jurisprudência', icone: 'fa-scale-balanced'},
    formula: {rotulo: 'Fórmula', icone: 'fa-calculator'}
  };

  /* A cor vem do RÓTULO do bloco, nunca do corpo do texto. Um card de
     "Atenção" que por acaso menciona "falso" no meio da explicação continua
     sendo Atenção — se a prosa decidisse a cor, 134 cards do acervo ficariam
     com a cor errada. */
  function categoria(rotulo) {
    var t = String(rotulo || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    if (/\b(errado|incorreto|falso|pegadinha|nao confunda)\b/.test(t)) return 'errado';
    if (/\b(certo|correto|verdadeiro)\b/.test(t)) return 'certo';
    if (/\b(atencao|alerta|importante|muito importante|cuidado)\b/.test(t)) return 'atencao';
    if (/\b(bizu|dica|macete|memoriz)\b/.test(t)) return 'bizu';
    if (/\b(exemplo|exemplos|exemplo pratico)\b/.test(t)) return 'exemplo';
    if (/\b(conceito|definicao|principio)\b/.test(t)) return 'conceito';
    if (/\b(legislacao|lei|norma|dispositivo)\b/.test(t)) return 'lei';
    if (/\b(jurisprudencia)\b/.test(t)) return 'jurisprudencia';
    if (/\b(formula|equacao|calculo)\b/.test(t)) return 'formula';
    return 'explicacao';
  }

  function studyBlockTag(tipo, rotuloCustom) {
    var spec = SEMANTICA[tipo] || SEMANTICA.explicacao;
    var rotulo = rotuloCustom || spec.rotulo;
    return '<span class="study-block__label"><i class="fas ' + spec.icone + '" aria-hidden="true"></i> ' + esc(rotulo) + '</span>';
  }

  /* ---------------------------------------------------------------------
     Texto simples — flui como prose NORMAL (sem card!)
     --------------------------------------------------------------------- */
  /** Negrito/itálico/código + LaTeX inline. */
  function fmt(str) {
    return fmtMath(inline(str));
  }

  /* Texto corrido: linhas vazias separam parágrafos, linhas com "- " ou
     "1." viram lista. Emoji no início de linha é enfeite, não conteúdo.
     Linhas consecutivas iniciando com "|" viram TABELA (markdown). */
  function textoProse(valor) {
    if (!valor) return '';
    var out = [], para = [], lista = null;

    function flushPara() {
      if (para.length) {
        var bruto = para.join(' ');
        var soTitulo = /^\*\*[^*]+\*\*:?$/.test(bruto.trim());
        out.push('<p' + (soTitulo ? ' class="txt-lead"' : '') + '>' + fmt(bruto) + '</p>');
      }
      para = [];
    }
    function flushLista() {
      if (!lista) return;
      out.push('<' + lista.tag + ' class="content-list">' +
        lista.itens.map(function (i) { return '<li>' + fmt(i) + '</li>'; }).join('') +
        '</' + lista.tag + '>');
      lista = null;
    }
    function novaLista(tag) {
      if (!lista || lista.tag !== tag) { flushLista(); lista = { tag: tag, itens: [] }; }
    }

    var linhas = String(valor).split('\n');
    for (var li = 0; li < linhas.length; li++) {
      var bruta = linhas[li];
      var t = bruta.trim().replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u, '');
      if (!t) { flushPara(); flushLista(); continue; }

      /* Tabela markdown: linha de células + linha separadora |---|---| */
      if (/^\|/.test(t) && li + 1 < linhas.length && ehSepTabela(linhas[li + 1])) {
        var corpo = [];
        var lj = li + 2;
        while (lj < linhas.length && /^\s*\|/.test(linhas[lj])) { corpo.push(linhas[lj]); lj++; }
        flushPara(); flushLista();
        out.push(tabelaMarkdown(t, corpo));
        li = lj - 1;
        continue;
      }

      var m;
      if ((m = t.match(/^[-*•]\s+(.*)$/))) { flushPara(); novaLista('ul'); lista.itens.push(m[1]); }
      else if ((m = t.match(/^\d+[.)]\s+(.*)$/))) { flushPara(); novaLista('ol'); lista.itens.push(m[1]); }
      else { flushLista(); para.push(t); }
    }
    flushPara(); flushLista();
    return out.join('');
  }

  /* Linha separadora de tabela markdown: |---|---|, | :--- | ---: |, --- | --- */
  function ehSepTabela(linha) {
    var t = String(linha || '').trim();
    return t.indexOf('-') > -1 && /^[\s|:-]+$/.test(t);
  }

  function celulasTabela(linha) {
    return String(linha).trim()
      .replace(/^\|/, '').replace(/\|$/, '')
      .split('|').map(function (c) { return c.trim(); });
  }

  /* Tabela markdown -> mesma moldura .content-table dos blocos "tabela" */
  function tabelaMarkdown(linhaCab, corpoLinhas) {
    var cab = celulasTabela(linhaCab);
    var thead = '<thead><tr>' + cab.map(function (c) {
      return '<th scope="col">' + fmtMath(inline(c)) + '</th>';
    }).join('') + '</tr></thead>';
    var tbody = '<tbody>' + corpoLinhas.map(function (linha) {
      var cs = celulasTabela(linha);
      return '<tr>' + cs.map(function (c, i) {
        return '<td data-label="' + esc(cab[i] || '') + '">' + fmtMath(inline(c)) + '</td>';
      }).join('') + '</tr>';
    }).join('') + '</tbody>';
    return '<div class="content-table"><div class="table-wrap">' +
      '<table class="table table--responsive">' + thead + tbody + '</table></div></div>';
  }

  /* ---------------------------------------------------------------------
     Fragmentos de texto com semântica — retorna array de {tipo, html}
     --------------------------------------------------------------------- */
  function fragmentosTexto(valor) {
    return String(valor || '').split(/\n+/).map(function (linha) {
      var t = linha.trim();
      if (!t) return null;
      var html = fmtMath(inline(t));
      return { tipo: 'explicacao', html: html };
    }).filter(Boolean);
  }

  /* ---------------------------------------------------------------------
     RENDERIZAÇÃO PRINCIPAL — hierarquia clara
     --------------------------------------------------------------------- */
  function render(b) {
    if (!b) return '';
    if (typeof b === 'string') return textoProse(b);
    if (b.html) return b.html;
    var fn = BLOCOS[b.tipo];
    if (!fn) {
      return b.texto ? textoProse(b.texto) : '';
    }
    try { return fn(b); }
    catch (e) {
      console.error('[blocos] erro no tipo', b.tipo, e);
      return '';
    }
  }

  /* ==========================================================================
     BLOCOS — cada tipo com renderização específica
     ========================================================================== */
  var BLOCOS = {

    /* ---- TEXTO FLUI COMO PROSE NORMAL (REGRA 13) ---- */
    texto: function (b) { return textoProse(b.texto); },
    p:     function (b) { return textoProse(b.texto); },

    /* ---- TÍTULOS — hierarquia clara ---- */
    h2: function (b) {
      return '<div class="content-section" id="' + esc(b.id || '') + '">' +
        '<div class="content-section__head">' +
          (b.num ? '<span class="content-section__num">' + esc(b.num) + '</span>' : '') +
          '<h2 class="content-section__title">' + esc(b.texto) + '</h2>' +
        '</div></div>';
    },
    h3: function (b) {
      return '<div class="content-subsection"' + (b.id ? ' id="' + esc(b.id) + '"' : '') + '>' +
        '<h3 class="content-subsection__title">' + esc(b.texto) + '</h3></div>';
    },
    h4: function (b) { return '<h4 class="c-h4">' + esc(b.texto) + '</h4>'; },
    h5: function (b) { return '<h5 class="c-h5">' + esc(b.texto) + '</h5>'; },

    /* ---- SECÇÃO/SUBSECÇÃO — nova hierarquia ---- */
    secao: function (b) {
      return '<section class="content-section">' +
        '<h2 class="content-section__title">' + esc(b.titulo || b.texto) + '</h2>' +
        (b.intro ? '<p class="content-text">' + inline(b.intro) + '</p>' : '') +
        '</section>';
    },
    subsecao: function (b) {
      return '<div class="content-subsection">' +
        '<h3 class="content-subsection__title">' + esc(b.titulo || b.texto) + '</h3>' +
        '</div>';
    },

    /* ---- LISTAS — bem estruturadas ---- */
    ul: function (b) {
      var itens = b.itens || [];
      var cls = b.estilo === 'alpha' ? 'content-list--alpha' :
                b.estilo === 'roman' ? 'content-list--roman' : 'content-list--simple';
      return '<ul class="content-list ' + cls + '">' + itens.map(function (i) {
        return '<li>' + (typeof i === 'string' ? inline(i) : render(i)) + '</li>';
      }).join('') + '</ul>';
    },
    ol: function (b) {
      return '<ol class="content-list content-list--roman">' + (b.itens || []).map(function (i) {
        return '<li>' + (typeof i === 'string' ? inline(i) : render(i)) + '</li>';
      }).join('') + '</ol>';
    },
    lista: function (b) { return BLOCOS.ul(b); },

    /* ---- TABELA — suporte completo ---- */
    tabela: function (b) {
      var colunas = b.colunas || [];
      var linhas = b.linhas || [];
      var variante = b.variante || '';
      var thead = colunas.length
        ? '<thead><tr>' + colunas.map(function (c) {
            return '<th scope="col">' + esc(c) + '</th>';
          }).join('') + '</tr></thead>'
        : '';
      var tbody = '<tbody>' + linhas.map(function (l) {
        return '<tr>' + l.map(function (c, i) {
          var cellHtml = '';
          if (typeof c === 'string') {
            // LaTeX inline em células de tabela
            cellHtml = fmtMath(inline(c));
          } else {
            cellHtml = c && c.html ? c.html : esc(c);
          }
          return '<td data-label="' + esc(colunas[i] || '') + '">' + cellHtml + '</td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody>';
      var cls = 'table' + (b.compacta ? ' table--compact' : '') +
                (variante ? ' content-table--' + variante : '') +
                (b.responsiva !== false ? ' table--responsive' : '');
      var caption = b.titulo ? '<caption>' + esc(b.titulo) + '</caption>' : '';
      var captionExtra = b.legenda ? '<div class="content-table__caption">' + esc(b.legenda) + '</div>' : '';
      return '<div class="content-table">' +
        '<div class="table-wrap">' +
          '<table class="' + cls + '">' + caption + thead + tbody + '</table>' +
        '</div>' + captionExtra + '</div>';
    },

    /* ---- COMPARAÇÃO — duas colunas ---- */
    comparacao: function (b) {
      var a = b.a || {}, c = b.b || {};
      var clsA = b.clsA || '';
      var clsB = b.clsB || '';
      function col(d, cor, clsExtra) {
        return '<div class="content-compare__col" style="--cmp-color:' + cor + ' ' + clsExtra + '">' +
          '<div class="content-compare__title">' + esc(d.titulo || '') + '</div>' +
          '<ul class="content-compare__list">' + (d.itens || []).map(function (i) {
            return '<li>' + (typeof i === 'string' ? inline(i) : render(i)) + '</li>';
          }).join('') + '</ul></div>';
      }
      return '<div class="content-compare">' +
        col(a, 'var(--accent-2)', clsA) + col(c, 'var(--danger-light)', clsB) + '</div>';
    },

    /* ---- CERTO E ERRADO — componente compacto ---- */
    verificacao: function (b) {
      var itens = b.itens || [];
      return '<div class="content-verify">' + itens.map(function (v) {
        var tipo = v.correto ? 'certo' : 'errado';
        var iconCls = v.correto ? 'fa-circle-check' : 'fa-circle-xmark';
        return '<div class="content-verify__item content-verify__item--' + tipo + '">' +
          '<span class="content-verify__icon content-verify__icon--' + tipo + '">' +
            '<i class="fas ' + iconCls + '"></i>' +
          '</span>' +
          '<span class="content-verify__text">' + inline(v.texto) + '</span>' +
        '</div>';
      }).join('') + '</div>';
    },

    certo: function (b) { return verificacao({ itens: [{texto: b.texto, correto: true}] }); },
    errado: function (b) { return verificacao({ itens: [{texto: b.texto, correto: false}] }); },

    /* ---- BLOCOS SEMANTICOS COM LINHA LATERAL (não card inteiro) ---- */
    definicao: function (b) { return studyBlock('definicao', b.texto, b.titulo); },
    conceito:   function (b) { return studyBlock('conceito', b.texto, b.titulo); },
    observacao: function (b) { return studyBlock('atencao', b.texto, b.titulo); },
    dica:       function (b) { return studyBlock('bizu', b.texto, b.titulo); },
    bizu:       function (b) { return studyBlock('bizu', b.texto, b.titulo); },
    atencao:    function (b) { return studyBlock('atencao', b.texto, b.titulo); },
    pegadinha:  function (b) { return studyBlock('errado', b.texto, b.titulo || 'Pegadinha'); },
    resumo:     function (b) { return studyBlock('explicacao', b.texto, b.titulo || 'Resumo'); },
    fonte:      function (b) { return studyBlock('atencao', b.texto, b.titulo || 'Fonte'); },

    /* ---- EXEMPLO ---- */
    exemplo: function (b) {
      var interno = '';
      if (b.enunciado) interno += '<div class="blk__ex"><strong>Enunciado:</strong> ' + inline(b.enunciado) + '</div>';
      if (b.passos && b.passos.length) interno += '<div class="steps">' + b.passos.map(function (it, i) {
        var txt = typeof it === 'string' ? it : (it.texto || '');
        return '<div class="step"><div class="step__body">' +
          '<span class="step__label">Passo ' + (i + 1) + '</span>' + inline(txt) + '</div></div>';
      }).join('') + '</div>';
      if (b.solucao) {
        interno += '<div class="blk__sol"><strong>Resolução:</strong> ' + inline(b.solucao) + '</div>';
      }
      if (!interno) interno = '<div class="blk__ex">' + inline(b.texto) + '</div>';
      return '<div class="study-block study-block--exemplo">' +
        studyBlockTag('exemplo') +
        '<div class="study-block__body">' + interno + '</div></div>';
    },
    exemploResolvido: function (b) { return BLOCOS.exemplo(b); },

    /* ---- PASSO A PASSO ---- */
    passos: function (b) {
      var rotulos = b.rotulos || ['Raciocínio', 'Cálculo', 'Resultado'];
      return '<div class="steps">' + (b.itens || []).map(function (it, i) {
        var txt = typeof it === 'string' ? it : (it.texto || '');
        var rot = typeof it === 'object' && it.rotulo ? it.rotulo : rotulos[Math.min(i, rotulos.length - 1)];
        return '<div class="step"><div class="step__body">' +
          '<span class="step__label">' + esc(rot) + '</span>' + inline(txt) + '</div></div>';
      }).join('') + '</div>';
    },

    /* ---- FÓRMULAS com KaTeX ---- */
    formula: function (b) {
      var texto = b.texto || b.formula || '';
      // Detecta se é LaTeX
      if (texto.match(/\\[a-zA-Z]+|\\\((.*?)\\\)/) || texto.match(/\\frac|\\sqrt|\\sum|\\int|\\lim|\\rightarrow|\\pm|\\times|\\div|\\approx|\\neq|\\geq|\\leq|\\infty|\\forall|\\exists/)) {
        var isDisplay = b.display !== false;
        return '<div class="formula formula--katex">' +
          renderLatexDisplay(texto) + '</div>';
      }
      return '<div class="formula">' + esc(texto) + '</div>';
    },
    calc: function (b) {
      var linhas = (b.linhas || []).map(function (l) {
        return '<div class="calc__line">' + escNl(l) + '</div>';
      }).join('');
      if (b.resultado) {
        linhas += '<div class="calc__line calc__result">' + escNl(b.resultado) + '</div>';
      }
      return '<div class="calc">' + linhas + '</div>';
    },

    /* ---- LEI SECA — componente dedicado ---- */
    'lei-seca': function (b) {
      var nome = b.nome || 'Norma';
      var artigos = b.artigos || [];
      return '<div class="lei-seca">' +
        '<div class="lei-seca__header">' +
          '<i class="fas fa-gavel lei-seca__header-icon"></i>' +
          '<span class="lei-seca__title">' + esc(nome) + '</span>' +
        '</div>' +
        '<div class="lei-seca__body">' +
          artigos.map(BLOCOS.artigo).join('') +
        '</div>' +
        (b.fonte ? '<div class="lei-seca__fonte">Fonte: ' + esc(b.fonte) + '</div>' : '') +
      '</div>';
    },

    /* ---- ARTIGO DE LEI ---- */
    artigo: function (b) {
      var out = '<div class="art" id="' + esc(b.id || '') + '">';
      if (b.num) out += '<div class="art__num"><i class="fas fa-gavel"></i> ' + esc(b.num) + '</div>';
      if (b.caput) out += '<div class="art__caput">' + inline(b.caput) + '</div>';
      (b.paragrafos || []).forEach(function (p, i) {
        out += '<div class="art__par"><strong>§ ' + (i + 1) + 'º</strong> ' + inline(p) + '</div>';
      });
      (b.incisos || []).forEach(function (inc, i) {
        var letra = inc.letra || roman(i + 1);
        out += '<div class="art__inc" data-label="' + esc(letra) + '">' + inline(inc.texto || inc) + '</div>';
        (inc.alineas || []).forEach(function (al, j) {
          out += '<div class="art__ali" data-label="' + esc(j === 0 ? 'a' : String.fromCharCode(98 + j)) + '">' + inline(al.texto || al) + '</div>';
        });
      });
      (b.notas || []).forEach(function (n) {
        out += '<div class="art__nota"><i class="fas fa-circle-info"></i> ' + inline(n) + '</div>';
      });
      return out + '</div>';
    },

    /* ---- IMAGEM / FIGURA ---- */
    figura: function (b) {
      var frameCls = 'content-figure__frame';
      if (b.centralizada) frameCls += ' content-figure__frame--centered';
      if (b.grande) frameCls += ' content-figure__frame--large';
      return '<figure class="content-figure" data-figure="' + esc(b.src) + '">' +
        '<div class="' + frameCls + '">' +
          '<img src="' + esc(b.src) + '" alt="' + esc(b.alt || '') + '" loading="lazy">' +
        '</div>' +
        (b.legenda ? '<figcaption class="content-figure__caption">' +
          (b.legenda ? '<strong>' + esc(b.legenda) + '</strong>' : '') +
          (b.fonte ? '<span class="content-figure__source">Fonte: ' + esc(b.fonte) + '</span>' : '') +
        '</figcaption>' : '') +
      '</figure>';
    },

    /* ---- DIAGRAMA / ESQUEMA ---- */
    diagrama: function (b) {
      return '<div class="content-diagram">' +
        (b.titulo ? '<div class="content-diagram__title">' + esc(b.titulo) + '</div>' : '') +
        (b.conteudo || '') + '</div>';
    },

    /* ---- DESTAQUE genérico — agora como study-block seletivo ---- */
    destaque: function (b) {
      /* Só o rótulo e o título decidem a cor; o texto do bloco nunca entra. */
      var tipo = categoria([b.rotulo, b.titulo].join(' '));
      var labelMap = { exemplo: 'Exemplo', certo: 'Certo',
        errado: 'Errado', bizu: 'Bizu', atencao: 'Atenção', conceito: 'Conceito',
        lei: SEMANTICA.lei.rotulo, jurisprudencia: SEMANTICA.jurisprudencia.rotulo,
        formula: SEMANTICA.formula.rotulo };
      /* No fallback (explicacao) o rótulo original é preservado: um card de
         "Importante" ou "Mapa mental" continua se chamando isso, só que
         agora pintado de azul em vez de renomeado para "Explicação". */
      var label = labelMap[tipo] || String(b.rotulo || b.titulo || '').trim() || 'Explicação';
      if (tipo === 'certo' || tipo === 'errado') {
        return BLOCOS.verificacao({ itens: [{texto: b.texto || b.titulo, correto: tipo === 'certo'}] });
      }
      if (tipo === 'exemplo') {
        return BLOCOS.exemplo({ texto: b.texto });
      }
      return studyBlock(tipo, b.texto, label);
    },

    /* ---- ACORDEÃO ---- */
    acordeao: function (b) {
      return U.acordeao(b.titulo, (b.conteudo || []).map(render).join(''), !!b.aberto);
    },

    /* ---- RESUMO DE ASSUNTO ---- */
    resumoAssunto: function (b) {
      return '<div class="study-block study-block--explicacao" style="--sb-color:var(--gold)">' +
        '<div class="study-block__label"><i class="fas fa-star"></i> ' + esc(b.titulo || 'Resumo') + '</div>' +
        '<div class="study-block__body"><ol>' + (b.itens || []).map(function (i) {
          return '<li>' + inline(i) + '</li>';
        }).join('') + '</ol></div></div>';
    },

    /* ---- MAPA MENTAL — a árvore vem do próprio bloco ---- */
    'mapa-mental': function (b) { return mapaMental(b); },
    'mapaMental': function (b) { return mapaMental(b); },
    mapa: function (b) { return mapaMental(b); }
  };

  /* ---------------------------------------------------------------------
     Study Block — bloco com linha lateral, NÃO card inteiro
     --------------------------------------------------------------------- */
  function studyBlock(tipo, texto, titulo) {
    var spec = SEMANTICA[tipo] || SEMANTICA.explicacao;
    var labelHtml = studyBlockTag(tipo, titulo);
    var bodyHtml = texto ? '<div class="study-block__body">' + inline(texto) + '</div>' : '';
    return '<div class="study-block study-block--' + tipo + '">' +
      '<span class="study-block__tag" aria-hidden="true"></span>' +
      labelHtml +
      bodyHtml +
    '</div>';
  }

  var BLOCOS_ICON = {
    definicao: 'fa-book', conceito: 'fa-lightbulb', observacao: 'fa-eye',
    dica: 'fa-lightbulb', atencao: 'fa-triangle-exclamation',
    pegadinha: 'fa-bug', resumo: 'fa-star', fonte: 'fa-book'
  };

  function roman(n) {
    var m = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],
             [50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']], s = '';
    for (var i = 0; i < m.length; i++) {
      while (n >= m[i][0]) { s += m[i][1]; n -= m[i][0]; }
    }
    return s;
  }

  function fonte(f) {
    if (!f) return '';
    if (typeof f === 'string') return esc(f);
    if (f.url) return '<a href="' + esc(f.url) + '" target="_blank" rel="noopener noreferrer">' + esc(f.nome) + '</a>';
    return esc(f.nome || '');
  }

  /* ---------------------------------------------------------------------
     MAPA MENTAL — a estrutura é declarada no dado, nunca adivinhada
     ---------------------------------------------------------------------
     O bloco traz a árvore inteira:

       { tipo: "mapa-mental",
         titulo: "Menagem",            // cabeçalho (opcional)
         raiz:   "Menagem",            // nó central (padrão: título do assunto)
         nota:   "texto do rodapé",    // opcional
         ramos:  [ "folha",
                   { titulo: "ramo", texto: "explicação", cor: 3,
                     filhos: [ "folha", { titulo: "x", texto: "…", filhos: [] } ] } ] }

     Atalho: o mesmo mapa pode ser pendurado no marcador antigo
     ("Mapa-mental – X"), em `mapa: { … }` — assim o bloco continua marcando
     a posição e a estrutura vem logo ao lado.

     Cada ramo pode ser:
       "texto"                          -> folha
       { texto, filhos: [...] }         -> ramo com sub-ramos
       { titulo, texto, filhos: [...] } -> rótulo + explicação + sub-ramos
       { itens: [...] }                 -> grupo sem título (os filhos sobem)
     `titulo` é o rótulo do nó; `texto`, quando existe sozinho, vira o rótulo.
     Níveis são livres; visualmente os sub-ramos ficam dentro do nó, e só
     o primeiro nível ganha trilha SVG, para o mapa não virar uma tira
     horizontal impossível de ler.
     --------------------------------------------------------------------- */
  var MM = {
    maxRamos: 24,       // ramos de 1º nível antes de truncar
    maxLinhas: 14       // linhas de sub-ramos por ramo antes de truncar
  };

  /* Aceita string, {titulo, texto} e {itens|filhos|nos|sub}: sempre devolve
     [{ titulo, texto, filhos: [...] }]. `titulo` é o rótulo do nó e `texto`
     a explicação curta que aparece abaixo dele; quando só existe `texto`,
     ele assume o rótulo (compatibilidade com ramos escritos no formato
     antigo). Grupo sem título sobe um nível. */
  function mmNormaliza(itens) {
    var fora = [];
    (Array.isArray(itens) ? itens : []).forEach(function (it) {
      if (it === null || it === undefined) return;
      if (typeof it === 'string') {
        var t = it.trim();
        if (t) fora.push({ titulo: t, texto: '', filhos: [], cor: 0 });
        return;
      }
      if (typeof it !== 'object') return;
      var filhos = mmNormaliza(it.filhos || it.itens || it.nos || it.sub || []);
      var titulo = String(it.titulo || it.rotulo || it.label || '').trim();
      var texto = String(it.texto || '').trim();
      if (!titulo) titulo = texto;
      if (texto === titulo) texto = '';
      if (!titulo) { fora = fora.concat(filhos); return; }   // grupo sem título
      fora.push({ titulo: titulo, texto: texto, filhos: filhos,
                  cor: parseInt(it.cor, 10) || 0 });
    });
    return fora;
  }

  /* Quantas linhas o sub-ramos ocupa (o li + os netos). Serve para medir a
     altura do nó e para saber quando truncar. */
  function mmLinhas(no) {
    var total = 0;
    (no.filhos || []).forEach(function (f) { total += 1 + mmLinhas(f); });
    return total;
  }

  function mmFilhos(no, orc) {
    if (!no.filhos || !no.filhos.length) return '';
    var html = '';
    no.filhos.forEach(function (f) {
      if (orc.restam < 1) { orc.cortados += 1 + mmLinhas(f); return; }
      orc.restam -= 1;
      html += '<li class="mapa-mental__filho">' +
        '<span class="mapa-mental__filho-txt">' + fmt(f.titulo) + '</span>' +
        (f.texto ? '<span class="mapa-mental__filho-desc">' + fmt(f.texto) + '</span>' : '') +
        mmFilhos(f, orc) + '</li>';
    });
    return '<ul class="mapa-mental__filhos">' + html + '</ul>' +
      (orc.cortados ? '<p class="mapa-mental__mais">+ ' + orc.cortados + ' itens</p>' : '');
  }

  function mapaMental(b, tituloAssunto) {
    var dados = (b && b.mapa) || b || {};
    var todos = mmNormaliza(dados.ramos || dados.itens || dados.nos || dados.branches);
    if (!todos.length) return '';

    var truncou = todos.length > MM.maxRamos;
    var ramos = todos.slice(0, MM.maxRamos);
    if (!truncou) truncou = ramos.some(function (r) { return mmLinhas(r) > MM.maxLinhas; });

    var titulo = String(dados.titulo || '').trim() || 'Mapa mental';
    var raiz = String(dados.raiz || dados.central || '').trim() || tituloAssunto || titulo;
    var nota = String(dados.nota || '').trim() ||
      'Passe o cursor em um ramo para destacar o caminho.';

    var detalhes = 0, nos = '';
    ramos.forEach(function (r, i) {
      var orc = { restam: MM.maxLinhas, cortados: 0 };
      var sub = mmFilhos(r, orc);
      detalhes += MM.maxLinhas - orc.restam - orc.cortados;
      var cor = r.cor
        ? 'var(--cor-' + (((r.cor - 1) % 16 + 16) % 16 + 1) + ')'
        : 'var(--cor-' + ((i % 16) + 1) + ')';
      nos += '<div class="mapa-mental__no" data-i="' + i +
        '" style="--i:' + i + ';--cor:' + cor + '">' +
        '<span class="mapa-mental__num">' + (i + 1) + '</span>' +
        '<div class="mapa-mental__corpo">' +
          '<span class="mapa-mental__txt">' + fmt(r.titulo) + '</span>' +
          (r.texto ? '<span class="mapa-mental__desc">' + fmt(r.texto) + '</span>' : '') +
          sub +
        '</div></div>';
    });

    return '<div class="mapa-mental">' +
      '<div class="mapa-mental__head">' +
        '<span class="mapa-mental__icon"><i class="fas fa-diagram-project" aria-hidden="true"></i></span>' +
        '<span class="mapa-mental__title">' + esc(titulo) + '</span>' +
        '<span class="mapa-mental__count">' + ramos.length + ' ramos' +
          (detalhes ? ' · ' + detalhes + ' itens' : '') + '</span>' +
      '</div>' +
      '<div class="mapa-mental__canvas">' +
        '<svg class="mapa-mental__svg" aria-hidden="true" focusable="false"></svg>' +
        '<div class="mapa-mental__root">' + esc(raiz) + '</div>' +
        '<div class="mapa-mental__nos">' + nos + '</div>' +
      '</div>' +
      '<div class="mapa-mental__foot"><i class="fas fa-circle-info" aria-hidden="true"></i> ' +
        esc(nota) + (truncou ? ' <em>(mapa com itens além do que cabe aqui)</em>' : '') + '</div>' +
    '</div>';
  }

  /* ---------------------------------------------------------------------
     Trilhas do mapa — medidas no DOM, porque a altura de cada nó depende
     de quantos sub-ramos ele tem e isso só o navegador sabe.

    offsetLeft/offsetTop são coordenadas de LAYOUT: a animação de entrada
     (scale/translate) e o hover não falseiam a medida, o
     getBoundingClientRect sim — e o desenho acontece logo no primeiro
     quadro, quando a animação ainda está no início.
     --------------------------------------------------------------------- */
  function mmOffset(el, base) {
    var x = 0, y = 0, alvo = el;
    while (alvo && alvo !== base) {
      x += alvo.offsetLeft;
      y += alvo.offsetTop;
      alvo = alvo.offsetParent;
    }
    return { x: x, y: y, w: el.offsetWidth, h: el.offsetHeight };
  }

  /* O canvas muda de tamanho por vários motivos que não passam por resize
     (fonte, preferência de tamanho de texto, conteúdo novo): observar o
     próprio canvas cobre todos sem adivinhar quando redesenhar. */
  var mmObservador = null;
  function observarCanvas(canvas) {
    if (canvas.__mmObservado) return;
    canvas.__mmObservado = 1;
    if (typeof ResizeObserver !== 'function') return;
    if (!mmObservador) {
      mmObservador = new ResizeObserver(function (entradas) {
        for (var i = 0; i < entradas.length; i++) {
          var mapa = entradas[i].target.closest && entradas[i].target.closest('.mapa-mental');
          if (mapa) desenharMapa(mapa);
        }
      });
    }
    mmObservador.observe(canvas);
  }

  function desenharMapa(mapa) {
    var canvas = mapa.querySelector('.mapa-mental__canvas');
    var svg = mapa.querySelector('.mapa-mental__svg');
    var raiz = mapa.querySelector('.mapa-mental__root');
    var lista = mapa.querySelector('.mapa-mental__nos');
    if (!canvas || !svg || !raiz || !lista) return;
    var nos = lista.querySelectorAll('.mapa-mental__no');
    if (!nos.length) return;

    observarCanvas(canvas);

    /* Em tela estreita o CSS troca o mapa por lista e esconde o SVG. */
    if (window.getComputedStyle(svg).display === 'none') { svg.innerHTML = ''; return; }

    /* O canvas não tem transform, então o rect dele é o espaço de layout:
       é ele que vira o viewBox 1:1, para o SVG não distorcer nada. */
    var cb = canvas.getBoundingClientRect();
    if (!cb.width || !cb.height) return;   // tela escondida: desenha na próxima
    var chave = Math.round(cb.width) + 'x' + Math.round(cb.height);
    if (mapa.__mmMedida === chave) return;   // nada mudou desde o último desenho
    mapa.__mmMedida = chave;

    svg.setAttribute('viewBox', '0 0 ' + cb.width + ' ' + cb.height);
    svg.setAttribute('width', Math.round(cb.width));
    svg.setAttribute('height', Math.round(cb.height));

    /* A raiz é centralizada na vertical com translateY(-50%), então o meio
       visual dela coincide com o topo do box de layout. */
    var rp = mmOffset(raiz, canvas);
    var x0 = rp.x + rp.w;
    var y0 = rp.y;

    var d = '';
    for (var i = 0; i < nos.length; i++) {
      var np = mmOffset(nos[i], canvas);
      var x1 = np.x;
      var y1 = np.y + np.h / 2;
      var curva = Math.max(24, (x1 - x0) * 0.5);
      d += '<path class="mapa-mental__path" data-i="' + nos[i].getAttribute('data-i') +
        '" style="--i:' + i + ';--cor:' + (nos[i].style.getPropertyValue('--cor') || 'var(--accent)') + '"' +
        ' d="M ' + x0 + ' ' + y0 +
        ' C ' + (x0 + curva) + ' ' + y0 + ', ' + (x1 - curva) + ' ' + y1 +
        ', ' + x1 + ' ' + y1 + '"/>';
    }
    svg.innerHTML = d;
  }

  function desenharMapas() {
    if (typeof document === 'undefined') return;
    var mapas = document.querySelectorAll('.mapa-mental');
    for (var i = 0; i < mapas.length; i++) desenharMapa(mapas[i]);
  }
  global.GMDesenharMapas = desenharMapas;

  function agendarMapas() {
    if (typeof requestAnimationFrame !== 'function') { desenharMapas(); return; }
    requestAnimationFrame(desenharMapas);
  }
  global.GMDesenharMapasApos = agendarMapas;

  /* Hover no ramo destaca o caminho correspondente (delegação única). */
  function ligarMapaMental() {
    if (typeof document === 'undefined' || document.__mmLigado) return;
    document.__mmLigado = 1;
    document.addEventListener('mouseover', function (e) {
      var no = e.target && e.target.closest ? e.target.closest('.mapa-mental__no') : null;
      if (!no || !no.closest) return;
      var i = no.getAttribute('data-i');
      var mapa = no.closest('.mapa-mental');
      var p = mapa && mapa.querySelector('.mapa-mental__path[data-i="' + i + '"]');
      if (p) { p.classList.add('is-ativa'); no.classList.add('is-ativo'); }
    });
    document.addEventListener('mouseout', function (e) {
      var no = e.target && e.target.closest ? e.target.closest('.mapa-mental__no') : null;
      if (!no || !no.closest) return;
      var i = no.getAttribute('data-i');
      var mapa = no.closest('.mapa-mental');
      var p = mapa && mapa.querySelector('.mapa-mental__path[data-i="' + i + '"]');
      if (p) { p.classList.remove('is-ativa'); no.classList.remove('is-ativo'); }
    });
    var redesenhar = function () {
      // o canvas não mudou de tamanho, mas o conteúdo pode ter mudado
      var mapas = document.querySelectorAll('.mapa-mental');
      for (var i = 0; i < mapas.length; i++) mapas[i].__mmMedida = '';
      desenharMapas();
    };
    window.addEventListener('resize', redesenhar);
    document.addEventListener('gm:corporacao-change', redesenhar);
    if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
      document.fonts.ready.then(redesenhar);
    }
  }

  /* ---------------------------------------------------------------------
     Render principal — agrupa texto consecutivo como prose
     --------------------------------------------------------------------- */
  function renderAll(blocos, tituloAssunto) {
    var lista = blocos || [], saida = '';
    var proseBuffer = [];
    var chaves = {};
    var pergunta = null;
    var vistas = {};   // parágrafos já emitidos — evita repetir rótulo/título/texto

    /* Rótulos que descrevem conteúdo comum: viram parágrafo, não card.
       Card fica para o que tem função pedagógica (bizu, atenção, exemplo...). */
    var PROSE_ROTULOS = {
      '': 1, conteudo: 1, conceito: 1, definicao: 1, resumo: 1,
      'visao geral': 1, analogia: 1, texto: 1, explicacao: 1, ideia: 1
    };

    function norm(s) {
      return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function flushProse() {
      if (!proseBuffer.length) return;
      var cards = [], atual = [], tam = 0;
      function fecha() {
        if (atual.length) {
          var soCabeca = atual.length === 1 && atual[0].indexOf('<p class="txt-lead"') === 0;
          cards.push('<div class="txt-card' + (soCabeca ? ' txt-card--cabeca' : '') + '">' + atual.join('') + '</div>');
        }
        atual = []; tam = 0;
      }
      proseBuffer.forEach(function (h) {
        var ehCabeca = h.indexOf('<p class="txt-lead"') === 0;
        var ehLista = h.indexOf('<ul') === 0 || h.indexOf('<ol') === 0;
        var comprimento = h.replace(/<[^>]+>/g, '').length;
        var soCabecaNoCard = atual.length === 1 && atual[0].indexOf('<p class="txt-lead"') === 0;
        // cabeça nova abre card novo (a menos que o card só tenha uma cabeça)
        if (ehCabeca && atual.length && !soCabecaNoCard) fecha();
        // card longo demais: fecha antes de um parágrafo (nunca separa lista do que a introduz)
        else if (!ehLista && !ehCabeca && tam > 1100 && !soCabecaNoCard) fecha();
        atual.push(h); tam += comprimento;
      });
      fecha();
      saida += cards.join('');
      proseBuffer = [];
    }

    for (var i = 0; i < lista.length;) {
      var item = lista[i];
      if (!item) { i++; continue; }

      // Os dados trazem cada bloco repetido várias vezes na mesma página
      // (3.487 de 7.404) — renderiza só a primeira ocorrência.
      var chave = typeof item === 'string' ? item : JSON.stringify(item);
      if (chaves[chave]) { i++; continue; }
      chaves[chave] = 1;

      var tipo = item.tipo;
      var html = null;

      if (tipo === 'mapa-mental' || tipo === 'mapaMental' || tipo === 'mapa') {
        /* O mapa é o que o dado declarar — nada é deduzido do assunto. */
        html = mapaMental(item, tituloAssunto);
        pergunta = null;
      } else if (tipo === 'texto' || tipo === 'p') {
        html = textoProse(item.texto);
        pergunta = null;
      } else if (tipo === 'ul' || tipo === 'ol' || tipo === 'lista') {
        html = render(item);
        pergunta = null;
      } else if (tipo === 'destaque') {
        var rotulo = norm(item.rotulo);
        var titulo = String(item.titulo || '').trim();
        if (!titulo && !String(item.rotulo || '').trim()) {
          if (/^Mapa-mental/.test(String(item.texto || '').trim())) {
            /* Marcador de mapa mental: marca a posição. A estrutura vem no
               bloco "mapa-mental" (ou em `mapa:` no próprio marcador). Sem
               estrutura declarada o marcador não renderiza nada — o aviso
               é no console, para o autor ver e o leitor não. */
            if (item.mapa) {
              html = mapaMental(item, tituloAssunto);
            } else {
              html = '';
              if (typeof console !== 'undefined' && console.warn) {
                console.warn('[mapa-mental] marcador "' + item.texto +
                  '" sem estrutura declarada — acrescente um bloco ' +
                  '{ tipo: "mapa-mental", ramos: [...] }');
              }
            }
            pergunta = null;
          } else {
            // Abertura de tópico (costuma ser a pergunta) — é texto, não card.
            html = item.texto ? '<p class="' + (String(item.texto).length <= 140 ? 'txt-lead' : 'txt-abertura') + '"><strong>' + fmt(item.texto) + '</strong></p>' : '';
            pergunta = item.texto;
          }
        } else if (PROSE_ROTULOS[rotulo]) {
          // Conteúdo comum: flui como parágrafo. O título sai quando ele só
          // repete a pergunta (ou o rótulo) logo acima — senão o texto duplica.
          var nt = norm(titulo);
          var repete = (pergunta && nt === norm(pergunta)) || (nt && vistas[nt]);
          html = textoProse((repete ? '' : '**' + titulo + ':** ') + (item.texto || ''));
          // Conceito/Definição ficam em painel violeta — cor própria, sem card.
          if (html && (rotulo === 'conceito' || rotulo === 'definicao')) {
            html = '<div class="texto-conceito" data-rotulo="' + (rotulo === 'definicao' ? 'Definição' : 'Conceito') + '">' + html + '</div>';
          }
          pergunta = null;
        } else {
          pergunta = null;
        }
      } else {
        pergunta = null;
      }

      if (html !== null) {
        // Mesmo parágrafo duas vezes na mesma página é repetição de material
        // (parágrafos curtos — rótulos — podem repetir com legitimidade).
        var plano = html ? norm(html.replace(/<[^>]+>/g, '')) : '';
        if (plano) {
          if (plano.length > 40 && vistas[plano]) { i++; continue; }
          vistas[plano] = 1;
        }
        if (html && html.indexOf('<div class="mapa-mental"') === 0) {
          /* O mapa é um bloco inteiro: não entra no card de prosa. */
          flushProse();
          saida += html;
        } else if (html && html.indexOf('<div class="texto-conceito"') === 0) {
          flushProse();
          saida += html;
        } else if (html) {
          proseBuffer.push(html);
        }
        i++;
      } else {
        flushProse();
        saida += render(item);
        i++;
      }
    }
    flushProse();
    return saida;
  }

  function legendaCores() {
    var itens = ['explicacao', 'conceito', 'exemplo', 'certo', 'errado', 'bizu', 'atencao'];
    return '<div class="study-legend" aria-label="Legenda de cores do material">' +
      '<span class="study-legend__title">Legenda</span>' + itens.map(function (tipo) {
        return '<span class="study-legend__item study-legend__item--' + tipo + '">' +
          '<i class="study-legend__dot" aria-hidden="true"></i>' + esc(SEMANTICA[tipo].rotulo) + '</span>';
      }).join('') + '</div>';
  }

  /* ---------------------------------------------------------------------
     Sumário automático
     --------------------------------------------------------------------- */
  function sumario(blocos, materiaId, assuntoId) {
    var heads = (blocos || []).filter(function (b) {
      return b && (b.tipo === 'h2' || b.tipo === 'h3');
    });
    if (heads.length < 2) return '';

    var slugs = {};
    var itens = heads.map(function (b, i) {
      var id = b.id || (materiaId + '-' + assuntoId + '-' + U.slug(b.texto));
      slugs[b.texto] = id;
      return '<a class="sumario__link" href="#' + esc(id) + '" data-sumario="' + esc(id) + '">' +
        (b.tipo === 'h3' ? '&nbsp;&nbsp;' : '') + esc(b.texto) + '</a>';
    });

    (blocos || []).forEach(function (b) {
      if (b && (b.tipo === 'h2' || b.tipo === 'h3') && !b.id) b.id = slugs[b.texto];
    });

    return '<nav class="sumario" aria-label="Sumário do assunto">' +
      '<div class="sumario__title">Nesta página</div>' +
      '<div class="sumario__list">' + itens.join('') + '</div></nav>';
  }

  global.GMBlocos = {
    render: render,
    renderAll: renderAll,
    legendaCores: legendaCores,
    sumario: sumario,
    inline: inline,
    BLOCOS: BLOCOS,
    renderLatex: renderLatex,
    renderLatexDisplay: renderLatexDisplay
  };

  ligarMapaMental();

  /* Inicializar KaTeX no carregamento */
  if (typeof katex !== 'undefined') {
    try {
      var mathEls = document.querySelectorAll('.katex-math');
      mathEls.forEach(function (el) {
        katex.render(el.textContent.trim(), el, { throwOnError: false });
      });
    } catch (e) {}
  }

})(window);


/* ===== components/uikit.js ===== */
/* ==========================================================================
   CARREIRAS POLICIAIS · COMPONENTES · UI
   --------------------------------------------------------------------------
   Componentes que mais de uma tela usa. Mantidos num arquivo só para que
   a regra 6 (um componente, um lugar) seja fácil de auditar:

     cabecalho de página, barra de progresso, cartão de matéria, cartão de
     assunto, cartão de vídeo, bloco de checklist, lista de questões,
     barra de ferramentas (busca + filtros), paginação e empty states.
   ========================================================================== */
(function (global) {
  'use strict';

  var U = global.GMUI, S = global.GMStore, D = global.GMData;
  var esc = U.esc, escNl = U.escNl, icon = U.icon;

  /* ---------------------------------------------------------------------
     Identidade da matéria: aplica a cor e a classe de matéria no elemento
     --------------------------------------------------------------------- */
  function comMat(el, materiaId) {
    var m = D.materia(materiaId);
    if (m) {
      el.style.setProperty('--mat', m.cor);
      el.classList.add('is-mat');
    }
    return el;
  }

  /** Atributo style inline com a cor da matéria (para HTML em string). */
  function matStyle(materiaId) {
    var m = D.materia(materiaId);
    return m ? ' style="--mat:' + m.cor + '"' : '';
  }

  function matClass(materiaId) {
    return D.materia(materiaId) ? ' is-mat' : '';
  }

  /** Cor própria do assunto. O passo 5 (primo de 16) pula os vizinhos
      diretos, então assuntos seguidos nunca caem na mesma cor. */
  function assuntoCor(a) {
    if (!a) return '';
    var lista = D.assuntos(a.materiaId) || [];
    var i = 0;
    for (var k = 0; k < lista.length; k++) { if (lista[k].id === a.id) { i = k; break; } }
    var mats = typeof D.materias === 'function' ? D.materias() : (D.materias || []);
    var mi = 0;
    for (var j = 0; j < mats.length; j++) { if (mats[j].id === a.materiaId) { mi = j; break; } }
    return 'var(--cor-' + (((i * 5 + mi) % 16) + 1) + ')';
  }

  /** Atributo style com a cor do assunto (para HTML em string). */
  function assuntoStyle(a) {
    var c = assuntoCor(a);
    return c ? ' style="--mat:' + c + '"' : '';
  }

  /* =====================================================================
     CABEÇALHO DE PÁGELA
     ===================================================================== */
  function pageHead(o) {
    return '<header class="page-head mat-accent' + (o.cor ? '" style="--mat:' + o.cor : '') + '">' +
      '<div class="page-head__main">' +
        (o.voltar ? '<a class="btn btn--ghost btn--sm" href="' + esc(o.voltar) + '" style="margin-bottom:var(--sp-3)">' +
          icon('fas fa-arrow-left') + ' Voltar</a>' : '') +
        (o.badge ? '<div class="row row-2 row-wrap" style="margin-bottom:var(--sp-2)">' +
          (Array.isArray(o.badge) ? o.badge : [o.badge]).map(function (b) {
            return '<span class="badge ' + (b.cls || 'badge--gold') + '">' + esc(b.txt || b) + '</span>';
          }).join('') + '</div>' : '') +
        '<h1 class="page-head__title">' + (o.icone ? icon(o.icone) + ' ' : '') + esc(o.titulo) + '</h1>' +
        (o.sub ? '<p class="page-head__desc">' + esc(o.sub) + '</p>' : '') +
        (o.meta ? '<div class="row row-3 row-wrap" style="margin-top:var(--sp-3)">' + o.meta + '</div>' : '') +
      '</div>' +
      (o.acoes ? '<div class="page-head__actions">' + o.acoes + '</div>' : '') +
      '</header>';
  }

  /* =====================================================================
     CARTÃO DE MATÉRIA
     ===================================================================== */
  function matCard(m, opts) {
    opts = opts || {};
    var mt = D.assuntosMetricas(m.id);
    var prog = global.GMProgresso ? GMProgresso.materia(m.id) : null;
    var p = prog ? prog.feitos : 0, tot = prog ? prog.total : mt.total;
    var pc = U.pct(p, tot);

    return '<a class="mat-card reveal' + matClass(m.id) + '" href="#/materia/' + esc(m.id) + '"' +
      ' data-materia-id="' + esc(m.id) + '"' +
      matStyle(m.id) + ' aria-label="' + esc(m.nome) + '">' +
      '<div class="mat-card__top">' +
        '<div class="mat-card__icon">' + icon(m.icone) + '</div>' +
        '<div style="min-width:0">' +
          '<div class="mat-card__area">' + esc(areaNome(m.area)) + '</div>' +
          '<h3 class="mat-card__title">' + esc(m.nome) + '</h3>' +
        '</div>' +
        (m.utilitaria ? '<span class="badge badge--neutral" style="margin-left:auto">auxiliar</span>' : '') +
      '</div>' +
      '<p class="mat-card__desc">' + esc(m.descricao) + '</p>' +
      U.bar(p, tot, { mat: true, label: 'Progresso', texto: p + ' de ' + tot + ' assuntos' }) +
      '<div class="mat-card__stats">' +
        '<span>' + icon('fas fa-book-open') + ' <b>' + mt.total + '</b> assuntos</span>' +
        '<span>' + icon('fas fa-layer-group') + ' <b>' + mt.comTeoria + '</b> com teoria</span>' +
        (mt.questoes ? '<span>' + icon('fas fa-list-check') + ' <b>' + mt.questoes + '</b> questões</span>' : '') +
      '</div>' +
      (pc === 100 ? '<span class="status status--concluido" style="align-self:flex-start">Concluída</span>' : '') +
      '</a>';
  }

  function areaNome(areaId) {
    var a = D.areasPorId[areaId];
    return a ? a.nome : '';
  }

  /* =====================================================================
     CARTÃO DE ASSUNTO
     ===================================================================== */
  function assuntoCard(a) {
    var st = global.GMProgresso ? GMProgresso.assunto(a.materiaId, a.id) : null;
    var etiquetas = [];
    if (a.origem.indexOf('teoria') > -1)     etiquetas.push('<span class="badge badge--mat">teoria</span>');
    if (a.questoes)                            etiquetas.push('<span class="badge badge--info">' + a.questoes + ' questões</span>');
    if (a.videos && a.videos.length)           etiquetas.push('<span class="badge badge--neutral">' + a.videos.length + ' vídeo' + U.plural(a.videos.length - 1, '', 's') + '</span>');
    if (a.dias && a.dias.length)               etiquetas.push('<span class="badge badge--gold">dia' + U.plural(a.dias.length - 1, '', 's') + ' ' + a.dias.join(', ') + '</span>');
    if (a.semTeoria)                           etiquetas.push('<span class="badge badge--warning">sem teoria</span>');

    var m = D.materia(a.materiaId);
    return '<a class="assunto-card reveal' + matClass(a.materiaId) + '" href="#/assunto/' +
      esc(a.materiaId) + '/' + esc(a.id) + '"' + assuntoStyle(a) + '>' +
      (m ? '<span class="mat-card__icon assunto-card__icon" aria-hidden="true">' +
           icon(m.icone) + '</span>' : '') +
      '<div class="assunto-card__body">' +
        (a.kicker ? '<div class="c-h5" style="margin:0 0 2px">' + esc(a.kicker) + '</div>' : '') +
        '<div class="assunto-card__title">' + esc(a.titulo) + '</div>' +
        '<div class="assunto-card__meta">' + etiquetas.join('') + '</div>' +
      '</div>' +
      (st && st.feito ? '<span class="status status--concluido">ok</span>' : '') +
      '<i class="fas fa-chevron-right assunto-card__arrow" aria-hidden="true"></i>' +
      '</a>';
  }

  /* =====================================================================
     CARTÃO DE VÍDEO
     ---------------------------------------------------------------------
     Playlists não têm thumbnail individual: nesse caso mostramos o ícone,
     corrigindo o link quebrado que existia no material antigo.
     ===================================================================== */
  function videoCard(v, opts) {
    opts = opts || {};
    var id = youtubeId(v.url);
    var capa = id
      ? 'https://img.youtube.com/vi/' + id + '/mqdefault.jpg'
      : null;
    var letra = (opts.letra || '');

    return '<a class="video' + (opts.mini ? ' video--mini' : '') + '" href="' + esc(v.url) + '" ' +
      'target="_blank" rel="noopener noreferrer" ' +
      (opts.cor ? ' style="--mat:' + opts.cor + '"' : matStyle(opts.materiaId)) + '>' +
      '<div class="video__thumb' + (capa ? '' : ' video__thumb--sem-capa') + '">' +
        (capa
          ? '<img src="' + esc(capa) + '" alt="" loading="lazy" referrerpolicy="no-referrer">' +
            '<span class="video__play">' + icon('fas fa-play') + '</span>'
          : '<span class="video__sem-capa">' + icon('fas fa-list-play') + '</span>') +
        (letra ? '<span class="video__letra">' + esc(letra) + '</span>' : '') +
      '</div>' +
      '<div class="video__body">' +
        '<div class="video__titulo">' + esc(v.titulo) + '</div>' +
        (v.canal ? '<div class="video__canal">' + icon('fas fa-youtube') + ' ' + esc(v.canal) + '</div>' : '') +
      '</div>' +
      '</a>';
  }

  /** Extrai o id do YouTube de watch?v=, youtu.be/ e /playlist?list= */
  function youtubeId(url) {
    if (!url) return null;
    var m = url.match(/[?&]v=([\w-]{6,})/);
    if (m) return m[1];
    m = url.match(/youtu\.be\/([\w-]{6,})/);
    if (m) return m[1];
    if (/\/embed\/([\w-]{6,})/.test(url)) return url.match(/\/embed\/([\w-]{6,})/)[1];
    return null;                              // playlist e links externos
  }

  function ehPlaylist(v) { return v.tipo === 'playlist' || /playlist/.test(v.url); }

  /* =====================================================================
     CHECKLIST — preserva as chaves do localStorage original
     ---------------------------------------------------------------------
     Regra 27: a chave continua sendo `${diaIdx}-${matIdx}` e o array
     continua sendo uma lista de booleanos, exatamente como antes.
     ===================================================================== */
  function checklistHTML(diaIdx, matIdx, itens, marcados) {
    var chave = diaIdx + '-' + matIdx;
    var s = S.get();
    var done = s.checklists[chave] || marcados || [];
    var feitos = done.filter(Boolean).length;

    return '<div class="checklist" data-checklist="' + chave + '">' +
      itens.map(function (t, i) {
        return '<label class="checklist__item' + (done[i] ? ' is-done' : '') + '">' +
          '<span class="check">' +
            '<input type="checkbox" data-ci="' + i + '"' + (done[i] ? ' checked' : '') + '>' +
            '<span class="checklist__text">' + esc(t) + '</span>' +
          '</span></label>';
      }).join('') +
      '</div>';
  }

  /* =====================================================================
     QUESTÃO — componente único em toda a plataforma (regra 23)
     ===================================================================== */
  var LETRAS = ['A', 'B', 'C', 'D', 'E', 'F'];

  function questaoHTML(q, opts) {
    opts = opts || {};
    var materiaId = opts.materiaId || '';
    var key = (materiaId + '#' + q.id);
    var resp = (S.get().questoes || {})[key] || {};
    var feita = resp.resposta !== undefined && resp.resposta !== null;
    var gab = q.gabarito;

    var alt = q.alternativas.map(function (a, i) {
      var cls = '';
      if (feita) {
        if (i === gab) cls = ' is-correct';
        else if (i === resp.resposta) cls = ' is-wrong';
      }
      return '<label class="q-opt' + cls + '">' +
        '<input type="radio" name="q_' + esc(opts.uid || q.id) + '" value="' + i + '"' +
        (resp.resposta === i ? ' checked' : '') +
        (feita ? ' disabled' : '') + ' data-q="' + esc(key) + '">' +
        '<span class="q-opt__letter">' + LETRAS[i] + '</span>' +
        '<span class="q-opt__text">' + esc(a) + '</span>' +
        '</label>';
    }).join('');

    var feedback = '';
    if (feita) {
      var ok = resp.resposta === gab;
      feedback = '<span class="q-feedback q-feedback--' + (ok ? 'ok' : 'no') + '">' +
        icon(ok ? 'fas fa-circle-check' : 'fas fa-circle-xmark') + ' ' +
        (ok ? 'Resposta correta' : 'Errado — gabarito ' + LETRAS[gab]) + '</span>';
    }

    return '<article class="q-card' + matClass(materiaId) + (feita ? ' is-answered' : '') + '"' +
      matStyle(materiaId) + ' data-qcard="' + esc(key) + '">' +
      '<header class="q-card__head">' +
        '<span class="q-card__num">' + LETRAS[opts.pos ? (opts.pos - 1) % 26 : 0] + '</span>' +
        (q.banca ? '<span class="badge badge--outline">' + esc(q.banca) + '</span>' : '') +
        '<span style="margin-left:auto;font-size:var(--fs-3xs);color:var(--text-faint)">Questão ' + esc(q.id) + '</span>' +
      '</header>' +
      '<div class="q-card__body">' +
        '<div class="q-card__enunciado">' + escNl(q.texto) + '</div>' +
        (q.pergunta ? '<div class="q-card__comando">' + esc(q.pergunta) + '</div>' : '') +
        '<div class="q-opts">' + alt + '</div>' +
      '</div>' +
      (q.comentario
        ? '<div class="q-comment">' + converterComentario(q.comentario) + '</div>'
        : '') +
      '<footer class="q-card__foot">' +
        (feita
          ? feedback
          : '<button class="btn btn--subtle btn--sm" data-verificar="' + esc(key) + '">' +
            icon('fas fa-check') + ' Verificar resposta</button>') +
        '<button class="btn btn--ghost btn--sm" data-reiniciar="' + esc(key) + '">' +
          icon('fas fa-rotate-left') + ' Refazer</button>' +
        '<span class="q-gabarito">Gabarito: ' + LETRAS[gab] + '</span>' +
      '</footer>' +
      '</article>';
  }

  /** O comentário vem como HTML. O material antigo marcava os macetes com
   *  `span.macete`; tools/normalizar-comentarios.py já converte o banco para
   *  o bloco do Design System, então este passo existe só como tolerância a
   *  conteúdo antigo que ainda venha no formato anterior. */
  function converterComentario(html) {
    return String(html)
      .replace(/<span class="macete">([\s\S]*?)<\/span>/gi,
               '<div class="blk blk--dica"><div class="blk__label">' +
               icon('fas fa-lightbulb') + ' Macete</div>$1</div>')
      .replace(/<span class="macete">/gi, '')
      .replace(/<\/span>/gi, '');
  }

  /* =====================================================================
     BARRA DE FERRAMENTAS (busca + filtros) — padrão único (regra 39)
     ===================================================================== */
  function toolbar(o) {
    o = o || {};
    return '<div class="toolbar">' +
      (o.busca === false ? '' :
        '<div class="toolbar__search">' +
          '<i class="fas fa-magnifying-glass toolbar__search-icon" aria-hidden="true"></i>' +
          '<input type="search" class="input" placeholder="' + esc(o.placeholder || 'Buscar…') +
          '" value="' + esc(o.termo || '') + '" data-busca aria-label="' +
          esc(o.rotuloBusca || 'Buscar') + '">' +
        '</div>') +
      '<div class="toolbar__group">' + (o.controles || '') + '</div>' +
      '<div class="toolbar__count" data-contagem>' + esc(o.contagem || '') + '</div>' +
      '</div>';
  }

  /** Chips de filtro por matéria, com contagem. */
  function chipsMateria(materiaId, ativo, extras) {
    var lista = D.materias.filter(function (m) {
      return !materiaId || m.id === materiaId;
    });
    var out = ['<button class="chip' + (!ativo ? ' is-active' : '') + '" data-f-mat="">' +
      icon('fas fa-grip') + ' Todas</button>'];
    lista.forEach(function (m) {
      var mt = D.assuntosMetricas(m.id);
      out.push('<button class="chip' + (ativo === m.id ? ' is-active' : '') + '" data-f-mat="' +
        esc(m.id) + '" style="--mat:' + m.cor + '">' +
        '<span class="chip__dot"></span>' + esc(m.nomeCronograma) +
        ' <span class="chip__count">' + mt.total + '</span></button>');
    });
    if (extras) out.push(extras);
    return out.join('');
  }

  /* =====================================================================
     PAGINAÇÃO
     ===================================================================== */
  function paginador(pagina, totalPaginas, id) {
    if (totalPaginas <= 1) return '';
    var btns = [];
    function b(p, txt, cur, dis) {
      return '<button class="pager__btn"' + (cur ? ' aria-current="page"' : '') +
        (dis ? ' disabled' : '') + ' data-page="' + p + '" data-pager="' + esc(id) + '">' +
        txt + '</button>';
    }
    btns.push(b(pagina - 1, icon('fas fa-chevron-left'), false, pagina <= 1));
    for (var i = 1; i <= totalPaginas; i++) {
      if (i === 1 || i === totalPaginas || Math.abs(i - pagina) <= 1) {
        btns.push(b(i, String(i), i === pagina, false));
      } else if (Math.abs(i - pagina) === 2) {
        btns.push('<span class="pager__info">…</span>');
      }
    }
    btns.push(b(pagina + 1, icon('fas fa-chevron-right'), false, pagina >= totalPaginas));
    return '<nav class="pager" aria-label="Paginação">' + btns.join('') + '</nav>';
  }

  /* =====================================================================
     ESTADO VAZIO com ação
     ===================================================================== */
  function vazio(icone, titulo, texto, href, rotulo) {
    return U.empty(icone, titulo, texto,
      href ? '<a class="btn btn--subtle" href="' + esc(href) + '">' + esc(rotulo || 'Ir') + '</a>' : '');
  }

  /* =====================================================================
     Exporta
     ===================================================================== */
  global.GMUIKit = {
    comMat: comMat, matStyle: matStyle, matClass: matClass, areaNome: areaNome,
    assuntoCor: assuntoCor, assuntoStyle: assuntoStyle,
    pageHead: pageHead, matCard: matCard, assuntoCard: assuntoCard,
    videoCard: videoCard, youtubeId: youtubeId, ehPlaylist: ehPlaylist,
    checklistHTML: checklistHTML,
    questaoHTML: questaoHTML, LETRAS: LETRAS, converterComentario: converterComentario,
    toolbar: toolbar, chipsMateria: chipsMateria,
    paginador: paginador, vazio: vazio
  };

})(window);


/* ===== components/anotacoes.js ===== */
/* ==========================================================================
   CARREIRAS POLICIAIS · COMPONENTES · ANOTAÇÕES PESSOAIS
   --------------------------------------------------------------------------
   Gerencia notas pessoais com rich text simples e suporte a imagens.
   
   Persistência: localStorage chave `policial_notas`
   Schema: { id, titulo, conteudo_html, data_criacao, data_modificacao }
   Imagens: Base64 (max 500KB) ou URL externa
   Backup: exportar/importar JSON
   ========================================================================== */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'policial_notas';
  var MAX_IMAGE_SIZE = 500 * 1024; // 500KB
  var QUOTA_WARNING = 0.8; // 80%

  /* ---------------------------------------------------------------------
     Helpers
     --------------------------------------------------------------------- */
  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function timestamp() {
    return new Date().toISOString();
  }

  function getStorageSize() {
    var data = localStorage.getItem(STORAGE_KEY);
    return data ? new Blob([data]).size : 0;
  }

  function getStorageQuota() {
    var size = getStorageSize();
    var quota = 5 * 1024 * 1024; // ~5MB localStorage limit
    return size / quota;
  }

  /* ---------------------------------------------------------------------
     CRUD Operations
     --------------------------------------------------------------------- */
  function loadNotas() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Erro ao carregar notas:', e);
      return [];
    }
  }

  function saveNotas(notas) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notas));
      checkQuota();
      return true;
    } catch (e) {
      console.error('Erro ao salvar notas:', e);
      alert('Erro ao salvar: ' + (e.name === 'QuotaExceededError' ? 'espaço insuficiente' : e.message));
      return false;
    }
  }

  function checkQuota() {
    var quota = getStorageQuota();
    if (quota >= QUOTA_WARNING) {
      console.warn('Quota localStorage em ' + Math.round(quota * 100) + '%');
      if (quota >= 0.95) {
        alert('Atenção: espaço quase cheio. Exporte backup e remova notas antigas.');
      }
    }
  }

  function criar(titulo, conteudo_html) {
    var notas = loadNotas();
    var nota = {
      id: uuid(),
      titulo: titulo || 'Nota sem título',
      conteudo_html: conteudo_html || '',
      data_criacao: timestamp(),
      data_modificacao: timestamp()
    };
    notas.unshift(nota);
    if (saveNotas(notas)) return nota;
    return null;
  }

  function atualizar(id, titulo, conteudo_html) {
    var notas = loadNotas();
    var idx = notas.findIndex(function (n) { return n.id === id; });
    if (idx === -1) return false;
    notas[idx].titulo = titulo;
    notas[idx].conteudo_html = conteudo_html;
    notas[idx].data_modificacao = timestamp();
    return saveNotas(notas);
  }

  function deletar(id) {
    var notas = loadNotas();
    var filtered = notas.filter(function (n) { return n.id !== id; });
    return saveNotas(filtered);
  }

  function obter(id) {
    var notas = loadNotas();
    return notas.find(function (n) { return n.id === id; });
  }

  /* ---------------------------------------------------------------------
     Imagens: upload → Base64
     --------------------------------------------------------------------- */
  function uploadImagem(file, callback) {
    if (file.size > MAX_IMAGE_SIZE) {
      callback({
        error: 'Imagem muito grande (max 500KB). Considere redimensionar.',
        size: file.size
      });
      return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      callback({ success: true, dataUrl: e.target.result });
    };
    reader.onerror = function () {
      callback({ error: 'Erro ao ler arquivo' });
    };
    reader.readAsDataURL(file);
  }

  /* ---------------------------------------------------------------------
     Sanitização — o backup importado é fronteira de confiança: um JSON
     externo pode trazer <script>, on* ou javascript:. Só passam tags de
     formatação e imagens (http/https/data:image).
     --------------------------------------------------------------------- */
  function sanitizarHtml(html) {
    var doc;
    try {
      doc = new DOMParser().parseFromString('<div>' + String(html || '') + '</div>', 'text/html');
    } catch (e) { return ''; }
    var PERIGOSAS = { script: 1, style: 1, iframe: 1, object: 1, embed: 1, form: 1,
                      input: 1, button: 1, link: 1, meta: 1, base: 1 };
    var els = doc.body.getElementsByTagName('*');
    var kill = [];
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (PERIGOSAS[el.tagName.toLowerCase()]) { kill.push(el); continue; }
      var attrs = el.attributes;
      for (var j = attrs.length - 1; j >= 0; j--) {
        var nome = attrs[j].name.toLowerCase();
        var valor = String(attrs[j].value || '');
        if (nome.indexOf('on') === 0) { el.removeAttribute(attrs[j].name); continue; }
        if ((nome === 'href' || nome === 'src') && /^\s*javascript:/i.test(valor)) {
          el.removeAttribute(attrs[j].name);
        }
      }
    }
    kill.forEach(function (el) { if (el.parentNode) el.parentNode.removeChild(el); });
    var box = doc.body.firstChild;
    return box ? box.innerHTML : '';
  }

  /* ---------------------------------------------------------------------
     Backup: exportar/importar JSON
     --------------------------------------------------------------------- */
  function exportarBackup() {
    var notas = loadNotas();
    /* Âncora anexada ao DOM: clique em nó solto não baixa no Firefox. */
    baixar('notas-backup-' + new Date().toISOString().slice(0, 10) + '.json',
      JSON.stringify(notas, null, 2), 'application/json');
  }

  function importarBackup(file, callback) {
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var notas = JSON.parse(e.target.result);
        if (!Array.isArray(notas)) throw new Error('Formato inválido');
        
        // Normaliza e sanitiza: o backup é fronteira de confiança
        var limpas = notas.map(function (n) {
          if (!n || typeof n !== 'object') throw new Error('Dados inválidos no backup');
          return {
            id: /^[A-Za-z0-9-]{1,64}$/.test(String(n.id || '')) ? String(n.id) : uuid(),
            titulo: String(n.titulo || '').slice(0, 200),
            conteudo_html: sanitizarHtml(n.conteudo_html),
            data_criacao: n.data_criacao || timestamp(),
            data_modificacao: n.data_modificacao || timestamp()
          };
        });

        // Mescla em vez de substituir: importar nunca apaga o que já existe
        // (deduplica por id). Backup vazio com notas existentes é recusado —
        // sinal de arquivo errado, e aceitar zeraria a coleção.
        var atuais = loadNotas();
        if (!limpas.length && atuais.length) {
          throw new Error('backup vazio — suas ' + atuais.length + ' nota(s) foram mantidas');
        }
        var tem = {};
        atuais.forEach(function (n) { tem[n.id] = true; });
        limpas.forEach(function (n) {
          if (!tem[n.id]) { tem[n.id] = true; atuais.push(n); }
        });
        atuais.sort(function (a, b) {
          return String(a.data_modificacao) < String(b.data_modificacao) ? 1 : -1;
        });

        if (saveNotas(atuais)) {
          callback({ success: true, count: limpas.length });
        } else {
          callback({ error: 'Erro ao salvar backup' });
        }
      } catch (err) {
        callback({ error: 'Backup inválido: ' + err.message });
      }
    };
    reader.onerror = function () {
      callback({ error: 'Erro ao ler arquivo' });
    };
    reader.readAsText(file);
  }

  /* ---------------------------------------------------------------------
     Markdown <-> HTML sem dependências

     O site roda em file:// com scripts clássicos: nada de CDN, EasyMDE,
     marked, mammoth ou PDF.js. Estes dois conversores cobrem o
     intercâmbio real (.md/.txt): títulos, listas, código, links, imagens,
     negrito/itálico. Entrada externa sempre passa pelo sanitizador.
     --------------------------------------------------------------------- */
  function escMd(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function urlSegura(u) {
    u = String(u || '').trim();
    if (/^https?:\/\//i.test(u)) return u;
    if (/^data:image\/[a-zA-Z0-9+.-]+;base64,/i.test(u)) return u;
    return '';
  }

  function mdInline(t) {
    t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, function (m, alt, src) {
      var u = urlSegura(src);
      return u ? '<img src="' + u + '" alt="' + alt + '" style="max-width:100%;height:auto;">' : alt;
    });
    t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, txt, href) {
      var u = urlSegura(href);
      return /^https?:\/\//i.test(u)
        ? '<a href="' + u + '" target="_blank" rel="noopener">' + txt + '</a>' : txt;
    });
    t = t.replace(/`([^`\n]+)`/g, '<code class="t-mono">$1</code>');
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    t = t.replace(/(^|\W)_([^_\n]+)_/g, '$1<em>$2</em>');
    t = t.replace(/(^|\W)\*([^*\n]+)\*/g, '$1<em>$2</em>');
    return t;
  }

  function markdownParaHtml(md) {
    var texto = String(md || '').replace(/\r\n?/g, '\n');
    var blocos = [];
    texto = texto.replace(/```[a-zA-Z0-9+-]*\n([\s\S]*?)(?:```|$)/g, function (m, code) {
      blocos.push(code.replace(/\n$/, ''));
      return '\u0000' + (blocos.length - 1) + '\u0000';
    });
    var html = '', para = [], lista = null;
    function fechaPara() { if (para.length) { html += '<p>' + para.join('<br>') + '</p>'; para = []; } }
    function fechaLista() { if (lista) { html += '</' + lista + '>'; lista = null; } }
    texto.split('\n').forEach(function (linha) {
      var t = linha.trim(), l = escMd(linha), h, liU, liO, tipo;
      var mc = /^\u0000(\d+)\u0000$/.exec(t);
      if (mc) { fechaPara(); fechaLista(); html += '<pre><code class="t-mono">' + escMd(blocos[+mc[1]]) + '</code></pre>'; return; }
      if (!t) { fechaPara(); fechaLista(); return; }
      h = /^(#{1,3})\s+(.*)$/.exec(t);
      if (h) { fechaPara(); fechaLista(); html += '<h' + h[1].length + '>' + mdInline(escMd(h[2])) + '</h' + h[1].length + '>'; return; }
      if (/^(-{3,}|\*{3,})$/.test(t)) { fechaPara(); fechaLista(); html += '<hr>'; return; }
      if (/^&gt;\s?/.test(l)) { fechaPara(); fechaLista(); html += '<blockquote>' + mdInline(l.replace(/^&gt;\s?/, '')) + '</blockquote>'; return; }
      liU = /^[-*]\s+(.*)$/.exec(t); liO = /^\d+[.)]\s+(.*)$/.exec(t);
      if (liU || liO) {
        fechaPara(); tipo = liU ? 'ul' : 'ol';
        if (lista !== tipo) { fechaLista(); lista = tipo; html += '<' + tipo + '>'; }
        html += '<li>' + mdInline(escMd(liU ? liU[1] : liO[1])) + '</li>';
        return;
      }
      fechaLista(); para.push(mdInline(l));
    });
    fechaPara(); fechaLista();
    return sanitizarHtml(html);
  }

  function htmlParaMarkdown(html) {
    var doc;
    try { doc = new DOMParser().parseFromString('<div>' + String(html || '') + '</div>', 'text/html'); }
    catch (e) { return ''; }
    var box = doc.body.firstChild;
    if (!box) return '';
    function txt(no) { return no.textContent || ''; }
    function filhos(no) { var s = ''; for (var i = 0; i < no.childNodes.length; i++) s += conv(no.childNodes[i]); return s; }
    function conv(no) {
      if (no.nodeType === 3) return no.nodeValue;
      if (no.nodeType !== 1) return '';
      var tag = no.tagName.toLowerCase(), s, i, li;
      if (tag === 'h1') return '# ' + txt(no).trim() + '\n\n';
      if (tag === 'h2') return '## ' + txt(no).trim() + '\n\n';
      if (tag === 'h3' || tag === 'h4') return '### ' + txt(no).trim() + '\n\n';
      if (tag === 'p' || tag === 'div') return filhos(no).replace(/\s+$/, '') + '\n\n';
      if (tag === 'br') return '\n';
      if (tag === 'hr') return '\n---\n\n';
      if (tag === 'strong' || tag === 'b') return '**' + txt(no) + '**';
      if (tag === 'em' || tag === 'i') return '*' + txt(no) + '*';
      if (tag === 'del' || tag === 's') return '~~' + txt(no) + '~~';
      if (tag === 'code') return '`' + txt(no) + '`';
      if (tag === 'pre') return '```\n' + txt(no).replace(/\n$/, '') + '\n```\n\n';
      if (tag === 'blockquote') return '> ' + txt(no).trim().replace(/\n/g, '\n> ') + '\n\n';
      if (tag === 'a') return '[' + txt(no) + '](' + (no.getAttribute('href') || '') + ')';
      if (tag === 'img') return '![' + (no.getAttribute('alt') || 'imagem') + '](' + (no.getAttribute('src') || '') + ')';
      if (tag === 'ul') return filhos(no) + '\n';
      if (tag === 'ol') {
        s = ''; i = 0;
        for (var k = 0; k < no.childNodes.length; k++) {
          li = no.childNodes[k];
          if (li.tagName && li.tagName.toLowerCase() === 'li') { i++; s += i + '. ' + txt(li).trim() + '\n'; }
        }
        return s + '\n';
      }
      if (tag === 'li') return '- ' + filhos(no).replace(/\s+$/, '') + '\n';
      return filhos(no);
    }
    var out = '';
    for (var j = 0; j < box.childNodes.length; j++) out += conv(box.childNodes[j]);
    out = out.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    return out ? out + '\n' : '';
  }

  /* ---------------------------------------------------------------------
     Exportar .md (intercâmbio) — o backup JSON sem perdas continua em
     exportarBackup/importarBackup.
     --------------------------------------------------------------------- */
  function slugArquivo(s) {
    return (String(s || 'nota').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'nota').slice(0, 60);
  }

  function baixar(nome, conteudo, tipo) {
    var blob = new Blob([conteudo], { type: tipo || 'text/markdown' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = nome;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(url); if (a.parentNode) a.parentNode.removeChild(a); }, 500);
  }

  function exportarMd(id) {
    var n = obter(id);
    if (!n) return false;
    baixar(slugArquivo(n.titulo) + '.md', '# ' + n.titulo + '\n\n' + htmlParaMarkdown(n.conteudo_html));
    return true;
  }

  function exportarTodosMd() {
    var notas = loadNotas();
    if (!notas.length) return 0;
    baixar('anotacoes-' + new Date().toISOString().slice(0, 10) + '.md',
      notas.map(function (n) { return '# ' + n.titulo + '\n\n' + htmlParaMarkdown(n.conteudo_html); }).join('\n---\n\n'));
    return notas.length;
  }

  /* ---------------------------------------------------------------------
     Importar arquivos: .md/.markdown/.txt viram nota (md→html); .json é
     o backup legado (substitui a coleção). .docx/.pdf ficam de fora de
     propósito: exigiriam Mammoth/PDF.js via CDN, que quebram o file://
     offline do projeto.
     --------------------------------------------------------------------- */
  function importarArquivos(files, callback) {
    var fila = [];
    for (var i = 0; i < (files || []).length; i++) fila.push(files[i]);
    var criadas = 0, erros = [];
    function prox() {
      if (!fila.length) { callback({ success: criadas > 0, count: criadas, errors: erros }); return; }
      var file = fila.shift();
      var nome = file.name || 'arquivo';
      var ext = (nome.split('.').pop() || '').toLowerCase();
      if (ext === 'json') {
        importarBackup(file, function (res) {
          if (res.success) criadas += res.count; else erros.push(nome + ': ' + res.error);
          prox();
        });
        return;
      }
      if (ext === 'md' || ext === 'markdown' || ext === 'txt') {
        var r = new FileReader();
        r.onload = function (e) {
          try {
            var t = nome.replace(/\.(md|markdown|txt)$/i, '') || 'Importada';
            if (criar(t, markdownParaHtml(e.target.result))) criadas++;
            else erros.push(nome + ': falha ao salvar');
          } catch (err) { erros.push(nome + ': ' + err.message); }
          prox();
        };
        r.onerror = function () { erros.push(nome + ': erro de leitura'); prox(); };
        r.readAsText(file);
        return;
      }
      erros.push(nome + ': formato não suportado — use .md, .txt ou .json' +
        (ext === 'docx' || ext === 'pdf' ? ' (Word/PDF precisam de bibliotecas externas)' : ''));
      prox();
    }
    prox();
  }

  /* ---------------------------------------------------------------------
     API Pública
     --------------------------------------------------------------------- */
  global.GMAnotacoes = {
    loadNotas: loadNotas,
    criar: criar,
    atualizar: atualizar,
    deletar: deletar,
    obter: obter,
    uploadImagem: uploadImagem,
    sanitizar: sanitizarHtml,
    exportarBackup: exportarBackup,
    importarBackup: importarBackup,
    htmlParaMarkdown: htmlParaMarkdown,
    markdownParaHtml: markdownParaHtml,
    exportarMd: exportarMd,
    exportarTodosMd: exportarTodosMd,
    importarArquivos: importarArquivos,
    getStorageSize: getStorageSize,
    getStorageQuota: getStorageQuota
  };

})(this);


/* ===== components/filtro-corporacao.js ===== */
/* ==========================================================================
   CARREIRAS POLICIAIS · COMPONENTES · FILTRO DE CORPORAÇÃO
   --------------------------------------------------------------------------
   Seletor "Foco" da barra superior. Um <select> nativo resolve o caso de uso
   real (uma corporação por vez, em mobile e desktop) e herda o tema sozinho.
   ========================================================================== */
(function (global) {
  'use strict';

  var C = global.GMCorporacoes;
  var selId = 'topbar-corporacao';

  /* ---------------------------------------------------------------------
     Monta o <select> dentro de .app-topbar
     --------------------------------------------------------------------- */
  function montar() {
    var top = global.document.querySelector('.app-topbar');
    if (!top || global.document.getElementById(selId)) return;

    var wrap = global.document.createElement('div');
    wrap.className = 'topbar-foco';

    var label = global.document.createElement('label');
    label.className = 'topbar-foco__label';
    label.setAttribute('for', selId);
    label.textContent = 'Foco';

    var sel = global.document.createElement('select');
    sel.id = selId;
    sel.className = 'topbar-foco__select';
    sel.title = 'Escolha a corporação para ver só as matérias cobradas por ela';

    var todas = global.document.createElement('option');
    todas.value = '';
    todas.textContent = 'Todas as carreiras';
    sel.appendChild(todas);

    C.lista.forEach(function (c) {
      var o = global.document.createElement('option');
      o.value = c.id;
      o.textContent = c.sigla + ' — ' + c.nome;
      sel.appendChild(o);
    });

    wrap.appendChild(label);
    wrap.appendChild(sel);
    top.insertBefore(wrap, top.querySelector('.spacer'));

    sel.addEventListener('change', function () {
      C.definir(sel.value || null);
      aplicar();
      notificar();
    });
  }

  /* ---------------------------------------------------------------------
     Aplica a visibilidade nas telas já renderizadas
     --------------------------------------------------------------------- */
  function aplicar() {
    var sel = global.document.getElementById(selId);
    if (sel) {
      var a = C.ativa();
      sel.value = a ? a.id : '';
    }

    global.document.querySelectorAll('[data-materia-id]').forEach(function (el) {
      var visivel = C.cobre(el.getAttribute('data-materia-id'));
      el.hidden = !visivel;
      el.classList.toggle('is-fora-do-foco', !visivel);
    });

    /* A grade de assuntos tambem depende do Foco, e nao e reposicionada
       por data-materia-id. Sem esta repintura, trocar o Foco com a tela de
       materia aberta deixaria a lista do edital errado na tela. */
    if (global.GMViews && global.GMViews.materias && global.GMViews.materias.repintar) {
      global.GMViews.materias.repintar();
    }
  }

  /* A casca escuta este evento para repintar menu e barra de progresso. */
  function notificar() {
    global.document.dispatchEvent(new global.CustomEvent('gm:corporacao-change', {
      detail: { corporacao: C.ativa() }
    }));
  }

  function init() {
    montar();
    aplicar();
  }

  global.GMFiltroCorporacao = { init: init, aplicar: aplicar };

})(window);
