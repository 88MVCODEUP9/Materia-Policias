/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · guarda-programa · TOPICO 1
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 1 de Fonte.
   ========================================================================== */
(function (global) {
  'use strict';
  var D = global.GMData;
  D.conteudoTeoria = D.conteudoTeoria || {};
  var modulo = D.conteudoTeoria["guarda-programa"] || (D.conteudoTeoria["guarda-programa"] = { materiaId: "guarda-programa", rotulo: "Fonte", assuntos: [] });
  modulo.assuntos = modulo.assuntos || [];
  var existentes = Object.create(null);
  modulo.assuntos.forEach(function (a) { existentes[a.id] = true; });
  
  [
{"id": "conhecimentos-na-area-de-atuacao", "titulo": "Conhecimentos na Area de Atuacao", "ordem": 10, "origem": "programa-carreira", "corpora": ["guarda"], "blocos": [{"tipo": "h3", "texto": "Conhecimentos na Area de Atuacao"}, {"tipo": "texto", "texto": "Programa de Estatuto Geral das Guardas Municipais, Lei 13.022/2014 para Conhecimentos na Area de Atuacao. Os topicos abaixo sao os cobrados no edital."}, {"tipo": "ul", "itens": ["Atendimento ao publico e relacoes humanas", "Trabalho em equipe e comunicacao", "Nocoes de defesa pessoal", "Planejamento de contingencias", "Manejo de emergencia e gerenciamento de crises", "Gestao de incidentes criticos", "Negociacao policial e reducao de tensao", "Prevencao e combate a incendio", "Condutas do socorrista", "Nocoes de inteligencia e fontes de coleta"]}, {"tipo": "destaque", "rotulo": "Fonte", "titulo": "Edital oficial", "texto": "https://www2.camara.leg.br/legin/fed/lei/2014/lei-13022-8-agosto-2014-779152-normaatualizada-pl.html"}]}
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
