/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · portugues · TOPICO 6
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 6 de portugues.
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
      "id": "regencia-e-pontuacao",
      "titulo": "Regência e Pontuação",
      "ordem": 6,
      "origem": "portugues-md",
      "origemSecao": "regencia-e-pontuacao",
      "blocos": [
        {"tipo": "h2", "texto": "Regência e Pontuacão"},
        {"tipo": "texto", "texto": "Regência é a relação de dependência entre um termo (regente) e outro (regido). Pontuação é o uso de sinais gráficos para organizar o texto e indicar pausas, entonação e sentido."},
        {"tipo": "h3", "texto": "Regência Verbal"},
        {"tipo": "conceito", "texto": "**Verbo Transitivo Direto (VTD)**\n\nExige objeto direto, sem preposição. Exemplo: O policial prendeu o suspeito."},
        {"tipo": "conceito", "texto": "**Verbo Transitivo Indireto (VTI)**\n\nExige objeto indireto, com preposição. Exemplo: O policial obedeceu às ordens."},
        {"tipo": "conceito", "texto": "**Verbo Transitivo Bitransitivo (VTDI)**\n\nExige objeto direto e indireto. Exemplo: O policial entregou o relatório ao superior."},
        {"tipo": "atencao", "texto": "**Verbos que Mudam de Sentido com a Preposição**\n\n- 'Assistir' (ver, sem preposição) vs. 'assistir' (ajudar, com 'a'): O policial assistiu ao filme. / O policial assistiu o acidentado.\n\n- 'Obedecer' (com 'a') vs. 'desobedecer' (com 'a'): O policial obedeceu às ordens.\n\n- 'Visar' (mirar, sem preposição) vs. 'visar' (ter como objetivo, com 'a'): O policial visou o alvo. / O policial visou à promoção."},
        {"tipo": "h3", "texto": "Regência Nominal"},
        {"tipo": "texto", "texto": "Alguns nomes (substantivos, adjetivos, advérbios) exigem complemento com preposição."},
        {"tipo": "ul", "itens": ["Capaz de, incapaz de;", "A favor de, contra;", "De acordo com;", "A fim de, por fim;", "Perto de, longe de;"]},
        {"tipo": "h3", "texto": "Pontuação"},
        {"tipo": "conceito", "texto": "**Vírgula**\n\nSepara elementos de uma enumeração, isola adjuntos adverbiais deslocados, separa orações coordenadas e indica elipse do verbo."},
        {"tipo": "conceito", "texto": "**Ponto Final**\n\nEncerra uma frase declarativa, interrogatativa ou exclamativa."},
        {"tipo": "conceito", "texto": "**Ponto e Vírgula**\n\nSepara itens de uma enumeração complexa ou orações coordenadas longas."},
        {"tipo": "conceito", "texto": "**Dois Pontos**\n\nIntroduz explicação, citação, enumeração ou discurso direto."},
        {"tipo": "conceito", "texto": "**Travessão**\n\nIndica mudança de interlocutor, destaque de uma ideia ou inserção de uma explicação."},
        {"tipo": "atencao", "texto": "**Erro Comum: Vírgula entre Sujeito e Predicado**\n\nNunca separe sujeito de predicado por vírgula: O policial, chegou cedo. (ERRADO) → O policial chegou cedo. (CORRETO)"},
        {"tipo": "dica", "texto": "**Mnemônico**\n\n📌 VTD → sem preposição\n\n📌 VTI → com preposição\n\n📌 Vírgula: enumeração, adjunto deslocado, elipse do verbo"}
      ]
    }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
