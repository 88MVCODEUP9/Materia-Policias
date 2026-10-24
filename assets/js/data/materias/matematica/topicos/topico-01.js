/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · matematica · TOPICO 1
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 1 de matematica.
   ========================================================================== */
(function (global) {
  'use strict';
  var D = global.GMData;
  D.conteudoTeoria = D.conteudoTeoria || {};
  var modulo = D.conteudoTeoria["matematica"] || (D.conteudoTeoria["matematica"] = { materiaId: "matematica", rotulo: "matematica", assuntos: [] });
  modulo.assuntos = modulo.assuntos || [];
  var existentes = Object.create(null);
  modulo.assuntos.forEach(function (a) { existentes[a.id] = true; });
  
  [
{
        id: 'razao-proporcao',
        titulo: 'Razão e Proporção',
        ordem: 1,
        origem: 'teoria',
        blocos: [
          { tipo: 'conceito', conteudo: 'Razão é o quociente entre dois números. Proporção é a igualdade entre duas razões.' },
          { tipo: 'h2', conteudo: 'Razão' },
          { tipo: 'texto', conteudo: 'A razão entre a e b (b ≠ 0) é o quociente a/b; lê-se "a está para b". É uma comparação multiplicativa entre grandezas. Exemplo: numa turma com 20 homens e 30 mulheres, a razão homens/mulheres é 20/30 = 2/3.' },
          { tipo: 'h2', conteudo: 'Proporção' },
          { tipo: 'texto', conteudo: 'Proporção é a igualdade a/b = c/d. a e d são os extremos; b e c são os meios. Propriedade fundamental: o produto dos extremos é igual ao produto dos meios (a·d = b·c). Base da regra de três e da divisão proporcional.' },
          { tipo: 'dica', conteudo: 'Em concursos, razão e proporção aparecem na divisão de valores, em escala de mapas e na comparação de quantidades.' }
        ]
      }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
