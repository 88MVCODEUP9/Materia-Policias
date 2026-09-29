/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · matematica · TOPICO 2
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 2 de matematica.
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
        id: 'regra-tres',
        titulo: 'Regra de Três',
        ordem: 2,
        origem: 'teoria',
        blocos: [
          { tipo: 'conceito', conteudo: 'Método para resolver problemas de proporção entre grandezas. Simples (duas grandezas) ou composta (três ou mais).' },
          { tipo: 'h2', conteudo: 'Regra de Três Simples Direta' },
          { tipo: 'texto', conteudo: 'As grandezas variam no mesmo sentido: aumenta uma, aumenta a outra. Exemplo: 3 policiais patrulham 12 km. Quantos km patrulham 5 policiais? 3/5 = 12/x → 3x = 60 → x = 20 km.' },
          { tipo: 'h2', conteudo: 'Regra de Três Simples Inversa' },
          { tipo: 'texto', conteudo: 'As grandezas variam em sentido oposto: aumenta uma, diminui a outra. Exemplo: 6 policiais fazem uma ronda em 4 horas. Em quanto tempo 8 policiais? 6/8 = x/4 → 8x = 24 → x = 3 horas.' },
          { tipo: 'h2', conteudo: 'Regra de Três Composta' },
          { tipo: 'texto', conteudo: 'Envolve três ou mais grandezas. Fixe a grandeza com a incógnita, compare cada uma das outras com ela (direta ou inversa) e multiplique as frações. Verifique o sentido da relação antes de montar.' },
          { tipo: 'atencao', conteudo: 'Erro comum: inverter quando a relação é direta. Confira o sentido dos dados antes de montar a proporção.' }
        ]
      }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
