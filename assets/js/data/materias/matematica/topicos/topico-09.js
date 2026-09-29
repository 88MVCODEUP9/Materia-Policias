/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · matematica · TOPICO 9
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 9 de matematica.
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
        id: 'geometria-plana',
        titulo: 'Geometria Plana',
        ordem: 9,
        origem: 'teoria',
        blocos: [
          { tipo: 'conceito', conteudo: 'Figuras bidimensionais: triângulos, quadriláteros e círculos. Perímetro é a soma dos lados; área é a medida da superfície.' },
          { tipo: 'h2', conteudo: 'Triângulos' },
          { tipo: 'texto', conteudo: 'Área = (base · altura)/2. Perímetro = soma dos três lados. No triângulo retângulo, teorema de Pitágoras: a² = b² + c², sendo a a hipotenusa. A soma dos ângulos internos é 180°.' },
          { tipo: 'h2', conteudo: 'Quadriláteros' },
          { tipo: 'texto', conteudo: 'Retângulo: área = base · altura, perímetro = 2(b + h). Quadrado: área = lado², perímetro = 4·lado. Paralelogramo: área = base · altura. Trapézio: área = [(base maior + base menor) · altura]/2.' },
          { tipo: 'h2', conteudo: 'Círculo' },
          { tipo: 'texto', conteudo: 'Área = πr². Circunferência (perímetro) = 2πr = πd, com r raio e d diâmetro. Use π ≈ 3,14 ou deixe em função de π, conforme o enunciado.' },
          { tipo: 'dica', conteudo: 'Memorize as fórmulas básicas: em concursos a questão costuma fornecer π ou pedir a resposta em função de π.' }
        ]
      }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
