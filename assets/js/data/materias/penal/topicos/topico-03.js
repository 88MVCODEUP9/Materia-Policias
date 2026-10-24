/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · penal · TOPICO 3
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 3 de penal.
   ========================================================================== */
(function (global) {
  'use strict';
  var D = global.GMData;
  D.conteudoTeoria = D.conteudoTeoria || {};
  var modulo = D.conteudoTeoria["penal"] || (D.conteudoTeoria["penal"] = { materiaId: "penal", rotulo: "penal", assuntos: [] });
  modulo.assuntos = modulo.assuntos || [];
  var existentes = Object.create(null);
  modulo.assuntos.forEach(function (a) { existentes[a.id] = true; });
  
  [
{
      "id": "erro-excludentes-e-descriminantes-putativas",
      "titulo": "Erro, Excludentes e Descriminantes Putativas",
      "ordem": 3,
      "origem": "penal-md",
      "origemSecao": "erro-excludentes-e-descriminantes-putativas",
      "blocos": [
        {"tipo": "h2", "texto": "Erro, Excludentes e Descriminantes Putativas"},
        {"tipo": "texto", "texto": "Teoria do erro (tipo, proibição, erro sobre a pessoa, execução, resultado e aberratio causae), causas de exclusão da ilicitude (estado de necessidade, legítima defesa, estrito cumprimento, exercício regular), causas de exclusão da culpabilidade (inimputabilidade, coação, obediência, embriaguez, inexigibilidade de conduta diversa), excesso punível e emoção/paixão."},
        {"tipo": "h3", "texto": "Erro de Tipo, Proibição e Descriminantes Putativas"},
        {"tipo": "conceito", "texto": "**Erro de Tipo (Art. 20 do CP)**\n\nO agente desconhece um elemento do tipo penal (percepção equivocada da realidade)."},
        {"tipo": "texto", "texto": "Essencial inevitável (escusável): exclui o dolo e a culpa → fato atípico (absolvição).\n\nEssencial evitável (inescusável): exclui o dolo, mas permite punição por crime culposo (se houver previsão).\n\nAcidental: não exclui o crime, mas afasta qualificadora/agravante."},
        {"tipo": "texto", "texto": "Exemplo: O caçador vê um vulto e atira pensando ser um javali, mas era seu filho. Sem possibilidade de prever → erro essencial inevitável = absolvição."},
        {"tipo": "conceito", "texto": "**Erro de Proibição (Art. 21 do CP)**\n\nO agente conhece os fatos, mas acredita que sua conduta é lícita (desconhece a ilicitude)."},
        {"tipo": "texto", "texto": "Inevitável (escusável): exclui a culpabilidade → isenção de pena.\n\nEvitável (inescusável): reduz a pena de 1/6 a 1/3."},
        {"tipo": "texto", "texto": "Regra: O desconhecimento da lei é inescusável (art. 21, caput), mas o erro sobre a ilicitude, se inevitável, exclui a culpabilidade."},
        {"tipo": "conceito", "texto": "**Descriminantes Putativas (Art. 20, §1º do CP)**\n\nO agente imagina uma situação de fato que, se existisse, tornaria sua ação legítima (ex.: legítima defesa putativa)."},
        {"tipo": "texto", "texto": "Escusável (invencível): isento de pena.\n\nInescusável (vencível): afasta o dolo, responde por culpa imprópria (crime culposo, se previsto)."},
        {"tipo": "conceito", "texto": "**Erro de Tipo Permissivo**\n\nErro sobre os pressupostos fáticos de uma causa de justificação (ligado às descriminantes putativas)."},
        {"tipo": "h3", "texto": "Erros Específicos: Pessoa, Execução, Resultado e Causa"},
        {"tipo": "atencao", "texto": "**Erro sobre a Pessoa (Error in Persona) – Art. 20, §3º**\n\nO agente, por erro, atinge pessoa diversa da visada, mas a ofensa é ao mesmo bem jurídico (ex.: pensa que é A e mata B)."},
        {"tipo": "texto", "texto": "Consequência: Erro sobre a pessoa não isenta de pena. Considera-se como se o crime tivesse sido praticado contra a pessoa visada (tipo penal e qualificadoras são determinados pela pessoa visada)."},
        {"tipo": "texto", "texto": "Exemplo: Se o agente queria matar o policial (vítima visada) mas mata o civil (vítima real), responde por homicídio qualificado pelo motivo, se a intenção era contra policial."},
        {"tipo": "atencao", "texto": "**Erro na Execução (Aberratio Ictus) – Art. 73**\n\nOcorre quando o agente, por erro na execução, atinge pessoa diversa da visada (ex.: atira em A, mas acerta B que estava ao lado)."},
        {"tipo": "texto", "texto": "Regra: Responde como se tivesse praticado o crime contra a pessoa visada (princípio da equivalência). Aplica-se a regra do erro sobre a pessoa."},
        {"tipo": "texto", "texto": "Diferença crucial: No *error in persona*, o erro é sobre a identidade (A era B). Na *aberratio ictus*, o erro é na pontaria (acerta quem não queria). A consequência penal é a mesma (responde como se fosse a vítima visada)."},
        {"tipo": "atencao", "texto": "**Resultado Diverso do Pretendido (Aberratio Criminis) – Art. 74**\n\nO agente, por erro na execução, atinge bem jurídico diverso do pretendido (ex.: queria matar A, mas a bala atinge um bem patrimonial, danificando um carro)."},
        {"tipo": "texto", "texto": "Regra: Responde pelo crime efetivamente ocorrido, se for culposo (previsão legal). Se houver dolo no resultado diverso, aplicam-se as regras do concurso de crimes."},
        {"tipo": "texto", "texto": "Exemplo: Atira em A para matar, mas erra e acerta o carro de B. Responde por dano culposo (se previsto) e pela tentativa de homicídio contra A."},
        {"tipo": "conceito", "texto": "**Aberratio Causae (Desvio no Nexo Causal)**\n\nO agente produz um resultado, mas por uma via causal diversa da imaginada (ex.: atira em A para matá-lo; A cai desacordado e morre afogado em um rio próximo)."},
        {"tipo": "texto", "texto": "Consequência: Não exclui o dolo, pois o resultado foi o pretendido. Aplica-se a teoria da equivalência dos antecedentes (art. 13) – responde pelo crime consumado, pois a causa do resultado era previsível e não rompe o nexo causal."},
        {"tipo": "h3", "texto": "Estado de Necessidade (Art. 24)"},
        {"tipo": "conceito", "texto": "**Espécies: Agressivo e Defensivo**\n\nDefensivo: O agente sacrifica bem jurídico do agressor para salvar bem próprio ou de outrem (ex.: atira no agressor para se salvar)."},
        {"tipo": "texto", "texto": "Agressivo: O agente sacrifica bem jurídico de terceiro inocente para salvar bem próprio ou de outrem (ex.: quebra a vidraça do vizinho para escapar de um incêndio)."},
        {"tipo": "conceito", "texto": "**Requisitos do Estado de Necessidade**\n\na) Perigo atual e iminente (não passado ou futuro);\n\nb) Perigo não causado voluntariamente pelo agente;\n\nc) Inevitabilidade do sacrifício (não havia outro meio menos gravoso);\n\nd) Proporcionalidade (razoabilidade) – o bem sacrificado não pode ser superior ao bem salvo (exige ponderação)."},
        {"tipo": "texto", "texto": "Excludente de ilicitude (art. 23, I)."},
        {"tipo": "texto", "texto": "Dever legal de enfrentar o perigo: O agente que tem dever legal de enfrentar o perigo (ex.: bombeiro, policial) não pode invocar estado de necessidade para se eximir da conduta."},
        {"tipo": "h3", "texto": "Legítima Defesa (Art. 25)"},
        {"tipo": "conceito", "texto": "**Requisitos da Legítima Defesa**\n\na) Agressão injusta (contrária ao direito);\n\nb) Agressão atual ou iminente (presente ou prestes a ocorrer);\n\nc) Defesa de direito próprio ou de terceiro;\n\nd) Uso moderado dos meios necessários para repelir a agressão."},
        {"tipo": "texto", "texto": "Excludente de ilicitude (art. 23, II)."},
        {"tipo": "conceito", "texto": "**Legítima Defesa de Terceiro e Sucessiva**\n\nDe terceiro: Qualquer pessoa pode agir em legítima defesa de outrem, mesmo sem autorização (art. 25, caput)."},
        {"tipo": "texto", "texto": "Sucessiva: Ocorre quando alguém, em legítima defesa, repele uma agressão, e o agressor, por sua vez, reage (excesso). A legítima defesa sucessiva é admitida para proteger o direito de quem está sendo vítima do excesso."},
        {"tipo": "atencao", "texto": "**Excesso na Legítima Defesa**\n\nExcesso doloso: O agente excede intencionalmente os limites da defesa, respondendo pelo excesso (crime doloso)."},
        {"tipo": "texto", "texto": "Excesso culposo: O agente excede por imprudência, negligência ou imperícia, respondendo por crime culposo (se houver previsão legal)."},
        {"tipo": "texto", "texto": "Excesso exculpante (escusável): O excesso é decorrente de erro inevitável (descriminante putativa). Exclui a culpabilidade se inevitável, ou reduz a pena se evitável (aplica-se o art. 20, §1º)."},
        {"tipo": "h3", "texto": "Estrito Cumprimento do Dever Legal e Exercício Regular do Direito"},
        {"tipo": "conceito", "texto": "**Estrito Cumprimento do Dever Legal (Art. 23, III)**\n\nO agente público (ou particular, em alguns casos) pratica o fato no exercício de um dever imposto por lei."},
        {"tipo": "texto", "texto": "Requisitos:"},
        {"tipo": "ul", "itens": ["Existência de lei que imponha o dever;", "A conduta deve ser estritamente necessária para o cumprimento;", "Observância dos limites legais (não pode haver excesso)."]},
        {"tipo": "texto", "texto": "Exemplos: Policial que efetua uma prisão em flagrante usando algemas (se necessário); oficial de justiça que arromba porta para cumprir mandado."},
        {"tipo": "conceito", "texto": "**Exercício Regular do Direito (Art. 23, III)**\n\nO agente pratica o fato no exercício de um direito reconhecido pelo ordenamento jurídico (ex.: direito de correção dos pais, direito de greve, direito de ação penal privada)."},
        {"tipo": "texto", "texto": "Consentimento do ofendido: É causa de exclusão da ilicitude quando o bem jurídico é disponível (ex.: lesões leves, dano a patrimônio alheio, desde que válido, livre e informado). O consentimento deve ser prévio ou contemporâneo ao fato. Para bens indisponíveis (vida), o consentimento não exclui a ilicitude (ex.: eutanásia)."},
        {"tipo": "h3", "texto": "Excesso Punível (Art. 23, Parágrafo Único)"},
        {"tipo": "atencao", "texto": "**Excesso Punível – Art. 23, parágrafo único**\n\nO excesso doloso ou culposo nas excludentes de ilicitude (estado de necessidade, legítima defesa, estrito cumprimento, exercício regular) é punível."},
        {"tipo": "texto", "texto": "Regra: O agente responde pelo excesso (crime praticado no excesso), não pela causa de justificação em si."},
        {"tipo": "texto", "texto": "Exemplo: O policial, ao efetuar a prisão, desfere 10 tiros após o suspeito já estar imobilizado. Responde pelo excesso doloso (homicídio qualificado ou lesão)."},
        {"tipo": "texto", "texto": "Excesso exculpante: Se o excesso for inevitável (erro escusável), exclui a culpabilidade."},
        {"tipo": "h3", "texto": "Coação Moral Irresistível e Obediência Hierárquica (Art. 22)"},
        {"tipo": "conceito", "texto": "**Coação Física vs. Moral**\n\nCoação Física (Vis Absoluta): O agente é usado como mero instrumento pela força física de outrem. Exclui a própria conduta (fato típico) → o coator responde pelo crime."},
        {"tipo": "texto", "texto": "Coação Moral Irresistível (Vis Relativa): O agente é coagido por ameaça grave, não tendo liberdade de escolha. Exclui a culpabilidade (art. 22). O coator também responde pelo crime."},
        {"tipo": "texto", "texto": "Consequência: Na coação moral irresistível, o coagido não comete crime (isento de pena); quem responde é o coator (art. 22, caput)."},
        {"tipo": "conceito", "texto": "**Obediência Hierárquica (Art. 22, §2º)**\n\nQuem pratica o fato em obediência a ordem hierárquica (superior) pode ter a culpabilidade excluída."},
        {"tipo": "texto", "texto": "Requisitos:"},
        {"tipo": "ul", "itens": ["A ordem deve ser legal e proferida por autoridade competente;", "Não deve ser manifestamente ilegal."]},
        {"tipo": "texto", "texto": "Ordem manifestamente ilegal: Se o subordinado cumpre ordem claramente criminosa (ex.: matar uma pessoa inocente), não exclui a culpabilidade, e tanto o superior quanto o subordinado respondem."},
        {"tipo": "texto", "texto": "Relação: Obediência a ordem legal se confunde com o estrito cumprimento do dever legal."},
        {"tipo": "h3", "texto": "Embriaguez (Art. 28)"},
        {"tipo": "conceito", "texto": "**Embriaguez Voluntária e Culposa**\n\nVoluntária (por vontade própria): Não exclui a imputabilidade (art. 28, II). O agente responde pelo crime, mesmo que completo, pois agiu com *actio libera in causa* (ação livre na causa)."},
        {"tipo": "texto", "texto": "Culposa (acidental, sem querer): Se o agente ingere álcool sem intenção (ex.: por erro, força maior, caso fortuito), a embriaguez é acidental."},
        {"tipo": "atencao", "texto": "**Embriaguez Acidental (Casual) – Art. 28, §1º**\n\nDecorre de caso fortuito ou força maior (ex.: medicamento que causa efeito inesperado; ingestão acidental de bebida alcoólica)."},
        {"tipo": "texto", "texto": "Completa: Se o agente estava completamente incapaz de entender o caráter ilícito do fato → exclui a imputabilidade (isento de pena, aplica-se medida de segurança, se necessário)."},
        {"tipo": "texto", "texto": "Incompleta: Se a capacidade estava apenas reduzida → redução de pena de 1/3 a 2/3 (sistema vicariante, equipara-se à semi-imputabilidade)."},
        {"tipo": "atencao", "texto": "**Embriaguez Preordenada (Art. 61, II, \"l\")**\n\nO agente se embriaga com a intenção de praticar o crime (dolo de se embriagar para ter coragem)."},
        {"tipo": "texto", "texto": "Consequência: Não exclui a imputabilidade e ainda configura circunstância agravante (art. 61, II, \"l\"), aumentando a pena."},
        {"tipo": "dica", "texto": "**Resumo da Embriaguez**\n\n📌 Voluntária → Não exclui (responde).\n\n📌 Culposa/Preordenada → Não exclui; preordenada ainda agrava.\n\n📌 Acidental Completa → Exclui imputabilidade (absolve ou medida de segurança).\n\n📌 Acidental Incompleta → Reduz de 1/3 a 2/3."},
        {"tipo": "h3", "texto": "Emoção, Paixão e Inexigibilidade de Conduta Diversa"},
        {"tipo": "conceito", "texto": "**Emoção e Paixão (Art. 28, I)**\n\nA emoção (comoção súbita) e a paixão (estado permanente) não excluem a imputabilidade (art. 28, I)."},
        {"tipo": "texto", "texto": "Consequências:"},
        {"tipo": "ul", "itens": ["Não isentam de pena;", "Podem funcionar como atenuante (art. 65, III, \"c\" – relevante valor moral ou social) ou, em alguns casos, configurar o homicídio privilegiado (art. 121, §1º – diminuição de 1/3 a 2/3 por relevante valor moral ou social, ou domínio de violenta emoção)."]},
        {"tipo": "texto", "texto": "Importante: Não se confunde com a inexigibilidade de conduta diversa, embora possam se conectar."},
        {"tipo": "conceito", "texto": "**Inexigibilidade de Conduta Diversa**\n\nÉ o terceiro elemento da culpabilidade (ao lado da imputabilidade e da potencial consciência da ilicitude). Ocorre quando, diante das circunstâncias, não se poderia exigir que o agente agisse de outra forma."},
        {"tipo": "texto", "texto": "Hipóteses clássicas:"},
        {"tipo": "ul", "itens": ["Coação moral irresistível (art. 22);", "Estado de necessidade (como excludente de culpabilidade, quando há inexigibilidade);", "Casos de medo, pavor ou perturbação psíquica intensa que, sem configurar doença mental, tornam impossível exigir conduta diversa (doutrina)."]},
        {"tipo": "texto", "texto": "Efeito: Exclui a culpabilidade → o agente é absolvido, pois não se pode reprovar sua conduta."}
      ]
    }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
