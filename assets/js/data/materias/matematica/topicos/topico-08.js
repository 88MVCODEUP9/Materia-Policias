/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · matematica · TOPICO 8
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 8 de matematica.
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
        id: 'funcoes',
        titulo: 'Funções',
        ordem: 8,
        origem: 'teoria',
        blocos: [
          { tipo: 'conceito', conteudo: 'Função associa cada elemento do domínio a um único elemento do contradomínio. Notação: f(x).' },
          { tipo: 'h2', conteudo: 'Função do 1º Grau' },
          { tipo: 'texto', conteudo: 'f(x) = ax + b, com a ≠ 0. O gráfico é uma reta; a é a taxa de variação (inclinação). a > 0: crescente. a < 0: decrescente. Raiz: o valor de x onde f(x) = 0, ou seja x = −b/a.' },
          { tipo: 'h2', conteudo: 'Função do 2º Grau' },
          { tipo: 'texto', conteudo: 'f(x) = ax² + bx + c, com a ≠ 0. O gráfico é uma parábola. a > 0: concavidade para cima, com mínimo no vértice. a < 0: concavidade para baixo, com máximo. Vértice: xᵥ = −b/(2a), yᵥ = −Δ/(4a).' },
          { tipo: 'atencao', conteudo: 'Em problemas de máximo e mínimo, o sinal de a diz se o vértice é máximo ou mínimo.' }
        ]
      }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
