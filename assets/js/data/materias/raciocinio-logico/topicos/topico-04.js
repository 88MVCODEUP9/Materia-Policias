/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · raciocinio-logico · TOPICO 4
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 4 de raciocinio-logico.
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
      "id": "questao-da-imagem-passo-a-passo",
      "titulo": "Questão da imagem — passo a passo",
      "ordem": 4,
      "origem": "modulo-rlm",
      "origemSecao": "rlm-questao",
      "blocos": [
        {
          "tipo": "h2",
          "texto": "Questão da imagem — passo a passo"
        },
        {
          "tipo": "html",
          "html": "<div class=\"blk blk--definicao\">\n<p><strong class=\"hl\">Premissas:</strong></p>\n<ol>\n<li>Jorge é casado ou Pedro é casado.</li>\n<li>Se Jorge é casado, então Manuel é solteiro.</li>\n<li>Manuel é casado se, e somente se, Paulo é solteiro.</li>\n<li>Paulo é solteiro.</li>\n</ol>\n</div>\n<h3 class=\"c-h5\">Passo 1 — Definir as proposições</h3>\n<div>\n<p><span class=\"symbol\">J</span>: Jorge é casado; <span class=\"symbol\">P</span>: Pedro é casado;</p>\n<p><span class=\"symbol\">M</span>: Manuel é casado; <span class=\"symbol\">S</span>: Paulo é solteiro.</p>\n</div>\n<h3 class=\"c-h5\">Passo 2 — Traduzir para a linguagem lógica</h3>\n<div>\n<p class=\"symbol\">1) J ∨ P</p>\n<p class=\"symbol\">2) J → ¬M</p>\n<p class=\"symbol\">3) M ↔ S</p>\n<p class=\"symbol\">4) S</p>\n</div>\n<h3 class=\"c-h5\">Passo 3 — Usar a bicondicional</h3>\n<p>A premissa <span class=\"symbol\">M ↔ S</span> contém duas condicionais: <span class=\"symbol\">M → S</span> e <span class=\"symbol\">S → M</span>. Como a premissa 4 afirma <span class=\"symbol\">S</span>, aplicamos <strong>Modus Ponens</strong> em <span class=\"symbol\">S → M</span>:</p>\n<p class=\"symbol\">S; S → M ∴ M</p>\n<p>Logo, <strong>Manuel é casado</strong>.</p>\n<h3 class=\"c-h5\">Passo 4 — Descobrir a situação de Jorge</h3>\n<p>A premissa 2 é <span class=\"symbol\">J → ¬M</span>. Já sabemos que <span class=\"symbol\">M</span> é verdadeira; portanto, <span class=\"symbol\">¬M</span> é falsa. Pelo <strong>Modus Tollens</strong>:</p>\n<p class=\"symbol\">J → ¬M; ¬(¬M) ∴ ¬J</p>\n<p>Logo, <strong>Jorge não é casado</strong>, isto é, Jorge é solteiro.</p>\n<h3 class=\"c-h5\">Passo 5 — Descobrir a situação de Pedro</h3>\n<p>Da premissa <span class=\"symbol\">J ∨ P</span>, sabemos que pelo menos um dos dois é casado. Como <span class=\"symbol\">J</span> é falsa, <span class=\"symbol\">P</span> precisa ser verdadeira, pelo <strong>silogismo disjuntivo</strong>.</p>\n<p class=\"symbol\">J ∨ P; ¬J ∴ P</p>\n<div><strong class=\"hl\">Conclusão:</strong> Pedro é casado e Manuel é casado. Portanto, a alternativa correta é <strong>B) Pedro e Manuel são casados.</strong></div>\n<div>\n<div class=\"table-wrap\"><table class=\"table table--compact table--responsive\" ><thead><tr><th>Pessoa</th><th>Estado deduzido</th><th>Fundamento</th></tr></thead><tbody><tr><td>Paulo</td><td>Solteiro</td><td>Premissa direta</td></tr><tr><td>Manuel</td><td>Casado</td><td>Bicondicional + Paulo solteiro</td></tr><tr><td>Jorge</td><td>Solteiro</td><td>Condicional + Manuel casado</td></tr><tr><td>Pedro</td><td>Casado</td><td>Disjunção + Jorge solteiro</td></tr></tbody></table></div>\n</div>"
        }
      ]
    }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
