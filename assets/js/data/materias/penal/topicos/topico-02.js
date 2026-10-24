/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · penal · TOPICO 2
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 2 de penal.
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
      "id": "teoria-do-crime",
      "titulo": "Teoria do Crime",
      "ordem": 2,
      "origem": "penal-md",
      "origemSecao": "teoria-do-crime",
      "blocos": [
        {"tipo": "h2", "texto": "Teoria do Crime"},
        {"tipo": "texto", "texto": "Conceitos material, formal e analítico de crime, infração penal, conduta (teorias causal, finalista e social), omissão, resultado, nexo causal, tipicidade, dolo, culpa, consumação, crime impossível, classificações doutrinárias e iter criminis."},
        {"tipo": "h3", "texto": "Conceito de Crime e Infração Penal"},
        {"tipo": "conceito", "texto": "**Conceitos Material, Formal e Analítico**\n\nMaterial: Crime é todo fato humano lesivo a um bem jurídico penalmente relevante (lesividade social)."},
        {"tipo": "texto", "texto": "Formal: Crime é toda conduta descrita na lei como infração (adequação ao tipo legal)."},
        {"tipo": "texto", "texto": "Analítico (Tripartite - majoritária): Crime é fato típico, ilícito e culpável."},
        {"tipo": "texto", "texto": "Bipartite (minoritária): Crime é fato típico e ilícito (culpabilidade como pressuposto de aplicação da pena)."},
        {"tipo": "conceito", "texto": "**Crime vs. Contravenção Penal**\n\nCrime: Penas de reclusão ou detenção; ação penal pública incondicionada (regra) ou privada; regras do Código Penal (Parte Geral aplicável)."},
        {"tipo": "texto", "texto": "Contravenção: Penas de prisão simples (sem regime fechado) ou multa; ação penal pública incondicionada (regra); regidas pela Lei de Contravenções Penais (Decreto-Lei 3.688/41)."},
        {"tipo": "texto", "texto": "Diferenças práticas:"},
        {"tipo": "ul", "itens": ["Contravenção não admite prisão em flagrante convertida em preventiva? (exige fiança);", "Prazos prescricionais menores;", "Não se aplica o princípio da insignificância da mesma forma (STJ restringe)."]},
        {"tipo": "h3", "texto": "Conduta e Teorias"},
        {"tipo": "conceito", "texto": "**Teorias da Conduta**\n\nTeoria Causal (Naturalista): Conduta é um movimento corporal voluntário (ação) ou omissão, com produção de um resultado. Não há valoração, apenas relação de causalidade. Crítica: separa dolo e culpa, tratando-os como mera culpabilidade."},
        {"tipo": "texto", "texto": "Teoria Finalista (adotada pelo CP/42): Conduta é a ação ou omissão humana dirigida a uma finalidade (dolo natural). O dolo e a culpa integram o tipo penal (fato típico), e não apenas a culpabilidade."},
        {"tipo": "texto", "texto": "Teoria Social: Conduta é a ação ou omissão humana que produz uma consequência socialmente relevante. Valoriza o contexto social do comportamento."},
        {"tipo": "conceito", "texto": "**Ação e Omissão**\n\nAção: Comportamento humano positivo (fazer algo proibido pela lei)."},
        {"tipo": "texto", "texto": "Omissão: Comportamento negativo (não fazer algo que a lei ordenava). Subdivide-se em:"},
        {"tipo": "ul", "itens": ["Omissão própria (crime omissivo puro): descumprimento de um dever genérico de agir (ex.: omissão de socorro - art. 135 do CP).", "Omissão imprópria (comissivo por omissão): descumprimento de um dever especial de garantidor (art. 13, §2º)."]},
        {"tipo": "h3", "texto": "Crimes Omissivos e Garantidor"},
        {"tipo": "conceito", "texto": "**Crimes Omissivos Próprios e Impróprios**\n\nPróprios (Puros): A lei descreve uma conduta de não fazer. Basta a inércia do agente. Ex.: Omissão de socorro (art. 135). Não admitem tentativa, pois ou se omite ou não se omite."},
        {"tipo": "texto", "texto": "Impróprios (Comissivos por Omissão): O agente tem o dever de evitar o resultado, mas se omite, respondendo como se tivesse praticado a ação. Ex.: A mãe que deixa de alimentar o filho, causando-lhe a morte (homicídio por omissão)."},
        {"tipo": "atencao", "texto": "**Garantidor (Art. 13, §2º do CP)**\n\nA omissão é penalmente relevante quando o omitente devia e podia agir para evitar o resultado. Têm o dever de garantia:"},
        {"tipo": "texto", "texto": "a) Quem tem obrigação legal de cuidado, proteção ou vigilância (pais, tutores, curadores);"},
        {"tipo": "texto", "texto": "b) Quem, de outra forma, assumiu a responsabilidade de impedir o resultado (ex.: segurança de boate, salva-vidas);"},
        {"tipo": "texto", "texto": "c) Quem, com seu comportamento anterior, criou o risco da ocorrência do resultado (ingerência)."},
        {"tipo": "h3", "texto": "Resultado e Nexo Causal"},
        {"tipo": "conceito", "texto": "**Resultado Naturalístico e Jurídico**\n\nNaturalístico: Modificação no mundo exterior perceptível, exigida em crimes materiais (ex.: a morte no homicídio, a lesão corporal)."},
        {"tipo": "texto", "texto": "Jurídico: Lesão ou perigo de lesão ao bem jurídico tutelado. Presente em todo crime, inclusive nos de mera conduta (ex.: porte de arma – o resultado jurídico é a ofensa à segurança pública)."},
        {"tipo": "conceito", "texto": "**Nexo Causal (Art. 13 do CP)**\n\nRelação de causa e efeito entre a conduta e o resultado naturalístico. O CP adotou a Teoria da Equivalência dos Antecedentes (Conditio Sine Qua Non): é causa toda ação ou omissão sem a qual o resultado não teria ocorrido."},
        {"tipo": "texto", "texto": "Causas Supervenientes (Art. 13, §1º):"},
        {"tipo": "ul", "itens": ["Relativamente independentes: Interrompem o nexo causal apenas se por si só produziram o resultado (ex.: causa que agravou o estado da vítima). Responde pela conduta anterior se o resultado decorrer do risco criado.", "Absolutamente independentes: Não guardam relação com a conduta do agente. Excluem o nexo causal (ex.: terremoto que mata a vítima após o tiro não letal)."]},
        {"tipo": "h3", "texto": "Tipicidade"},
        {"tipo": "conceito", "texto": "**Tipicidade Formal, Material e Conglobante**\n\nFormal: A conduta se amolda perfeitamente à descrição abstrata da lei penal (adequação formal ao tipo)."},
        {"tipo": "texto", "texto": "Material: A conduta, além de se adequar à lei, deve ser socialmente lesiva e ofensiva ao bem jurídico (princípio da lesividade)."},
        {"tipo": "texto", "texto": "Conglobante (Doutrina de Zaffaroni): A tipicidade exige a verificação do sentido da norma no ordenamento como um todo. A conduta deve ser contrária ao sistema normativo, não apenas à letra da lei."},
        {"tipo": "conceito", "texto": "**Adequação Típica**\n\nImediata (Direta): A conduta se subsume diretamente ao tipo penal (ex.: matar alguém = homicídio)."},
        {"tipo": "texto", "texto": "Mediata (Indireta ou Subsidiária): Ocorre quando há um conflito aparente de normas. Ex.: lesão corporal subsidiária em relação à tentativa de homicídio."},
        {"tipo": "h3", "texto": "Dolo e Culpa"},
        {"tipo": "conceito", "texto": "**Dolo (Art. 18, I do CP)**\n\nVontade e consciência de realizar a conduta típica. Espécies:"},
        {"tipo": "texto", "texto": "Direto (Determinado): O agente quer e busca o resultado (ex.: atirar para matar)."},
        {"tipo": "texto", "texto": "Eventual (Indeterminado): O agente assume o risco de produzir o resultado (ex.: atirar para o alto em via pública, assumindo o risco de matar alguém)."},
        {"tipo": "texto", "texto": "Alternativo: O agente prevê dois resultados possíveis e quer qualquer um deles (ex.: atirar contra A ou B, indiferente a quem atinge)."},
        {"tipo": "texto", "texto": "Genérico (Dolo natural): Vontade de praticar a conduta, sem elemento subjetivo específico (presente na maioria dos crimes)."},
        {"tipo": "texto", "texto": "Específico (Elemento subjetivo do tipo): O agente quer um resultado além do dolo, previsto expressamente no tipo (ex.: no furto, a intenção de \"para si ou para outrem\")."},
        {"tipo": "conceito", "texto": "**Culpa (Art. 18, II do CP)**\n\nConduta involuntária, por imprudência, negligência ou imperícia."},
        {"tipo": "texto", "texto": "Modalidades:"},
        {"tipo": "ul", "itens": ["Imprudência: conduta comissiva perigosa (ex.: dirigir em alta velocidade).", "Negligência: conduta omissiva, descuido (ex.: deixar arma ao alcance de crianças).", "Imperícia: falta de habilidade técnica (ex.: médico que opera de forma inadequada)."]},
        {"tipo": "texto", "texto": "Espécies:"},
        {"tipo": "ul", "itens": ["Culpa Consciente: O agente prevê o resultado, mas acredita que não ocorrerá (ex.: ultrapassar em local proibido).", "Culpa Inconsciente: O agente não prevê o resultado, mas deveria prevê-lo.", "Culpa Própria: O resultado é involuntário e não há dolo.", "Culpa Imprópria (Excesso culposo): O agente pratica uma conduta inicialmente dolosa (ex.: legítima defesa), mas causa um resultado por culpa no excesso."]},
        {"tipo": "h3", "texto": "Consumação e Crime Impossível"},
        {"tipo": "conceito", "texto": "**Espécies de Crime quanto à Consumação**\n\nMaterial: Exige a produção do resultado naturalístico para a consumação. Ex.: Homicídio (morte), Furto (posse da coisa)."},
        {"tipo": "texto", "texto": "Formal: A lei prevê um resultado naturalístico, mas a consumação ocorre com a conduta, independentemente deste resultado. Ex.: Extorsão mediante sequestro (art. 159) – consuma-se com a exigência, mesmo que não receba o resgate."},
        {"tipo": "texto", "texto": "Mera Conduta: A lei não exige resultado naturalístico. A consumação se dá com a simples ação ou omissão. Ex.: Desobediência (art. 330), Porte de arma."},
        {"tipo": "atencao", "texto": "**Crime Impossível (Art. 17 do CP)**\n\nÉ a tentativa inidônea, quando, por ineficácia absoluta do meio ou impropriedade absoluta do objeto, é impossível a consumação do crime."},
        {"tipo": "texto", "texto": "Efeito: O agente não responde pelo crime (é isento de pena)."},
        {"tipo": "texto", "texto": "Exemplos:"},
        {"tipo": "ul", "itens": ["Ineficácia absoluta do meio: usar veneno que não faz efeito para matar.", "Impropriedade absoluta do objeto: atirar em um cadáver (pensando ser pessoa viva)."]},
        {"tipo": "texto", "texto": "📌 Atenção: Para a doutrina majoritária, trata-se de causa de atipicidade absoluta. Se o meio/objeto são relativamente ineficazes/impróprios, pode configurar tentativa (aplicação da pena reduzida)."},
        {"tipo": "h3", "texto": "Classificação dos Crimes"},
        {"tipo": "dica", "texto": "**Principais Classificações Doutrinárias**\n\n📌 Quanto ao sujeito:"},
        {"tipo": "ul", "itens": ["Comum: qualquer pessoa pode praticar.", "Próprio: exige sujeito ativo qualificado (ex.: peculato – funcionário público).", "Mão-própria: conduta só pode ser praticada pelo próprio agente (ex.: falso testemunho)."]},
        {"tipo": "texto", "texto": "📌 Quanto ao resultado:"},
        {"tipo": "ul", "itens": ["Material: exige resultado naturalístico.", "Formal: consumação na conduta, independente do resultado.", "Mera conduta: não exige resultado naturalístico."]},
        {"tipo": "texto", "texto": "📌 Quanto à duração da consumação:"},
        {"tipo": "ul", "itens": ["Instantâneo: consumação se esgota em um momento (ex.: homicídio).", "Permanente: consumação se prolonga no tempo (ex.: sequestro).", "Instantâneo de efeitos permanentes: consumação instantânea, mas os efeitos são duradouros (ex.: lesão corporal que deixa cicatriz)."]},
        {"tipo": "texto", "texto": "📌 Quanto à forma de execução:"},
        {"tipo": "ul", "itens": ["Comissivo: ação.", "Omissivo: omissão (próprio ou impróprio)."]},
        {"tipo": "texto", "texto": "📌 Quanto ao elemento subjetivo:"},
        {"tipo": "ul", "itens": ["Doloso: vontade de realizar o tipo.", "Culposo: sem vontade, por negligência, imprudência ou imperícia."]},
        {"tipo": "texto", "texto": "📌 Quanto aos atos executórios:"},
        {"tipo": "ul", "itens": ["Unissubsistente: único ato executório (ex.: injúria verbal).", "Plurissubsistente: vários atos executórios (ex.: furto, homicídio)."]},
        {"tipo": "texto", "texto": "📌 Quanto à complexidade:"},
        {"tipo": "ul", "itens": ["Simples: ofende um único bem jurídico.", "Complexo: fusão de dois ou mais crimes (ex.: roubo = furto + coação/lesão)."]},
        {"tipo": "texto", "texto": "📌 Quanto ao número de sujeitos:"},
        {"tipo": "ul", "itens": ["Monossubjetivo: pode ser praticado por um único agente.", "Plurissubjetivo (concurso necessário): exige pluralidade de agentes (ex.: rixa, bigamia)."]},
        {"tipo": "h3", "texto": "Iter Criminis, Tentativa e Crimes que não a admitem"},
        {"tipo": "conceito", "texto": "**Fases do Iter Criminis**\n\n1. Cogitação: idealização do crime – não punível.\n\n2. Preparação: atos preparatórios – regra: não puníveis (exceções: crimes de perigo abstrato ou quando a lei pune a preparação, ex.: associação criminosa).\n\n3. Execução: início da realização do tipo – início da punibilidade.\n\n4. Consumação: todos os elementos do tipo se aperfeiçoam."},
        {"tipo": "conceito", "texto": "**Tentativa (Art. 14, II do CP)**\n\nO agente inicia a execução do crime, mas não o consuma por circunstâncias alheias à sua vontade."},
        {"tipo": "texto", "texto": "Espécies:"},
        {"tipo": "ul", "itens": ["Acabada (perfeita): esgota todos os atos executórios, mas o resultado não ocorre.", "Inacabada (imperfeita): interrompe a execução antes da prática de todos os atos."]},
        {"tipo": "texto", "texto": "Pena: reduzida de 1/3 a 2/3 em relação ao crime consumado."},
        {"tipo": "texto", "texto": "Exceção: A tentativa é punível apenas nos crimes dolosos (art. 14, II)."},
        {"tipo": "conceito", "texto": "**Desistência e Arrependimento (Art. 15 e 16)**\n\nDesistência Voluntária (Art. 15): O agente interrompe a execução por vontade própria. Responde apenas pelos atos já praticados."},
        {"tipo": "texto", "texto": "Arrependimento Eficaz (Art. 15): O agente já executou, mas, por vontade própria, impede o resultado. Responde apenas pelos atos já praticados."},
        {"tipo": "texto", "texto": "Arrependimento Posterior (Art. 16): O crime já foi consumado (sem violência ou grave ameaça). O agente repara o dano ou restitui a coisa até o recebimento da denúncia. A pena é reduzida de 1/3 a 2/3."},
        {"tipo": "atencao", "texto": "**Crimes que NÃO admitem Tentativa**\n\nA tentativa só é possível nos crimes dolosos e que exijam uma progressão fática. Não se admite nos seguintes casos:"},
        {"tipo": "texto", "texto": "a) Crimes culposos (não há vontade de resultado)."},
        {"tipo": "texto", "texto": "b) Crimes habituais (a prática reiterada é elemento do tipo, ex.: curandeirismo – art. 284)."},
        {"tipo": "texto", "texto": "c) Crimes omissivos próprios (basta a inércia, não há execução a ser interrompida)."},
        {"tipo": "texto", "texto": "d) Crimes preterdolosos (dolo na conduta anterior e culpa no resultado; não há dolo no resultado final)."},
        {"tipo": "texto", "texto": "e) Crimes unissubsistentes (a execução se esgota em um único ato, ex.: injúria verbal)."},
        {"tipo": "texto", "texto": "f) Crimes de mera conduta e formais (para alguns doutrinadores, em tese admitem tentativa, mas a depender da estrutura do tipo; a regra geral é que crimes que não exigem resultado naturalístico podem ser tentados se a execução for fracionável, mas tradicionalmente se lista os omissivos próprios e unissubsistentes como os mais pacíficos)."}
      ]
    }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
