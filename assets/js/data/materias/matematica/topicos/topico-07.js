/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · matematica · TOPICO 7
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 7 de matematica.
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
        id: 'equacoes-segundo-grau',
        titulo: 'Equações do 2º Grau',
        ordem: 7,
        origem: 'teoria',
        blocos: [
          { tipo: 'conceito', conteudo: 'Incógnita ao quadrado: ax² + bx + c = 0, com a ≠ 0. Possui até duas raízes reais.' },
          { tipo: 'h2', conteudo: 'Bhaskara' },
          { tipo: 'texto', conteudo: 'x = (−b ± √Δ)/(2a), com Δ = b² − 4ac. Δ > 0: duas raízes reais distintas. Δ = 0: uma raiz (raízes iguais). Δ < 0: nenhuma raiz real. Exemplo: x² − 5x + 6 = 0 → Δ = 25 − 24 = 1 → x = (5 ± 1)/2 → x₁ = 3, x₂ = 2.' },
          { tipo: 'h2', conteudo: 'Relações de Girard' },
          { tipo: 'texto', conteudo: 'Soma das raízes: x₁ + x₂ = −b/a. Produto: x₁·x₂ = c/a. Útil quando a questão pede soma ou produto sem calcular as raízes.' },
          { tipo: 'dica', conteudo: 'Equações incompletas (b = 0 ou c = 0) têm atalho: fatore ou isole x².' }
        ]
      }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
