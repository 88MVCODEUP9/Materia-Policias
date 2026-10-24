/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · raciocinio-logico · TOPICO 1
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 1 de raciocinio-logico.
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
      "id": "simbolos-logicos-corretos",
      "titulo": "Símbolos lógicos corretos",
      "ordem": 1,
      "origem": "modulo-rlm",
      "origemSecao": "rlm-simbolos",
      "blocos": [
        {
          "tipo": "h2",
          "texto": "Símbolos lógicos corretos"
        },
        {
          "tipo": "html",
          "html": "1. Símbolos lógicos corretos</h2>\n<p>Os sinais abaixo usam entidades HTML e fontes matemáticas de reserva, evitando quadrados, pontos de interrogação ou caracteres trocados.</p>\n<div>\n<div class=\"table-wrap\"><table class=\"table table--compact table--responsive\" >\n<thead><tr><th>Operação</th><th>Símbolo</th><th>Leitura</th><th>Quando é verdadeira</th></tr></thead>\n<tbody>\n<tr><td>Negação</td><td class=\"symbol\">¬p</td><td>não p</td><td>Quando p é falsa</td></tr>\n<tr><td>Conjunção</td><td class=\"symbol\">p ∧ q</td><td>p e q</td><td>Somente V e V</td></tr>\n<tr><td>Disjunção inclusiva</td><td class=\"symbol\">p ∨ q</td><td>p ou q</td><td>Quando pelo menos uma é V</td></tr>\n<tr><td>Disjunção exclusiva</td><td class=\"symbol\">p ⊕ q</td><td>ou p ou q</td><td>Quando exatamente uma é V</td></tr>\n<tr><td>Condicional</td><td class=\"symbol\">p → q</td><td>se p, então q</td><td>Falsa só em V → F</td></tr>\n<tr><td>Bicondicional</td><td class=\"symbol\">p ↔ q</td><td>p se, e somente se, q</td><td>Quando os valores são iguais</td></tr>\n</tbody>\n</table></div>\n</div>\n<h3 class=\"c-h5\">Tabela-verdade completa</h3>\n<p>Com duas proposições simples, existem <span class=\"symbol\">2<sup>2</sup> = 4</span> combinações possíveis. Compare todos os conectivos na mesma tabela:</p>\n<div>\n<div class=\"table-wrap\"><table class=\"table table--compact table--responsive\" >\n<thead>\n<tr>\n<th class=\"symbol\">p</th>\n<th class=\"symbol\">q</th>\n<th class=\"symbol\">¬p</th>\n<th class=\"symbol\">¬q</th>\n<th class=\"symbol\">p ∧ q</th>\n<th class=\"symbol\">p ∨ q</th>\n<th class=\"symbol\">p ⊕ q</th>\n<th class=\"symbol\">p → q</th>\n<th class=\"symbol\">p ↔ q</th>\n</tr>\n</thead>\n<tbody>\n<tr><td>V</td><td>V</td><td>F</td><td>F</td><td>V</td><td>V</td><td>F</td><td>V</td><td>V</td></tr>\n<tr><td>V</td><td>F</td><td>F</td><td>V</td><td>F</td><td>V</td><td>V</td><td>F</td><td>F</td></tr>\n<tr><td>F</td><td>V</td><td>V</td><td>F</td><td>F</td><td>V</td><td>V</td><td>V</td><td>F</td></tr>\n<tr><td>F</td><td>F</td><td>V</td><td>V</td><td>F</td><td>F</td><td>F</td><td>V</td><td>V</td></tr>\n</tbody>\n</table></div>\n</div>\n<div>\n<div class=\"blk blk--definicao\"><strong class=\"symbol\">p ∧ q — “E”</strong><p>Só é verdadeira quando as duas proposições são verdadeiras.</p></div>\n<div class=\"blk blk--definicao\"><strong class=\"symbol\">p ∨ q — “OU”</strong><p>Só é falsa quando as duas proposições são falsas.</p></div>\n<div class=\"blk blk--definicao\"><strong class=\"symbol\">p ⊕ q — “OU...OU”</strong><p>É verdadeira quando os valores são diferentes. É falsa quando são iguais.</p></div>\n<div class=\"blk blk--definicao\"><strong class=\"symbol\">p → q — “SE...ENTÃO”</strong><p>Só é falsa no caso <span class=\"symbol\">V → F</span>.</p></div>\n<div class=\"blk blk--definicao\"><strong class=\"symbol\">p ↔ q — “SE E SOMENTE SE”</strong><p>É verdadeira quando as duas proposições possuem o mesmo valor lógico.</p></div>\n<div class=\"blk blk--definicao\"><strong>Número de linhas</strong><p>Para <span class=\"symbol\">n</span> proposições simples, a tabela tem <span class=\"symbol\">2<sup>n</sup></span> linhas: 1 proposição = 2; 2 = 4; 3 = 8; 4 = 16.</p></div>\n</div>\n<div><strong class=\"hl\">Macete:</strong> na condicional, só dá falso quando a primeira parte é verdadeira e a segunda é falsa: <span class=\"symbol\">V → F = F</span>.</div>"
        }
      ]
    }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
