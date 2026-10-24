/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · penal · TOPICO 4
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 4 de penal.
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
      "id": "concurso-de-pessoas-e-concurso-de-crimes",
      "titulo": "Concurso de Pessoas e Concurso de Crimes",
      "ordem": 4,
      "origem": "penal-md",
      "origemSecao": "concurso-de-pessoas-e-concurso-de-crimes",
      "blocos": [
        {"tipo": "h2", "texto": "Concurso de Pessoas e Concurso de Crimes"},
        {"tipo": "texto", "texto": "Regras do concurso de agentes (Arts. 29 a 31), autoria, participação, comunicabilidade, e do concurso de crimes (Arts. 69 a 71 do CP), com diferenças, sistemas de aplicação da pena e limites legais."},
        {"tipo": "h3", "texto": "Concurso de Pessoas – Requisitos e Fundamentos"},
        {"tipo": "conceito", "texto": "**Requisitos do Concurso de Pessoas**\n\n1. Pluralidade de agentes: dois ou mais sujeitos envolvidos.\n\n2. Relevância causal das condutas: cada participação deve ter contribuído de forma relevante para o resultado (mesmo que moralmente).\n\n3. Liame subjetivo (vínculo psicológico): acordo, ajuste ou consciência da colaboração (dolo de participação).\n\n4. Identidade da infração penal: todos os agentes devem ter ciência do mesmo fato típico (não exige que o crime seja exatamente o mesmo na forma, mas que haja unidade de desígnios)."},
        {"tipo": "conceito", "texto": "**Teoria Monista (Art. 29 do CP)**\n\nAdotada pelo Código Penal: todos os que concorrem para o crime incidem nas mesmas penas, na medida de sua culpabilidade."},
        {"tipo": "texto", "texto": "Autor: quem executa a conduta típica ou tem o domínio do fato.\n\nPartícipe: quem induz, instiga ou auxilia (moral ou materialmente)."},
        {"tipo": "texto", "texto": "Pena do partícipe: a mesma do autor, reduzida na medida de sua participação."},
        {"tipo": "h3", "texto": "Autoria – Espécies e Modalidades"},
        {"tipo": "conceito", "texto": "**Espécies de Autoria**\n\nAutor direto (imediato): realiza pessoalmente a conduta típica.\n\nAutor mediato: utiliza outra pessoa como instrumento (ex.: coação física, erro de tipo).\n\nCoautor: executa a conduta em comunhão com outros, dividindo as tarefas.\n\nAutor intelectual: planeja, organiza ou incita, mas não executa materialmente (quando sua contribuição é tão relevante que se equipara à autoria, ou quando o tipo penal exige qualidade especial – ex.: crime próprio).\n\nAutor de escritório (domínio da organização): quem exerce o poder de decisão em estruturas organizacionais (ex.: chefes de organização criminosa), mesmo sem executar, responde como autor (teoria do domínio do fato – aceita pela jurisprudência)."},
        {"tipo": "conceito", "texto": "**Autoria Colateral e Incerta**\n\nAutoria colateral: duas ou mais pessoas, sem acordo, realizam condutas que causam o mesmo resultado. Cada um responde pelo seu ato (não há liame subjetivo)."},
        {"tipo": "texto", "texto": "Autoria incerta: quando não se pode identificar qual dos agentes causou o resultado (ex.: dois atiradores, uma só bala fatal, sem acordo entre eles).\n\nRegra: Sendo impossível determinar o autor do resultado, a doutrina e a jurisprudência majoritárias não imputam o resultado consumado a todos. Cada agente responde, em regra, por tentativa do crime, salvo se houver prova de que ambos concorreram para o resultado (teoria da equivalência, mas com necessidade de comprovação do nexo). Se houver dolo comum (acordo), aí sim responde o grupo pelo resultado (aplica-se a teoria monista)."},
        {"tipo": "h3", "texto": "Participação – Espécies e Regras Especiais"},
        {"tipo": "conceito", "texto": "**Espécies de Participação**\n\nInduzimento: influência intelectual que leva alguém a decidir cometer o crime (cria a ideia).\n\nInstigação: reforço ou estímulo à decisão já existente (encoraja).\n\nAuxílio material: ajuda concreta para a execução (ex.: fornecer arma, transportar).\n\nAuxílio moral: apoio psicológico, promessa de ajuda posterior."},
        {"tipo": "atencao", "texto": "**Participação de Menor Importância (Art. 29, §1º)**\n\nSe a participação for de menor importância (contribuição ínfima ou irrelevante), a pena pode ser reduzida de 1/6 a 1/3, mesmo que o crime se consume."},
        {"tipo": "texto", "texto": "Exemplo: O agente que apenas vigia a entrada, mas não tem influência direta no resultado."},
        {"tipo": "atencao", "texto": "**Cooperação Dolosamente Distinta (Art. 29, §2º)**\n\nOcorre quando o partícipe quer um crime menos grave, mas o autor pratica crime mais grave."},
        {"tipo": "texto", "texto": "Regra: O partícipe responde pelo crime que pretendeu (desde que não houvesse previsibilidade do resultado mais grave). Se o resultado mais grave era previsível, responde pelo mais grave (teoria da previsibilidade objetiva)."},
        {"tipo": "texto", "texto": "Exemplo: A instiga B a dar uma \"surra\" em C (lesão corporal), mas B acaba matando C. Se A não previa a morte, responde por lesão corporal; se a morte era previsível, responde por homicídio culposo ou doloso, a depender."},
        {"tipo": "conceito", "texto": "**Participação Impunível (Art. 31 do CP)**\n\nNão são puníveis a instigação, o auxílio ou a determinação quando o crime sequer chega a ser tentado (ou seja, não há início de execução). O art. 31: \"O ajuste, a determinação ou instigação e o auxílio, salvo disposição expressa em contrário, não são puníveis, se o crime não chega, pelo menos, a ser tentado.\""},
        {"tipo": "texto", "texto": "Exceção: se a lei prevê a punição autônoma da participação (ex.: associação criminosa – art. 288)."},
        {"tipo": "h3", "texto": "Comunicabilidade e Circunstâncias"},
        {"tipo": "conceito", "texto": "**Comunicabilidade das Circunstâncias (Art. 30 do CP)**\n\nCircunstâncias e condições de caráter pessoal não se comunicam, salvo se forem elementares do crime."},
        {"tipo": "texto", "texto": "Exemplos de incomunicáveis: reincidência, menoridade, motivo torpe ou fútil (se for circunstância pessoal), a condição de funcionário público no peculato (para o extraneus)."},
        {"tipo": "texto", "texto": "Quando se comunicam? Se a circunstância for elementar constitutiva do crime (ex.: no peculato, a qualidade de funcionário público é elementar; se o partícipe sabe da condição, responde pelo mesmo crime, mas a condição não se comunica ao partícipe – ele responde como partícipe do crime, não como autor)."},
        {"tipo": "texto", "texto": "Regra prática: As condições pessoais se comunicam apenas se inerentes ao tipo e conhecidas do partícipe."},
        {"tipo": "h3", "texto": "Crimes Plurissubjetivos"},
        {"tipo": "conceito", "texto": "**Concurso Necessário vs. Eventual**\n\nConcurso necessário: o crime exige, para sua configuração, a participação de dois ou mais agentes (ex.: rixa – art. 137, bigamia – art. 235). A ausência de pluralidade descaracteriza o tipo."},
        {"tipo": "texto", "texto": "Concurso eventual: o crime pode ser praticado por um único agente, mas admite concurso (ex.: homicídio, furto). A pluralidade é acidental."},
        {"tipo": "h3", "texto": "Concurso de Crimes – Visão Geral e Sistemas"},
        {"tipo": "conceito", "texto": "**Sistemas de Aplicação da Pena**\n\nSistema do cúmulo material: soma-se as penas de todos os crimes (art. 69).\n\nSistema da exasperação: aplica-se a pena do crime mais grave, com aumento proporcional (art. 70 e 71)."},
        {"tipo": "texto", "texto": "Regra: O sistema da exasperação é exceção à regra da soma (aplicável no concurso formal, próprio, e no crime continuado)."},
        {"tipo": "h3", "texto": "Concurso Material (Art. 69)"},
        {"tipo": "conceito", "texto": "**Concurso Material – Conceito e Espécies**\n\nConceito: Várias ações (ou omissões) independentes → vários crimes. A pena é obtida pela soma das penas de cada crime (cúmulo material)."},
        {"tipo": "texto", "texto": "Espécies:"},
        {"tipo": "ul", "itens": ["Homogêneo: todos os crimes são da mesma espécie (ex.: dois furtos).", "Heterogêneo: crimes de espécies diversas (ex.: um furto e uma lesão corporal)."]},
        {"tipo": "texto", "texto": "Limite: Não há teto máximo na soma (pode ultrapassar 30 anos, se for o caso)."},
        {"tipo": "h3", "texto": "Concurso Formal (Art. 70)"},
        {"tipo": "conceito", "texto": "**Concurso Formal – Conceito e Diferenças**\n\nConceito: Uma única ação (ou omissão) → vários crimes."},
        {"tipo": "texto", "texto": "Espécies:"},
        {"tipo": "ul", "itens": ["Próprio (ou perfeito): sem desígnios autônomos (dolo único, ação única e resultado múltiplo, sem vontade de atingir vários). Aplica-se a exasperação: pena do crime mais grave + aumento de 1/6 a 1/2.", "Ex.: Um único tiro, com dolo de matar uma pessoa, mas a bala acerta duas (sem intenção de matar a segunda).", "Impróprio (ou imperfeito): com desígnios autônomos (dolo direto para cada resultado, embora a ação seja uma só). Aplica-se o cúmulo material (soma das penas).", "Ex.: Agente dispara uma rajada única para matar A e B, querendo a morte de ambos."]},
        {"tipo": "texto", "texto": "📌 Correção importante: No JSON original, a classificação estava invertida. Agora está corrigida conforme o art. 70 e a doutrina majoritária."},
        {"tipo": "h3", "texto": "Crime Continuado (Art. 71)"},
        {"tipo": "conceito", "texto": "**Crime Continuado – Conceito e Requisitos**\n\nConceito: Vários crimes da mesma espécie, praticados em condições semelhantes de tempo, lugar e maneira de execução, de modo que os subsequentes são considerados continuação do primeiro."},
        {"tipo": "texto", "texto": "Requisitos:"},
        {"tipo": "ul", "itens": ["Mesma espécie: crimes que ofendem o mesmo bem jurídico e têm a mesma estrutura típica (ex.: furtos, homicídios).", "Condições semelhantes: tempo (proximidade cronológica, mas não necessariamente imediata), lugar (mesmo contexto) e maneira de execução (mesmo modus operandi)."]},
        {"tipo": "texto", "texto": "Espécies:"},
        {"tipo": "ul", "itens": ["Comum: aplicável a qualquer crime, desde que preenchidos os requisitos.", "Específico (ou qualificado): previsto para crimes contra o patrimônio (art. 71, §1º, com redação dada pela Lei 13.964/2019 – Pacote Anticrime) quando as vítimas são diferentes e a violência é grave, o aumento pode ser de 1/6 a 1/3 (Súmula 443 do STJ já consolidava essa limitação)."]},
        {"tipo": "texto", "texto": "Pena: aplica-se a pena de um só crime (ou a mais grave), com aumento de 1/6 a 2/3."},
        {"tipo": "texto", "texto": "Limite: a pena final não pode ultrapassar a soma das penas que seriam aplicadas no concurso material (art. 71, parágrafo único)."},
        {"tipo": "h3", "texto": "Comparativo e Diferenças entre os Concursos"},
        {"tipo": "tabela", "colunas": ["Critério", "Concurso Material", "Concurso Formal", "Crime Continuado"], "linhas": [["Ações", "Várias", "Uma só", "Várias"], ["Crimes", "Vários", "Vários", "Vários (mesma espécie)"], ["Sistema", "Soma (cúmulo)", "Exasperação (próprio) ou Soma (impróprio)", "Exasperação (aumento de 1/6 a 2/3)"], ["Limite", "Sem teto (soma integral)", "–", "Não pode superar a soma do material"]], "compacta": true},
        {"tipo": "dica", "texto": "**Comparativo Rápido**"},
        {"tipo": "conceito", "texto": "**Diferenças Práticas**\n\nMaterial: pluralidade de ações e de crimes → soma.\n\nFormal: unidade de ação → pode ser soma (se desígnios autônomos) ou exasperação (se dolo único).\n\nContinuado: pluralidade de ações e de crimes, mas com vínculo de continuidade (mesma espécie, semelhantes) → exasperação."},
        {"tipo": "texto", "texto": "Exemplo prático:"},
        {"tipo": "ul", "itens": ["Furta um carro hoje e outro amanhã = continuado (mesma espécie, mesmo modus) → exasperação.", "Furta hoje e estupra amanhã = material → soma.", "Um tiro mata dois (sem querer o segundo) = formal próprio → exasperação.", "Um tiro mata dois (querendo ambos) = formal impróprio → soma."]}
      ]
    }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
