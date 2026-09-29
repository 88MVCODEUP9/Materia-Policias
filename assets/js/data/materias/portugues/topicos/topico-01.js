/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · portugues · TOPICO 1
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 1 de portugues.
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
      "id": "interpretacao-de-texto",
      "titulo": "Interpretação de Texto",
      "ordem": 1,
      "origem": "portugues-md",
      "origemSecao": "interpretacao-de-texto",
      "blocos": [
        {"tipo": "h2", "texto": "Interpretação de Texto"},
        {"tipo": "texto", "texto": "A interpretação de texto é a habilidade de compreender, analisar e extrair informações de um texto escrito. Em concursos policiais, é um dos temas mais cobrados e que mais reprova candidatos."},
        {"tipo": "h3", "texto": "Tipos de Texto"},
        {"tipo": "conceito", "texto": "**Texto Narrativo**\n\nRelata fatos ou acontecimentos, com personagens, enredo, tempo e espaço. Exemplo: notícias, crônicas, contos."},
        {"tipo": "conceito", "texto": "**Texto Descritivo**\n\nRetrata características de pessoas, objetos, lugares ou situações. Exemplo: relatos de ocorrências, descrições de suspeitos."},
        {"tipo": "conceito", "texto": "**Texto Dissertativo**\n\nExpõe ideias, argumenta, convence ou informa. É o tipo mais comum em editais e provas. Exemplo: artigos de opinião, editoriais."},
        {"tipo": "conceito", "texto": "**Texto Injuntivo**\n\nInstrui, orienta, recomenda. Exemplo: manuais, editais, instruções normativas."},
        {"tipo": "h3", "texto": "Níveis de Compreensão"},
        {"tipo": "conceito", "texto": "**Compreensão (Literal)**\n\nExtrai informações explícitas do texto. O candidato localiza dados, fatos e ideias diretamente enunciados."},
        {"tipo": "conceito", "texto": "**Interpretação (Inferencial)**\n\nExtrai informações implícitas. O candidato deduz, conclui e infere sentidos a partir do contexto."},
        {"tipo": "conceito", "texto": "**Análise Crítica**\n\nAvalia o texto, identifica intencionalidade, posicionamento do autor, recursos argumentativos e ideias centrais."},
        {"tipo": "h3", "texto": "Estratégias de Leitura"},
        {"tipo": "texto", "texto": "1. Leia o texto inteiro antes de responder;"},
        {"tipo": "texto", "texto": "2. Identifique o tema central e a tese do autor;"},
        {"tipo": "texto", "texto": "3. Observe palavras de transição (mas, porém, portanto, além disso);"},
        {"tipo": "texto", "texto": "4. Atenção a pronomes e conectivos — eles retomam ideias anteriores;"},
        {"tipo": "texto", "texto": "5. Cuidado com afirmações absolutas (sempre, nunca, todos, nenhum) — costumam ser pegadinhas."},
        {"tipo": "atencao", "texto": "**Erro Comum: Extrapolação**\n\nNão acrescente informações externas ao texto. A resposta deve estar baseada apenas no que foi escrito, mesmo que você saiba mais sobre o assunto."},
        {"tipo": "dica", "texto": "**Mnemônico**\n\n📌 C-I-A: Compreensão → Interpretação → Análise\n\n📌 Do literal ao crítico, em camadas crescentes de profundidade."}
      ]
    }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
