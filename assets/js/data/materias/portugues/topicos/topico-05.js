/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · portugues · TOPICO 5
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 5 de portugues.
   ========================================================================== */
(function (global) {
  'use strict';
  var D = global.GMData;
  D.conteudoTeoria = D.conteudoTeoria || {};
  var modulo = D.conteudoTeoria["portugues"] || (D.conteudoTeoria["portugues"] = { materiaId: "portugues", rotulo: "portugues", assuntos: [] });
  modulo.assuntos = modulo.assuntos || [];
  var existentes = Object.create(null);
  modulo.assuntos.forEach(function (a) { existentes[a.id] = true; });
  
  [
    {
      "id": "concordancia-verbal-e-nominal",
      "titulo": "Concordância Verbal e Nominal",
      "ordem": 5,
      "origem": "portugues-md",
      "origemSecao": "concordancia-verbal-e-nominal",
      "blocos": [
        {"tipo": "h2", "texto": "Concordância Verbal e Nominal"},
        {"tipo": "texto", "texto": "Concordância é a adaptação de palavras em gênero, número ou pessoa, para manter a harmonia dentro da frase."},
        {"tipo": "h3", "texto": "Concordância Verbal"},
        {"tipo": "conceito", "texto": "**Regra Geral**\n\nO verbo concorda com o sujeito em número e pessoa. Exemplo: O policial chegou. / Os policiais chegaram."},
        {"tipo": "conceito", "texto": "**Sujeito Composto**\n\nO verbo vai para o plural. Exemplo: O policial e o soldado chegaram."},
        {"tipo": "atencao", "texto": "**Exceção: Sujeito Composto com 'ou'**\n\nSe o 'ou' indica alternância, o verbo fica no singular: O policial ou o soldado chegará."},
        {"tipo": "conceito", "texto": "**Verbo 'Haver' (sentido de existir)**\n\nFica sempre no singular: Havia muitos policiais. / Haverá muitas ocorrências."},
        {"tipo": "conceito", "texto": "**Verbo 'Fazer' (tempo decorrido)**\n\nFica sempre no singular: Faz dois anos que o policial trabalha aqui."},
        {"tipo": "h3", "texto": "Concordância Nominal"},
        {"tipo": "conceito", "texto": "**Regra Geral**\n\nO adjetivo, artigo, numeral e pronome concordam com o substantivo em gênero e número. Exemplo: O policial militar chegou."},
        {"tipo": "conceito", "texto": "**Adjunto Adnominal com Vários Substantivos**\n\nSe os substantivos são do mesmo gênero, o adjetivo vai para o plural: O policial e o soldado militares chegaram."},
        {"tipo": "atencao", "texto": "**Exceção: Substantivos de Gêneros Diferentes**\n\nO adjetivo concorda com o substantivo mais próximo ou vai para o masculino plural: O policial e a soldada militares chegaram."},
        {"tipo": "conceito", "texto": "**Palavras que Exigem Concordância Especial**\n\n- 'Mesmo', 'próprio', 'bastante': concordam com o substantivo. Exemplo: O policial mesmo chegou. / Os policiais mesmos chegaram.\n\n- 'É proibido', 'é permitido', 'é bom': ficam no singular se o sujeito não tem artigo: É proibido entrada de civis."},
        {"tipo": "dica", "texto": "**Mnemônico**\n\n📌 Verbo → Sujeito (concorda em número e pessoa)\n\n📌 Adjetivo → Substantivo (concorda em gênero e número)\n\n📌 'Haver' e 'Fazer' (tempo) → sempre singular!"}
      ]
    }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
