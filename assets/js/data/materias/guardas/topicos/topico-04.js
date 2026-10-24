/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · guarda-programa · TOPICO 4
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 4 de Fonte.
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
{"id": "noes-de-direito-civil", "titulo": "Noes de Direito Civil", "ordem": 40, "origem": "programa-carreira", "corpora": ["guarda"], "blocos": [{"tipo": "h3", "texto": "Noes de Direito Civil"}, {"tipo": "texto", "texto": "Programa de Estatuto Geral das Guardas Municipais, Lei 13.022/2014 para Noes de Direito Civil. Os topicos abaixo sao os cobrados no edital."}, {"tipo": "ul", "itens": ["Aplicacao da lei no tempo e no espaco", "Pessoas naturais, juridicas e domicilio", "Dos bens e dos bens publicos", "Fatos juridicos, negocio e atos juridicos", "Prescricao, decadencia e prova", "Direitos das obrigacoes", "Responsabilidade civil do Estado", "Danos morais e perda de chance", "Súmulas do STF e do STJ"]}, {"tipo": "destaque", "rotulo": "Fonte", "titulo": "Edital oficial", "texto": "https://www2.camara.leg.br/legin/fed/lei/2014/lei-13022-8-agosto-2014-779152-normaatualizada-pl.html"}]}
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
