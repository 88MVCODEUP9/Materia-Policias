/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · penal · TOPICO 1
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 1 de penal.
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
      "id": "aplicacao-da-lei-penal-comum",
      "titulo": "Aplicação da Lei Penal Comum",
      "ordem": 1,
      "origem": "penal-md",
      "origemSecao": "aplicacao-da-lei-penal-comum",
      "blocos": [
        {"tipo": "h2", "texto": "Aplicação da Lei Penal Comum"},
        {"tipo": "texto", "texto": "Princípios fundamentais do Código Penal (legalidade, anterioridade, retroatividade), regras de territorialidade, tempo e lugar do crime, e interpretação da lei penal."},
        {"tipo": "h3", "texto": "Princípios Gerais da Lei Penal"},
        {"tipo": "conceito", "texto": "**Legalidade e Anterioridade (Art. 1º do CP)**\n\nNão há crime sem lei anterior que o defina, nem pena sem prévia cominação legal."},
        {"tipo": "texto", "texto": "Fundamento constitucional: Art. 5º, XXXIX, da CF/88."},
        {"tipo": "texto", "texto": "Alcance: A lei penal deve ser escrita, prévia, certa e estrita (vedada a analogia para criar crimes ou agravar penas)."},
        {"tipo": "conceito", "texto": "**Intervenção Mínima**\n\nO Direito Penal só deve atuar quando os demais ramos do Direito forem insuficientes para proteger o bem jurídico. É a última ratio do ordenamento jurídico."},
        {"tipo": "conceito", "texto": "**Fragmentariedade**\n\nO Direito Penal não protege todos os bens jurídicos, nem todas as lesões a um mesmo bem. Protege apenas os bens mais importantes, e apenas contra ofensas mais graves (lesões fragmentárias)."},
        {"tipo": "conceito", "texto": "**Subsidiariedade**\n\nA lei penal é subsidiária, atuando apenas quando as sanções de outros ramos (civil, administrativo) forem insuficientes para restaurar a ordem jurídica violada."},
        {"tipo": "conceito", "texto": "**Ofensividade (Lesividade)**\n\nSó há crime quando há efetiva lesão ou perigo concreto de lesão ao bem jurídico tutelado. Atos internos, pensamentos ou condutas que não atinjam o bem jurídico não são puníveis."},
        {"tipo": "atencao", "texto": "**Princípio da Insignificância (Bagatela)**\n\nO Direito Penal não deve intervir em lesões de mínima ofensividade, sem periculosidade social, com reduzido grau de reprovabilidade e sem expressividade da lesão jurídica (STF, HC 84.412)."},
        {"tipo": "texto", "texto": "Requisitos: Conduta de baixa lesividade, nulo conteúdo de perigo social, inexpressividade da lesão e reduzido grau de reprovabilidade."},
        {"tipo": "conceito", "texto": "**Humanidade**\n\nAs penas não podem ter caráter desumano ou degradante. Vedação a penas de morte (ressalvada a hipótese de guerra), perpétuas, de trabalhos forçados, de banimento e cruéis (CF, art. 5º, XLVII)."},
        {"tipo": "conceito", "texto": "**Individualização da Pena**\n\nA pena deve ser individualizada conforme as necessidades e características do condenado, observando-se as circunstâncias judiciais do art. 59 do CP e os critérios de fixação da pena-base."},
        {"tipo": "conceito", "texto": "**Culpabilidade**\n\nSó há crime se o agente agiu com dolo ou culpa. Não há responsabilidade penal objetiva. A culpabilidade é o juízo de reprovação sobre a conduta do agente, que deve ser imputável e ter potencial consciência da ilicitude."},
        {"tipo": "conceito", "texto": "**Proporcionalidade**\n\nA pena deve ser proporcional à gravidade do fato e à culpabilidade do agente. Proibição de penas desproporcionais, inclusive na aplicação da medida de segurança."},
        {"tipo": "h3", "texto": "Eficácia da Lei Penal no Tempo"},
        {"tipo": "conceito", "texto": "**Retroatividade da Lei Penal (Art. 2º do CP)**\n\nA lei penal não retroage, salvo para beneficiar o réu (lex mitior)."},
        {"tipo": "texto", "texto": "Lei intermediária (§1º): Se, entre a data do fato e o julgamento, surgir uma lei mais benéfica, aplica-se essa lei intermediária, ainda que não seja a mais nova."},
        {"tipo": "texto", "texto": "Lex tertia: Se a lei mais benéfica for revogada por outra mais severa, a lei intermediária prevalece para os fatos ocorridos durante sua vigência (STF)."},
        {"tipo": "texto", "texto": "Exceção: Leis temporárias e excepcionais (ultra-ativam-se)."},
        {"tipo": "atencao", "texto": "**Abolitio Criminis (Art. 2º, caput, 1ª parte)**\n\nOcorre quando uma lei nova deixa de considerar crime um fato anteriormente típico. A lei nova revoga a incriminação. Efeitos:"},
        {"tipo": "ul", "itens": ["Extinção da punibilidade (arquivamento do processo ou extinção da pena já cumprida);", "Retroage para beneficiar o agente, ainda que a decisão já tenha transitado em julgado."]},
        {"tipo": "atencao", "texto": "**Novatio Legis Incriminadora**\n\nLei nova que cria um crime onde antes não havia. Não retroage. Aplica-se apenas a fatos praticados após sua vigência."},
        {"tipo": "atencao", "texto": "**Novatio Legis In Pejus**\n\nLei nova que agrava a situação do réu (aumenta a pena, cria agravante, etc.). Não retroage."},
        {"tipo": "conceito", "texto": "**Novatio Legis In Mellius**\n\nLei nova que beneficia o réu (diminui a pena, extingue o crime, etc.). Retroage para atingir fatos anteriores, mesmo com trânsito em julgado (art. 2º, CP)."},
        {"tipo": "conceito", "texto": "**Combinação de Leis (Lex Tertia)**\n\nPossibilidade de combinar dispositivos de leis diferentes para formar uma norma mais benéfica ao réu. O STF e STJ admitem a combinação (teoria da lex tertia), desde que não haja uma nova norma que não exista em nenhuma das leis."},
        {"tipo": "atencao", "texto": "**Lei Temporária e Excepcional (Art. 3º do CP)**\n\nLeis criadas para períodos específicos (ex.: lei de guerra, lei de calamidade) ultra-ativam-se: mesmo após o término da vigência, continuam sendo aplicadas aos fatos ocorridos durante sua vigência, ainda que mais severas que a lei posterior."},
        {"tipo": "texto", "texto": "Exemplo: Lei que aumenta penas para crimes cometidos durante uma Copa do Mundo."},
        {"tipo": "h3", "texto": "Territorialidade"},
        {"tipo": "conceito", "texto": "**Territorialidade (Art. 5º do CP)**\n\nAplica-se a lei brasileira ao crime cometido em território nacional (teoria da territorialidade temperada)."},
        {"tipo": "texto", "texto": "Território por extensão: Solo, subsolo, espaço aéreo (até 100 km – limite de jurisdição), mar territorial (12 milhas náuticas) e águas interiores."},
        {"tipo": "texto", "texto": "Território por extensão (ficção): Embarcações e aeronaves brasileiras de natureza pública (ou a serviço do governo) onde quer que estejam;\n\nEmbarcações e aeronaves privadas brasileiras, se em alto-mar ou espaço aéreo correspondente (art. 5º, §1º)."},
        {"tipo": "conceito", "texto": "**Navios e Aeronaves Estrangeiros**\n\nNavios privados estrangeiros: Em alto-mar, aplica-se a lei do país da bandeira. Em águas jurisdicionais brasileiras, aplica-se a lei brasileira (soberania)."},
        {"tipo": "texto", "texto": "Aeronaves estrangeiras: Em espaço aéreo brasileiro, aplica-se a lei brasileira. Em alto-mar, a lei do país de matrícula."},
        {"tipo": "conceito", "texto": "**Passagem Inocente (Art. 5º, §2º)**\n\nNavios estrangeiros em passagem inocente pelo mar territorial brasileiro (sem escalas ou atividades hostis) não se sujeitam à jurisdição penal brasileira, salvo se o crime afetar a segurança ou a ordem pública brasileira."},
        {"tipo": "texto", "texto": "Exceção: Crimes cometidos a bordo, se não perturbarem a ordem pública, não são punidos pela lei brasileira."},
        {"tipo": "h3", "texto": "Extraterritorialidade"},
        {"tipo": "conceito", "texto": "**Extraterritorialidade Incondicionada (Art. 7º, I)**\n\nA lei brasileira aplica-se aos crimes cometidos no estrangeiro, independentemente de qualquer condição, quando:"},
        {"tipo": "texto", "texto": "a) Crimes contra a vida ou a liberdade do Presidente da República;"},
        {"tipo": "texto", "texto": "b) Crimes contra o patrimônio ou a fé pública da União, Estado, Distrito Federal ou Município;"},
        {"tipo": "texto", "texto": "c) Crimes contra a administração pública, por quem está a seu serviço;"},
        {"tipo": "texto", "texto": "d) Crimes de genocídio, quando o agente for brasileiro ou domiciliado no Brasil."},
        {"tipo": "conceito", "texto": "**Extraterritorialidade Condicionada (Art. 7º, II)**\n\nAplica-se a lei brasileira aos crimes cometidos no estrangeiro, mediante o preenchimento de certas condições, quando:"},
        {"tipo": "texto", "texto": "a) Crimes que, por tratado ou convenção, o Brasil se obrigou a reprimir;"},
        {"tipo": "texto", "texto": "b) Crimes praticados por brasileiro;"},
        {"tipo": "texto", "texto": "c) Crimes praticados em aeronaves ou embarcações brasileiras (quando não previstos no art. 5º, §1º)."},
        {"tipo": "texto", "texto": "Requisitos:"},
        {"tipo": "ul", "itens": ["O fato deve ser crime no país em que foi praticado;", "O fato deve ser crime no Brasil;", "O agente não pode ter sido absolvido no estrangeiro por falta de prova ou ter cumprido pena lá;", "A pena mínima prevista no Brasil deve ser superior a 1 ano (ou, sendo brasileiro, a pena mínima pode ser inferior a 1 ano)."]},
        {"tipo": "atencao", "texto": "**Hipóteses do Art. 7º**\n\nO art. 7º, I (incondicionada) e II (condicionada) traçam as hipóteses de extraterritorialidade."},
        {"tipo": "texto", "texto": "Punição no Brasil: O agente pode ser processado e julgado no Brasil, mesmo que já tenha sido processado no exterior (aplicação da pena, com dedução do tempo cumprido)."},
        {"tipo": "h3", "texto": "Tempo e Lugar do Crime"},
        {"tipo": "conceito", "texto": "**Tempo do Crime – Teoria da Atividade (Art. 4º do CP)**\n\nConsidera-se praticado o crime no momento da ação ou omissão, ainda que outro seja o momento do resultado."},
        {"tipo": "texto", "texto": "Exemplo: A remessa de uma carta falsa para outro país: o crime é praticado no local e data do envio, não no recebimento."},
        {"tipo": "conceito", "texto": "**Lugar do Crime – Teoria da Ubiquidade (Art. 6º do CP)**\n\nConsidera-se praticado o crime:"},
        {"tipo": "ul", "itens": ["No lugar da ação ou omissão (no todo ou em parte);", "Ou no lugar onde se produziu ou deveria produzir-se o resultado."]},
        {"tipo": "texto", "texto": "Regra: O juiz pode escolher qualquer desses lugares para fixar a competência."},
        {"tipo": "texto", "texto": "Exemplo: Uma pessoa atira de um país e mata em outro – ambos os países podem ser considerados locus delicti."},
        {"tipo": "dica", "texto": "**Mnemônico**\n\n📌 LUGAR → Ubiquidade (Art. 6º)\n\n📌 TEMPO → Atividade (Art. 4º)"},
        {"tipo": "h3", "texto": "Interpretação e Integração da Lei Penal"},
        {"tipo": "conceito", "texto": "**Interpretação Quanto ao Sujeito**\n\nAutêntica: Feita pelo próprio legislador (ex.: leis interpretativas)."},
        {"tipo": "texto", "texto": "Judicial: Feita pelos tribunais (jurisprudência)."},
        {"tipo": "texto", "texto": "Doutrinária: Feita pelos estudiosos do direito (doutrina)."},
        {"tipo": "conceito", "texto": "**Interpretação Quanto ao Resultado**\n\nDeclarativa: O sentido literal da lei coincide com a vontade do legislador."},
        {"tipo": "texto", "texto": "Restritiva: O sentido literal é mais amplo que a vontade da lei; restringe-se a aplicação."},
        {"tipo": "texto", "texto": "Extensiva: O sentido literal é mais restrito que a vontade da lei; amplia-se a aplicação (desde que não crie crime ou agrave pena)."},
        {"tipo": "atencao", "texto": "**Analogia**\n\nÉ admitida para preencher lacunas da lei penal, desde que em benefício do réu (analogia in bonam partem). É proibida para criar crimes ou agravar penas (art. 5º, XXXIX, CF)."},
        {"tipo": "texto", "texto": "Exemplo: A analogia pode ser usada para estender uma causa de diminuição de pena a casos semelhantes, mas não para criar uma agravante."},
        {"tipo": "h3", "texto": "Conflito Aparente de Normas"},
        {"tipo": "conceito", "texto": "**Conflito Aparente de Normas**\n\nOcorre quando duas ou mais normas penais aparentemente se aplicam a um mesmo fato. Para resolver, aplicam-se os princípios:"},
        {"tipo": "texto", "texto": "Especialidade: A norma especial prevalece sobre a geral (ex.: crime de homicídio qualificado prevalece sobre o homicídio simples)."},
        {"tipo": "texto", "texto": "Subsidiariedade: A norma subsidiária (mais ampla) só se aplica se a norma principal (mais específica) não for aplicável (ex.: o crime de lesão corporal é subsidiário do crime de homicídio)."},
        {"tipo": "texto", "texto": "Consunção (Absorção): A norma que descreve o crime-fim absorve a norma que descreve o crime-meio (ex.: o roubo absorve a lesão corporal leve)."},
        {"tipo": "texto", "texto": "Alternatividade: O crime pode ser praticado por várias condutas alternativas (ex.: ato obsceno, que pode ser praticado de várias formas)."},
        {"tipo": "atencao", "texto": "**Aplicação dos Princípios**\n\nA doutrina e a jurisprudência utilizam os princípios acima para resolver o conflito aparente de normas. A especialidade é o principal critério. A consunção é muito usada para crimes-meio e crime-fim. A subsidiariedade e a alternatividade têm aplicação mais restrita."},
        {"tipo": "texto", "texto": "🧠"}
      ]
    }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
