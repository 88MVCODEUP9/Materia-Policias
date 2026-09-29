/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · matematica · TOPICO 12
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 12 de matematica.
   ========================================================================== */
(function (global) {
  'use strict';
  var D = global.GMData;
  D.conteudoTeoria = D.conteudoTeoria || {};
  var modulo = D.conteudoTeoria["matematica"] || (D.conteudoTeoria["matematica"] = { materiaId: "matematica", rotulo: "matematica", assuntos: [] });
  modulo.assuntos = modulo.assuntos || [];
  var existentes = Object.create(null);
  modulo.assuntos.forEach(function (a) { existentes[a.id] = true; });
  
  [
{
        id: 'probabilidade',
        titulo: 'Probabilidade',
        ordem: 12,
        origem: 'teoria',
        blocos: [
          { tipo: 'conceito', conteudo: 'Probabilidade mede a chance de um evento ocorrer, de 0 (impossível) a 1 (certo). P(A) = casos favoráveis / casos possíveis.' },
          { tipo: 'h2', conteudo: 'Probabilidade simples' },
          { tipo: 'texto', conteudo: 'Ao lançar um dado, P(sair 3) = 1/6 e P(sair número par) = 3/6 = 1/2. Espaço amostral: todos os resultados possíveis. Evento: um subconjunto do espaço amostral.' },
          { tipo: 'h2', conteudo: 'Eventos independentes e mutuamente exclusivos' },
          { tipo: 'texto', conteudo: 'Independentes: um não afeta o outro, então P(A e B) = P(A)·P(B). Exemplo: dois dados, P(ambos 6) = 1/6 · 1/6 = 1/36. Mutuamente exclusivos: não ocorrem juntos, então P(A ou B) = P(A) + P(B). Exemplo: um dado, P(sair 2 ou 5) = 1/6 + 1/6 = 1/3.' },
          { tipo: 'atencao', conteudo: 'Diferencie "e" (multiplica, eventos simultâneos) de "ou" (soma, eventos excludentes). Com reposição e sem reposição dão resultados diferentes.' }
        ]
      }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
