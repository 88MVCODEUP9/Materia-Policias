/* Operações lógicas usadas pelo laboratório e verificadas em quatro combinações. */
function avaliarConectivos(a, b) {
  return {not: !a, and: a && b, or: a || b, xor: a !== b, implies: !a || b, iff: a === b, notand: !(a && b), notor: !(a || b), notimplies: a && !b, notiff: a !== b};
}


/* Um argumento é válido se nenhuma atribuição satisfaz as premissas e refuta a conclusão. */
function avaliarArgumentos(p, q) {
  const estruturas = {
    mp: (a, b) => [[!a || b, a], b],
    ac: (a, b) => [[!a || b, b], a],
    mt: (a, b) => [[!a || b, !b], !a],
    sd: (a, b) => [[a || b, !a], b]
  };
  const combinacoes = [[true, true], [true, false], [false, true], [false, false]];
  return Object.fromEntries(Object.entries(estruturas).map(([nome, avaliar]) => {
    const [premissas, conclusao] = avaliar(p, q);
    const valido = combinacoes.every(([a, b]) => {
      const [ps, c] = avaliar(a, b);
      return !ps.every(Boolean) || c;
    });
    return [nome, {premissas, conclusao, valido, contraexemplo: premissas.every(Boolean) && !conclusao}];
  }));
}

