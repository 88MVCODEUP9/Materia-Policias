/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · matematica · TOPICO 10
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 10 de matematica.
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
        id: 'geometria-espacial',
        titulo: 'Geometria Espacial',
        ordem: 10,
        origem: 'teoria',
        blocos: [
          { tipo: 'conceito', conteudo: 'Sólidos: prismas, cilindros, pirâmides, cones e esferas. Volume mede o espaço ocupado; área superficial é a soma das faces.' },
          { tipo: 'h2', conteudo: 'Cubo, paralelepípedo e cilindro' },
          { tipo: 'texto', conteudo: 'Cubo: volume = a³, área = 6a². Paralelepípedo: volume = c·l·h, área = 2(ac + ab + bc). Cilindro: volume = πr²h, área = 2πr² + 2πrh.' },
          { tipo: 'h2', conteudo: 'Esfera' },
          { tipo: 'texto', conteudo: 'Volume = (4/3)πr³. Área = 4πr². Todos os pontos da superfície estão à mesma distância (o raio) do centro.' },
          { tipo: 'h2', conteudo: 'Pirâmide e cone' },
          { tipo: 'texto', conteudo: 'Pirâmide: volume = (área da base · altura)/3. Cone: volume = (πr²h)/3. Ambos são um terço do sólido correspondente.' },
          { tipo: 'atencao', conteudo: 'Diferencie raio de diâmetro. Volume de pirâmide e cone sempre divide por 3.' }
        ]
      }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
