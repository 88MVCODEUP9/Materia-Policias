/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · matematica · TOPICO 3
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 3 de matematica.
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
        id: 'porcentagem',
        titulo: 'Porcentagem',
        ordem: 3,
        origem: 'teoria',
        blocos: [
          { tipo: 'conceito', conteudo: 'Porcentagem é uma razão de denominador 100: representa partes de um total. Símbolo: %.' },
          { tipo: 'h2', conteudo: 'Cálculo básico' },
          { tipo: 'texto', conteudo: 'x% de y = (x/100)·y. Exemplo: 15% de 200 = 0,15·200 = 30. Aumento: final = valor·(1 + taxa). Desconto: final = valor·(1 − taxa). 20% de aumento sobre 100 dá 100·1,20 = 120.' },
          { tipo: 'h2', conteudo: 'Aumento e desconto sucessivos' },
          { tipo: 'texto', conteudo: 'Não some as taxas: aplique uma após a outra. Aumento de 10% seguido de 20% = valor·1,10·1,20 = valor·1,32, ou seja 32% (não 30%). Desconto de 20% seguido de 10% = valor·0,80·0,90 = valor·0,72, ou seja 28% de desconto.' },
          { tipo: 'dica', conteudo: 'Para saber que porcentagem A representa de B: (A/B)·100. Variação percentual: [(final − inicial)/inicial]·100.' }
        ]
      }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