/* A marcação da aula é gerada na fonte. JavaScript cuida apenas das interações. */
(() => {
  'use strict';
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
  document.querySelectorAll('[data-logic-lab]').forEach(lab => {
    const p = lab.querySelector('[data-proposition="p"]');
    const q = lab.querySelector('[data-proposition="q"]');
    if (!p || !q) return;
    const update = () => {
      const a = p.value === 'true', b = q.value === 'true';
      const values = avaliarConectivos(a, b);
      for (const output of lab.querySelectorAll('[data-logic-result]')) {
        const result = values[output.dataset.logicResult];
        output.textContent = result ? 'V' : 'F';
        output.dataset.truth = String(result);
        output.setAttribute('aria-label', result ? 'Verdadeiro' : 'Falso');
      }
    };
    p.addEventListener('change', update); q.addEventListener('change', update); update();
  });
  document.querySelectorAll('[data-argument-lab]').forEach(lab => {
    const p = lab.querySelector('[data-proposition="p"]');
    const q = lab.querySelector('[data-proposition="q"]');
    const update = () => {
      const values = avaliarArgumentos(p.value === 'true', q.value === 'true');
      for (const card of lab.querySelectorAll('[data-argument]')) {
        const result = values[card.dataset.argument];
        const output = card.querySelector('[data-argument-valid]');
        card.dataset.valid = String(result.valido);
        card.dataset.counterexample = String(result.contraexemplo);
        output.textContent = result.valido ? 'V · Válido' : 'F · Inválido';
        card.querySelector('[data-argument-assignment]').textContent =
          `Nesta combinação: premissas ${result.premissas.map(x => x ? 'V' : 'F').join(' e ')}; conclusão ${result.conclusao ? 'V' : 'F'}.` +
          (result.contraexemplo ? ' Contraexemplo encontrado.' : '');
      }
    };
    p.addEventListener('change', update); q.addEventListener('change', update); update();
  });
  // Destaca os recursos de memorização presentes nos diferentes formatos do acervo.
  const memoryPattern = /bizu|mnem[oô]nic|macete|dica de (?:prova|memori)/i;
  for (const card of document.querySelectorAll('.prose .study-card, .bizu-box, .mnemonic-card, .mnemonic-box, .memory-aid')) {
    const label = card.dataset.studyLabel || card.querySelector(':scope > h3, :scope > .card-kicker')?.textContent || '';
    const kind = card.dataset.studyKind || '';
    if (card.matches('.bizu-box, .mnemonic-card, .mnemonic-box, .memory-aid') || ['bizu', 'mnemonico', 'resumo', 'dica', 'mapa-mental'].includes(kind) || memoryPattern.test(label)) {
      card.classList.add('memory-aid');
      const lines = card.querySelectorAll(':scope > p, :scope > ul > li, :scope > ol > li, :scope > .text-section > p, :scope > .text-section > ul > li, :scope > .text-section > ol > li');
      lines.forEach((line, i) => {
        line.classList.add('memory-line', `mnemonic-tone-${i % 8 + 1}`);
        const first = line.querySelector('strong');
        if (first && /^[A-ZÀ-Ú]$/u.test(first.textContent.trim())) first.classList.add('memory-letter');
      });
    }
  }
  for (const strong of document.querySelectorAll('.prose p > strong:first-child, .prose li > strong:first-child')) {
    if (memoryPattern.test(strong.textContent) && !strong.closest('.memory-aid')) strong.parentElement.classList.add('memory-inline');
  }
  for (const law of document.querySelectorAll('.leis-estudo')) {
    const input = law.querySelector('[data-lei-busca]');
    if (!input) continue;
    const devices = [...law.querySelectorAll('.lei-dispositivo')].map(el => ({el, text: normalize(el.textContent)}));
    const status = law.querySelector('[data-lei-resultados]');
    input.addEventListener('input', () => {
      const terms = normalize(input.value).split(' ').filter(Boolean);
      let count = 0;
      for (const {el, text} of devices) {
        el.hidden = !terms.every(term => text.includes(term));
        if (!el.hidden) count++;
      }
      law.querySelectorAll('.lei-preambulo').forEach(el => { el.hidden = terms.length > 0; });
      status.textContent = terms.length ? `${count} dispositivos encontrados.` : '';
    });
  }
  document.querySelectorAll('.prose .table-wrap').forEach(wrapper => {
    wrapper.querySelectorAll('td').forEach(cell => {
      const value = cell.textContent.trim().toUpperCase();
      if (['V', 'F', 'VERDADEIRO', 'FALSO'].includes(value)) cell.dataset.truth = ['V', 'VERDADEIRO'].includes(value) ? 'true' : 'false';
    });
  });
  const menu = document.querySelector('.mobile-menu');
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.textContent = open ? 'Fechar menu' : 'Abrir menu';
    document.querySelector('#sidebar')?.classList.toggle('open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      menu?.setAttribute('aria-expanded', 'false');
      if (menu) menu.textContent = 'Abrir menu';
      document.querySelector('#sidebar')?.classList.remove('open');
    }
  });
  const cards = [...document.querySelectorAll('.material')];
  const blocks = [...document.querySelectorAll('.content-block')];
  const buttons = [...document.querySelectorAll('.filter')];
  const search = document.querySelector('#busca');
  const discipline = document.querySelector('#disciplina');
  // Normaliza uma vez o catálogo, em vez de repetir por card a cada tecla.
  const cardIndex = cards.map(card => ({
    card,
    text: normalize(card.dataset.search || card.textContent),
    types: (card.dataset.types || card.dataset.type || '').split(/\s+/).filter(Boolean)
  }));
  const catalog = document.querySelector('.catalog-all');
  const directory = document.querySelector('.discipline-directory');
  const tocLinks = [...document.querySelectorAll('.toc a')];
  const guideLinks = [...document.querySelectorAll('.technical-guide a')];
  const params = new URLSearchParams(location.search);
  let type = params.get('tipo') || '';
  if (!buttons.some(button => button.dataset.type === type)) type = '';
  if (search) search.value = params.get('q') || '';
  if (discipline && [...discipline.options].some(option => option.value === params.get('disciplina'))) discipline.value = params.get('disciplina');
  function apply() {
    const query = normalize(search?.value);
    const terms = query.split(' ').filter(Boolean);
    const active = Boolean(query || type || discipline?.value);
    if (catalog && active) catalog.open = true;
    if (directory) directory.hidden = active;
    const reset = document.querySelector('#reset-filters');
    if (reset) reset.hidden = !query && !type && !discipline?.value;
    const subjectCards = cards.length > 0 && cards[0].dataset.kind === 'assunto';
    let count = 0;
    for (const {card, types, text} of cardIndex) {
      card.hidden = Boolean((type && !types.includes(type)) || (discipline?.value && card.dataset.discipline !== discipline.value) || !terms.every(term => text.includes(term)));
      if (card.dataset.kind === 'assunto' && card.dataset.href) {
        card.setAttribute('href', type ? `${card.dataset.href}?tipo=${encodeURIComponent(type)}` : card.dataset.href);
      }
      if (!card.hidden) count++;
    }
    for (const block of blocks) block.hidden = Boolean(type && block.dataset.type !== type);
    for (const link of guideLinks) {
      const target = document.getElementById(link.hash.slice(1));
      link.hidden = Boolean(target?.closest('.content-block')?.hidden);
    }
    for (const link of tocLinks) link.hidden = Boolean(type && link.dataset.type !== type);
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.type === type));
    const results = document.querySelector('#resultados');
    if (results) results.textContent = `${count} ${count === 1 ? (subjectCards ? 'assunto encontrado' : 'material encontrado') : (subjectCards ? 'assuntos encontrados' : 'materiais encontrados')}`;
    const empty = document.querySelector('#vazio');
    if (empty) empty.hidden = count > 0;
    const status = document.querySelector('#blocos-status');
    if (status) {
      const active = buttons.find(button => button.dataset.type === type);
      status.textContent = type && active ? `Mostrando só: ${active.textContent.trim()}. Selecione “Assunto completo” para ver tudo.` : '';
    }
    const next = new URL(location.href);
    for (const [key, value] of [['tipo', type], ['q', search?.value || ''], ['disciplina', discipline?.value || '']]) {
      if (value) next.searchParams.set(key, value); else next.searchParams.delete(key);
    }
    if (next.href !== location.href) {
      // Abrir o HTML pelo disco ou limitar o histórico não deve interromper a busca.
      try { history.replaceState(null, '', next); } catch { /* A filtragem local já foi aplicada. */ }
    }
  }
  document.querySelector('.directory-shortcut')?.addEventListener('click', () => {
    const catalog = document.querySelector('.catalog-all');
    if (catalog) catalog.open = true;
  });
  buttons.forEach(button => button.addEventListener('click', () => { type = button.dataset.type; apply(); }));
  search?.addEventListener('input', apply);
  discipline?.addEventListener('change', apply);
  for (const reset of document.querySelectorAll('#limpar, #reset-filters')) reset.addEventListener('click', () => {
    type = ''; if (search) search.value = ''; if (discipline) discipline.value = ''; apply(); search?.focus();
  });
  const progressSection = document.querySelector('#progresso');
  const progressGrid = document.querySelector('#progresso-materiais');
  const statStudied = document.querySelector('#stat-estudados');
  if (progressGrid && cards[0]?.dataset.kind === 'assunto') {
    const isStudied = key => {
      try { return localStorage.getItem('materia-policial:estudado:' + key) === 'true'; }
      catch { return false; }
    };
    const studied = []; let next = null;
    for (const card of cards) {
      if (isStudied(card.dataset.href)) studied.push(card);
      else if (!next) next = card;
    }
    if (statStudied) {
      statStudied.hidden = false;
      const value = statStudied.querySelector('strong');
      if (value) value.textContent = String(studied.length);
    }
    if (studied.length) {
      const add = (card, label, done) => {
        const copy = card.cloneNode(true);
        copy.classList.add('progress-card');
        copy.classList.toggle('done', done);
        copy.href = copy.dataset.href;
        const footer = copy.querySelector('.card-footer span');
        if (footer) footer.textContent = label;
        progressGrid.append(copy);
      };
      if (progressSection) progressSection.hidden = false;
      if (next) add(next, 'Continuar estudos', false);
      for (const card of studied) add(card, 'Estudado ✓', true);
    }
  }
  if (buttons.length) apply();
  const complete = document.querySelector('#concluir');
  const saveStatus = document.querySelector('#salvamento');
  if (complete) {
    const key = 'materia-policial:estudado:' + complete.dataset.key;
    const show = studied => {
      complete.setAttribute('aria-pressed', String(studied));
      complete.textContent = studied ? 'Estudado ✓ Desfazer' : 'Marcar como estudado';
      complete.classList.toggle('primary', studied);
    };
    try { show(localStorage.getItem(key) === 'true'); }
    catch { if (saveStatus) saveStatus.textContent = 'Este navegador não permite salvar o progresso.'; }
    complete.addEventListener('click', () => {
      const studied = complete.getAttribute('aria-pressed') !== 'true';
      try { localStorage.setItem(key, String(studied)); show(studied); if (saveStatus) saveStatus.textContent = 'Progresso salvo neste navegador.'; }
      catch { if (saveStatus) saveStatus.textContent = 'Não foi possível salvar. Confira as permissões do navegador.'; }
    });
  }
  document.querySelector('#imprimir')?.addEventListener('click', () => window.print());
  let printState;
  window.addEventListener('beforeprint', () => {
    if (printState) return;
    printState = [...document.querySelectorAll('details')].map(detail => [detail, detail.open]);
    printState.forEach(([detail]) => { detail.open = true; });
  });
  window.addEventListener('afterprint', () => {
    printState?.forEach(([detail, open]) => { detail.open = open; });
    printState = null;
  });
  document.querySelectorAll('.question').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const correct = new FormData(form).get('resposta') === form.dataset.correct;
    const output = form.querySelector('output');
    if (!output) return;
    output.textContent = correct ? 'Resposta correta.' : 'Resposta incorreta. Leia o comentário e tente de novo.';
    output.className = correct ? 'ok' : 'erro';
    const comment = form.querySelector('details');
    if (comment) comment.open = true;
  }));
})();
