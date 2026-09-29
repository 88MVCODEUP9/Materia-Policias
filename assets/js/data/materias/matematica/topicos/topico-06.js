/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · matematica · TOPICO 6
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 6 de matematica.
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
        id: 'equacoes-primeiro-grau',
        titulo: 'Equações do 1º Grau',
        ordem: 6,
        origem: 'teoria',
        blocos: [
          { tipo: 'conceito', conteudo: 'Incógnita elevada à potência 1. Forma geral ax + b = 0, com a ≠ 0.' },
          { tipo: 'h2', conteudo: 'Resolução' },
          { tipo: 'texto', conteudo: 'Isole a incógnita aplicando operações inversas nos dois membros. Exemplo: 3x + 5 = 20 → 3x = 15 → x = 5. Opere igualmente nos dois membros para manter a igualdade.' },
          { tipo: 'h2', conteudo: 'Sistemas de equações' },
          { tipo: 'texto', conteudo: 'Duas ou mais equações com duas ou mais incógnitas. Métodos: substituição, adição (soma as equações para eliminar a variável) e comparação. Exemplo: {x + y = 10; x − y = 4}; somando, 2x = 14 → x = 7 e y = 3.' },
          { tipo: 'atencao', conteudo: 'Ao passar um termo de um membro para o outro, troque o sinal da operação.' }
        ]
      }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
