/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · raciocinio-logico · TOPICO 2
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 2 de raciocinio-logico.
   ========================================================================== */
(function (global) {
  'use strict';
  var D = global.GMData;
  D.conteudoTeoria = D.conteudoTeoria || {};
  var modulo = D.conteudoTeoria["raciocinio-logico"] || (D.conteudoTeoria["raciocinio-logico"] = { materiaId: "raciocinio-logico", rotulo: "raciocinio-logico", assuntos: [] });
  modulo.assuntos = modulo.assuntos || [];
  var existentes = Object.create(null);
  modulo.assuntos.forEach(function (a) { existentes[a.id] = true; });
  
  [
{
      "id": "equivalencias-e-negacoes",
      "titulo": "Equivalências e negações",
      "ordem": 2,
      "origem": "modulo-rlm",
      "origemSecao": "rlm-equivalencias",
      "blocos": [
        {
          "tipo": "h2",
          "texto": "Equivalências e negações"
        },
        {
          "tipo": "html",
          "html": "2. Equivalências e negações</h2>\n<div>\n<div class=\"blk blk--definicao\">\n<h3 class=\"c-h5\">Condicional</h3>\n<p class=\"symbol\">p → q ≡ ¬p ∨ q</p>\n<p class=\"symbol\">p → q ≡ ¬q → ¬p</p>\n<p>Contrapositiva: troca as proposições de lugar e nega as duas.</p>\n</div>\n<div class=\"blk blk--definicao\">\n<h3 class=\"c-h5\">Bicondicional</h3>\n<p class=\"symbol\">p ↔ q ≡ (p → q) ∧ (q → p)</p>\n<p class=\"symbol\">p ↔ q ≡ (p ∧ q) ∨ (¬p ∧ ¬q)</p>\n</div>\n<div class=\"blk blk--definicao\">\n<h3 class=\"c-h5\">Leis de De Morgan</h3>\n<p class=\"symbol\">¬(p ∧ q) ≡ ¬p ∨ ¬q</p>\n<p class=\"symbol\">¬(p ∨ q) ≡ ¬p ∧ ¬q</p>\n<p>Nega tudo e troca <span class=\"symbol\">∧</span> por <span class=\"symbol\">∨</span>, ou vice-versa.</p>\n</div>\n<div class=\"blk blk--definicao\">\n<h3 class=\"c-h5\">Negações essenciais</h3>\n<p class=\"symbol\">¬(p → q) ≡ p ∧ ¬q</p>\n<p class=\"symbol\">¬(p ↔ q) ≡ p ⊕ q</p>\n<p>Negar “se p, então q” resulta em “p e não q”.</p>\n</div>\n</div>\n<div><strong class=\"hl\">Quantificadores:</strong> negar “todo A é B” dá “existe pelo menos um A que não é B”. Negar “existe A que é B” dá “nenhum A é B”.</div>"
        }
      ]
    }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
