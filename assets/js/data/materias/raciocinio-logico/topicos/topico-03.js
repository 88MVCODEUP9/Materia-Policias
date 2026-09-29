/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · raciocinio-logico · TOPICO 3
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 3 de raciocinio-logico.
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
      "id": "argumentacao-logica",
      "titulo": "Argumentação lógica",
      "ordem": 3,
      "origem": "modulo-rlm",
      "origemSecao": "rlm-argumentacao",
      "blocos": [
        {
          "tipo": "h2",
          "texto": "Argumentação lógica"
        },
        {
          "tipo": "html",
          "html": "3. Argumentação lógica</h2>\n<div>\n<div class=\"table-wrap\"><table class=\"table table--compact table--responsive\" >\n<thead><tr><th>Regra</th><th>Estrutura</th><th>Conclusão</th></tr></thead>\n<tbody>\n<tr><td>Modus Ponens</td><td class=\"symbol\">p → q; p</td><td class=\"symbol\">∴ q</td></tr>\n<tr><td>Modus Tollens</td><td class=\"symbol\">p → q; ¬q</td><td class=\"symbol\">∴ ¬p</td></tr>\n<tr><td>Silogismo hipotético</td><td class=\"symbol\">p → q; q → r</td><td class=\"symbol\">∴ p → r</td></tr>\n<tr><td>Silogismo disjuntivo</td><td class=\"symbol\">p ∨ q; ¬p</td><td class=\"symbol\">∴ q</td></tr>\n</tbody>\n</table></div>\n</div>\n<div><strong class=\"hl\">Erros clássicos:</strong> de <span class=\"symbol\">p → q</span> e <span class=\"symbol\">q</span>, não se pode concluir <span class=\"symbol\">p</span> (afirmação do consequente). De <span class=\"symbol\">p → q</span> e <span class=\"symbol\">¬p</span>, não se pode concluir <span class=\"symbol\">¬q</span> (negação do antecedente).</div>"
        }
      ]
    }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
