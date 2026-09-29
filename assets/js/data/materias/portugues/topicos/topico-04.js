/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · portugues · TOPICO 4
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 4 de portugues.
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
      "id": "sintaxe-da-oracao",
      "titulo": "Sintaxe da Oração",
      "ordem": 4,
      "origem": "portugues-md",
      "origemSecao": "sintaxe-da-oracao",
      "blocos": [
        {"tipo": "h2", "texto": "Sintaxe da Oração"},
        {"tipo": "texto", "texto": "Sintaxe é a parte da gramática que estuda as relações entre as palavras dentro da oração e entre as orações."},
        {"tipo": "h3", "texto": "Termos Essenciais da Oração"},
        {"tipo": "conceito", "texto": "**Sujeito**\n\nTermo sobre o qual se declara algo. Pode ser: simples, composto, oculto (desinencial), indeterminado ou inexistente (oração sem sujeito)."},
        {"tipo": "conceito", "texto": "**Predicado**\n\nTermo que contém o verbo e informa algo sobre o sujeito. Classificações: nominal (verbo de ligação), verbal (verbo significativo), verbo-nominal (verbo de ligação + verbo significativo)."},
        {"tipo": "h3", "texto": "Termos Integrantes da Oração"},
        {"tipo": "conceito", "texto": "**Objeto Direto**\n\nTermo que completa o sentido de um verbo transitivo direto, sem preposição obrigatória. Exemplo: O policial prendeu o suspeito."},
        {"tipo": "conceito", "texto": "**Objeto Indireto**\n\nTermo que completa o sentido de um verbo transitivo indireto, com preposição obrigatória. Exemplo: O policial obedeceu às ordens."},
        {"tipo": "conceito", "texto": "**Complemento Nominal**\n\nTermo que completa o sentido de um nome (substantivo, adjetivo ou advérbio), sempre com preposição. Exemplo: A prisão do suspeito foi decretada."},
        {"tipo": "conceito", "texto": "**Agente da Passiva**\n\nTermo que indica quem pratica a ação na voz passiva, sempre com preposição. Exemplo: O suspeito foi preso pelo policial."},
        {"tipo": "h3", "texto": "Termos Acessórios da Oração"},
        {"tipo": "conceito", "texto": "**Adjunto Adnominal**\n\nTermo que caracteriza ou determina um substantivo. Exemplo: O policial militar chegou."},
        {"tipo": "conceito", "texto": "**Adjunto Adverbial**\n\nTermo que indica circunstância (tempo, lugar, modo, causa, etc.). Exemplo: O policial chegou rapidamente."},
        {"tipo": "conceito", "texto": "**Aposto**\n\nTermo que explica, resume ou especifica outro termo. Exemplo: O policial, profissional dedicado, chegou cedo."},
        {"tipo": "conceito", "texto": "**Vocativo**\n\nTermo usado para chamar ou interpelar alguém. Exemplo: Policial, pare o veículo!"},
        {"tipo": "atencao", "texto": "**Diferença: Adjunto Adnominal vs. Aposto**\n\nAdjunto adnominal é restritivo (o policial militar). Aposto é explicativo (o policial, profissional dedicado, ...)."},
        {"tipo": "dica", "texto": "**Mnemônico**\n\n📌 S-P: Sujeito e Predicado (essenciais)\n\n📌 O-O-C-A: Objeto direto, Objeto indireto, Complemento nominal, Agente da passiva (integrantes)\n\n📌 A-A-A-V: Adjunto adnominal, Adjunto adverbial, Aposto, Vocativo (acessórios)"}
      ]
    }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
