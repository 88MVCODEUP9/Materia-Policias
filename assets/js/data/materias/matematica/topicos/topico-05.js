/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · matematica · TOPICO 5
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 5 de matematica.
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
        id: 'conjuntos-numericos',
        titulo: 'Conjuntos Numéricos',
        ordem: 5,
        origem: 'teoria',
        blocos: [
          { tipo: 'conceito', conteudo: 'Os números são agrupados em categorias com propriedades próprias.' },
          { tipo: 'h2', conteudo: 'Naturais (ℕ) e Inteiros (ℤ)' },
          { tipo: 'texto', conteudo: 'ℕ = {0, 1, 2, 3, ...} — números de contagem; alguns autores excluem o zero (ℕ*). ℤ = {..., −2, −1, 0, 1, 2, ...} — inclui os negativos. Ambos são fechados para adição e multiplicação, mas ℤ não é fechado para divisão (3 ÷ 2 não é inteiro).' },
          { tipo: 'h2', conteudo: 'Racionais (ℚ) e Reais (ℝ)' },
          { tipo: 'texto', conteudo: 'ℚ = {a/b | a, b ∈ ℤ, b ≠ 0}: frações e decimais finitos ou periódicos. Exemplo: 0,5 = 1/2. Irracionais têm decimal infinito não periódico (√2, π, e). ℝ é a união de racionais e irracionais — todos os pontos da reta numérica.' },
          { tipo: 'dica', conteudo: 'A inclusão é sempre nestas ordens: ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ.' }
        ]
      }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
