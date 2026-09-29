/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · portugues · TOPICO 3
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 3 de portugues.
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
      "id": "classes-de-palavras",
      "titulo": "Classes de Palavras",
      "ordem": 3,
      "origem": "portugues-md",
      "origemSecao": "classes-de-palavras",
      "blocos": [
        {"tipo": "h2", "texto": "Classes de Palavras"},
        {"tipo": "texto", "texto": "As palavras são classificadas em dez classes gramaticais, divididas em variáveis e invariáveis."},
        {"tipo": "h3", "texto": "Classes Variáveis"},
        {"tipo": "conceito", "texto": "**Substantivo**\n\nNomeia seres, objetos, sentimentos, ações. Classificações: comum/próprio, concreto/abstrato, simples/composto, primitivo/derivado, coletivo."},
        {"tipo": "conceito", "texto": "**Adjetivo**\n\nCaracteriza o substantivo. Classificações: simples/composto, primitivo/derivado, pátrios (brasileiro, paulista)."},
        {"tipo": "conceito", "texto": "**Artigo**\n\nDetermina o substantivo de forma definida (o, a, os, as) ou indefinida (um, uma, uns, umas)."},
        {"tipo": "conceito", "texto": "**Numeral**\n\nIndica quantidade, ordem, multiplicação ou fração. Classificações: cardinal, ordinal, multiplicativo, fracionário."},
        {"tipo": "conceito", "texto": "**Pronome**\n\nSubstitui ou acompanha o substantivo. Classificações: pessoais, possessivos, demonstrativos, indefinidos, interrogativos, relativos."},
        {"tipo": "conceito", "texto": "**Verbo**\n\nExpressa ação, estado, fenômeno da natureza ou mudança de estado. Flexiona em número, pessoa, tempo, modo e voz."},
        {"tipo": "h3", "texto": "Classes Invariáveis"},
        {"tipo": "conceito", "texto": "**Advérbio**\n\nModifica o verbo, o adjetivo ou outro advérbio, expressando circunstâncias (modo, tempo, lugar, intensidade, negação, afirmação, dúvida)."},
        {"tipo": "conceito", "texto": "**Preposição**\n\nLiga dois termos da oração, estabelecendo relações de sentido. Classificações: essenciais (de, a, em, por, para) e acidentais (sobre, após, contra)."},
        {"tipo": "conceito", "texto": "**Conjunção**\n\nLiga palavras ou orações. Classificações: coordenativas (aditivas, adversativas, alternativas, conclusivas, explicativas) e subordinativas (causais, condicionais, temporais, etc.)."},
        {"tipo": "conceito", "texto": "**Interjeição**\n\nExpressa emoções, sentimentos, reações. Exemplo: ai, ufa, olá, caramba."},
        {"tipo": "atencao", "texto": "**Diferença: Artigo vs. Pronome**\n\nArtigo acompanha o substantivo (o livro). Pronome substitui o substantivo (o que? → o)."},
        {"tipo": "dica", "texto": "**Mnemônico**\n\n📌 V-A-S-A-N-P: Variáveis = Substantivo, Adjetivo, Artigo, Numeral, Pronome, Verbo\n\n📌 A-P-C-I: Invariáveis = Advérbio, Preposição, Conjunção, Interjeição"}
      ]
    }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
