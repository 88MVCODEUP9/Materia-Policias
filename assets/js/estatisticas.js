/* Contagem automática do acervo.
   Planilha-fonte: dados/manifesto.json, gerado pelo gerar-manifesto.py
   (escaneia assets/js/data/materias a cada inicialização do site).
   Plano B: se o manifesto não estiver disponível (aberto pelo disco, sem servidor),
   conta pelo catálogo da própria página. */
(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const primeiroNumero = texto => {
    const achou = String(texto ?? '').match(/\d+/);
    return achou ? Number(achou[0]) : 0;
  };

  // Contagem reserva, extraída dos cards de disciplina já escritos no HTML.
  const disciplinasReserva = [...document.querySelectorAll('.discipline-card')].map(el => ({
    id: el.dataset.discipline,
    assuntos: primeiroNumero(el.querySelector('.discipline-bottom')?.textContent),
  }));

  function aplicar(totalAssuntos, listaDisciplinas) {
    const elAssuntos = $('stat-assuntos');
    const elDisciplinas = $('stat-disciplinas');
    if (elAssuntos) elAssuntos.textContent = totalAssuntos;
    if (elDisciplinas) elDisciplinas.textContent = listaDisciplinas.length;

    const porId = new Map(listaDisciplinas.map(d => [d.id, d.assuntos]));
    document.querySelectorAll('[data-discipline]').forEach(el => {
      const n = porId.get(el.dataset.discipline);
      if (n == null) return;
      const qtd = el.querySelector('.qtd');
      if (qtd) qtd.textContent = `${n} assuntos`;
      const rodape = el.querySelector('.discipline-bottom');
      if (rodape) rodape.textContent = `${n} assuntos →`;
      const nome = el.dataset.nome;
      if (nome && el.classList.contains('livro3d')) {
        el.setAttribute('aria-label', `${nome}, ${n} assuntos`);
      }
    });

    const titulo = $('materials-title');
    if (titulo) titulo.textContent = `Todos os ${totalAssuntos} assuntos`;
  }

  // Plano B imediato, para a página não ficar congelada se o fetch falhar.
  const totalReserva = disciplinasReserva.reduce((soma, d) => soma + d.assuntos, 0);
  if (disciplinasReserva.length) {
    aplicar(totalReserva, disciplinasReserva);
  }

  // Plano A: manifesto real gerado do sistema de arquivos.
  fetch('dados/manifesto.json', { cache: 'no-store' })
    .then(resposta => (resposta.ok ? resposta.json() : null))
    .then(manifesto => {
      if (manifesto && Array.isArray(manifesto.disciplinas)) {
        aplicar(manifesto.total_assuntos, manifesto.disciplinas);
      }
    })
    .catch(() => { /* Sem servidor ou manifesto ausente: vale a contagem reserva. */ });
})();
