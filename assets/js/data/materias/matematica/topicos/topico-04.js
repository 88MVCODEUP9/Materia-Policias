/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · matematica · TOPICO 4
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 4 de matematica.
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
        id: 'mmc-mdc',
        titulo: 'MMC e MDC',
        ordem: 4,
        origem: 'teoria',
        blocos: [
          { tipo: 'conceito', conteudo: 'MMC e MDC resolvem problemas de múltiplos e divisores.' },
          { tipo: 'h2', conteudo: 'MMC' },
          { tipo: 'texto', conteudo: 'Menor número positivo divisível por todos os números dados. Usado em eventos simultâneos, ciclos e sincronização. Exemplo: MMC(6, 8) = 24. Método: decomposição em fatores primos, tomando cada fator com o maior expoente.' },
          { tipo: 'h2', conteudo: 'MDC' },
          { tipo: 'texto', conteudo: 'Maior número que divide todos os números dados. Usado em divisão em partes iguais e simplificação. Exemplo: MDC(12, 18) = 6. Método: fator com o menor expoente presente em todos.' },
          { tipo: 'h2', conteudo: 'Relação entre MMC e MDC' },
          { tipo: 'texto', conteudo: 'Para dois números: MMC(a, b)·MDC(a, b) = a·b. Útil quando um dos dois já é conhecido.' },
          { tipo: 'atencao', conteudo: 'MMC é sempre ≥ aos números; MDC é sempre ≤. Se os números são primos entre si, MDC = 1 e MMC = produto.' }
        ]
      }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
