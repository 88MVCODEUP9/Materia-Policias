/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · matematica · TOPICO 11
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 11 de matematica.
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
        id: 'estatistica-basica',
        titulo: 'Estatística Básica',
        ordem: 11,
        origem: 'teoria',
        blocos: [
          { tipo: 'conceito', conteudo: 'Estatística organiza e resume dados. As medidas de tendência central indicam o valor típico de um conjunto.' },
          { tipo: 'h2', conteudo: 'Média aritmética' },
          { tipo: 'texto', conteudo: 'Média = soma dos valores / quantidade de valores. É sensível a valores extremos. Exemplo: notas 5, 7, 8 e 10 → média = 30/4 = 7,5.' },
          { tipo: 'h2', conteudo: 'Mediana e moda' },
          { tipo: 'texto', conteudo: 'Mediana é o valor central dos dados ordenados: o elemento do meio quando a quantidade é ímpar, a média dos dois centrais quando é par. Menos sensível a extremos que a média. Exemplo: 3, 5, 7, 9, 11 → mediana = 7. Moda é o valor mais frequente; pode haver mais de uma ou nenhuma.' },
          { tipo: 'dica', conteudo: 'Em distribuição simétrica, média ≈ mediana ≈ moda. Em assimétrica, divergem.' }
        ]
      }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
