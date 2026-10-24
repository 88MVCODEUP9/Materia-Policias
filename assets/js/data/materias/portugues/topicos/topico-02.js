/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · portugues · TOPICO 2
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 2 de portugues.
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
      "id": "ortografia-e-acentuacao",
      "titulo": "Ortografia e Acentuação",
      "ordem": 2,
      "origem": "portugues-md",
      "origemSecao": "ortografia-e-acentuacao",
      "blocos": [
        {"tipo": "h2", "texto": "Ortografia e Acentuação"},
        {"tipo": "texto", "texto": "Ortografia é a forma correta de escrever as palavras. Acentuação gráfica indica a sílaba tônica e segue regras específicas da língua portuguesa."},
        {"tipo": "h3", "texto": "Acentuação de Palavras Oxítonas"},
        {"tipo": "texto", "texto": "Acentuam-se as oxítonas terminadas em: a, e, o, em, ens."},
        {"tipo": "ul", "itens": ["café, café, café;", "vovó, chapéu, anéis;", "parabém, além, ninguém;"]},
        {"tipo": "atencao", "texto": "**Exceção**\n\nOxítonas terminadas em 'i' ou 'u' tônicos NÃO levam acento: tuiuiú, urubu (sem acento no 'u' final)."},
        {"tipo": "h3", "texto": "Acentuação de Palavras Paroxítonas"},
        {"tipo": "texto", "texto": "Acentuam-se as paroxítonas terminadas em: l, n, r, x, ps, ã, ãe, ão, i, is, um, uns, om, ons, us, ei, eis, ói, óis."},
        {"tipo": "ul", "itens": ["difícil, amável;", "hífen, hífens;", "tórax, tórax;", "bíceps, bíceps;", "órfão, órfãos;"]},
        {"tipo": "atencao", "texto": "**Paroxítonas terminadas em 'a', 'e', 'o', 'em', 'ens' NÃO levam acento**\n\nExemplo: tema, poema, atlas, itens, edens."},
        {"tipo": "h3", "texto": "Acentuação de Palavras Proparoxítonas"},
        {"tipo": "texto", "texto": "Todas as proparoxítonas são acentuadas."},
        {"tipo": "ul", "itens": ["médico, música;", "lâmpada, ângulo;", "pálido, rápido;"]},
        {"tipo": "h3", "texto": "Ditongos e Hiatos"},
        {"tipo": "conceito", "texto": "**Ditongo**\n\nEncontro de duas vogais na mesma sílaba. Exemplo: céu, pai, série."},
        {"tipo": "conceito", "texto": "**Hiato**\n\nEncontro de duas vogais em sílabas diferentes. Exemplo: sa-ú-de, po-e-ta, ra-i-nha."},
        {"tipo": "atencao", "texto": "**Regra do 'i' e 'u'**\n\nO 'i' e 'u' tônicos, quando formam hiato com a vogal anterior, recebem acento: sa-í-da, ba-ú, sa-ú-de."},
        {"tipo": "h3", "texto": "Ortografia: Uso do 'S' e 'Z'"},
        {"tipo": "texto", "texto": "Usa-se 'S':"},
        {"tipo": "ul", "itens": ["Após ditongo: coisa, paisagem;", "Em palavras derivadas de outras com 's': casa → casar;", "Em verbos derivados de substantivos com 's': análise → analisar;"]},
        {"tipo": "texto", "texto": "Usa-se 'Z':"},
        {"tipo": "ul", "itens": ["Em palavras derivadas de outras com 'z': feliz → felicidade;", "Em verbos derivados de substantivos com 'z': paz → pacificar;", "Em palavras terminadas em '-ez', '-eza': beleza, riqueza;"]},
        {"tipo": "dica", "texto": "**Mnemônico**\n\n📌 Oxítona com A-E-O-EM-ENS → acento!\n\n📌 Paroxítona com L-N-R-X-Ã → acento!\n\n📌 Proparoxítona → sempre acento!"}
      ]
    }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
