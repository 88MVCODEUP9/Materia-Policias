/* Operações lógicas usadas pelo laboratório e verificadas em quatro combinações. */
function avaliarConectivos(a, b) {
  return {not: !a, and: a && b, or: a || b, xor: a !== b, implies: !a || b, iff: a === b};
}

/* A marcação da aula é gerada na fonte. JavaScript cuida apenas das interações. */
(() => {
  'use strict';
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  document.querySelectorAll('[data-logic-lab]').forEach(lab => {
    const p = lab.querySelector('[data-proposition="p"]');
    const q = lab.querySelector('[data-proposition="q"]');
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
    document.querySelector('#sidebar').classList.toggle('open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      menu?.setAttribute('aria-expanded', 'false');
      if (menu) menu.textContent = 'Abrir menu';
      document.querySelector('#sidebar').classList.remove('open');
    }
  });
  const cards = [...document.querySelectorAll('.material')];
  const blocks = [...document.querySelectorAll('.content-block')];
  const buttons = [...document.querySelectorAll('.filter')];
  const search = document.querySelector('#busca');
  const discipline = document.querySelector('#disciplina');
  const params = new URLSearchParams(location.search);
  let type = params.get('tipo') || '';
  if (!buttons.some(button => button.dataset.type === type)) type = '';
  if (search) search.value = params.get('q') || '';
  if (discipline && [...discipline.options].some(option => option.value === params.get('disciplina'))) discipline.value = params.get('disciplina');
  function apply() {
    const query = normalize(search?.value || '').trim();
    const catalog = document.querySelector('.catalog-all');
    const directory = document.querySelector('.discipline-directory');
    const active = Boolean(query || type || discipline?.value);
    if (catalog && active) catalog.open = true;
    if (directory) directory.hidden = active;
    const reset = document.querySelector('#reset-filters');
    if (reset) reset.hidden = !query && !type && !discipline?.value;
    const subjectCards = cards.length > 0 && cards[0].dataset.kind === 'assunto';
    let count = 0;
    for (const card of cards) {
      const types = (card.dataset.types || card.dataset.type || '').split(/\s+/).filter(Boolean);
      card.hidden = Boolean((type && !types.includes(type)) || (discipline?.value && card.dataset.discipline !== discipline.value) || !normalize(card.dataset.search).includes(query));
      if (card.dataset.kind === 'assunto' && card.dataset.href) {
        card.setAttribute('href', type ? `${card.dataset.href}?tipo=${encodeURIComponent(type)}` : card.dataset.href);
      }
      if (!card.hidden) count++;
    }
    for (const block of blocks) block.hidden = Boolean(type && block.dataset.type !== type);
    for (const link of document.querySelectorAll('.technical-guide a')) {
      const target = document.getElementById(link.hash.slice(1));
      link.hidden = Boolean(target?.closest('.content-block')?.hidden);
    }
    for (const link of document.querySelectorAll('.toc a')) link.hidden = Boolean(type && link.dataset.type !== type);
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
    history.replaceState(null, '', next);
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
    let store; try { store = localStorage; } catch { store = null; }
    const studied = []; let next = null;
    for (const card of cards) {
      if (store?.getItem('materia-policial:estudado:' + card.dataset.href) === 'true') studied.push(card);
      else if (!next) next = card;
    }
    if (statStudied) {
      statStudied.hidden = false;
      statStudied.querySelector('strong').textContent = String(studied.length);
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
      progressSection.hidden = false;
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
    catch { saveStatus.textContent = 'Este navegador não permite salvar o progresso.'; }
    complete.addEventListener('click', () => {
      const studied = complete.getAttribute('aria-pressed') !== 'true';
      try { localStorage.setItem(key, String(studied)); show(studied); saveStatus.textContent = 'Progresso salvo neste navegador.'; }
      catch { saveStatus.textContent = 'Não foi possível salvar. Confira as permissões do navegador.'; }
    });
  }
  document.querySelector('#imprimir')?.addEventListener('click', () => window.print());
  let printState;
  window.addEventListener('beforeprint', () => {
    printState = [...document.querySelectorAll('details')].map(detail => [detail, detail.open]);
    printState.forEach(([detail]) => { detail.open = true; });
  });
  window.addEventListener('afterprint', () => { printState?.forEach(([detail, open]) => { detail.open = open; }); });
  document.querySelectorAll('.question').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const correct = new FormData(form).get('resposta') === form.dataset.correct;
    const output = form.querySelector('output');
    output.textContent = correct ? 'Resposta correta.' : 'Resposta incorreta. Leia o comentário e tente de novo.';
    output.className = correct ? 'ok' : 'erro';
    form.querySelector('details').open = true;
  }));
})();
