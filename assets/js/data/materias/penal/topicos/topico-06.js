/* ==========================================================================
   CARREIRAS POLICIAIS · DATA · penal · TOPICO 6
   --------------------------------------------------------------------------
   Gerado automaticamente. Tópico 6 de penal.
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
      "id": "crimes-patrimoniais-furto-e-roubo",
      "titulo": "Crimes Patrimoniais (Furto e Roubo)",
      "ordem": 6,
      "origem": "penal-md",
      "origemSecao": "crimes-patrimoniais-furto-e-roubo",
      "blocos": [
        {"tipo": "h2", "texto": "Crimes Patrimoniais (Furto e Roubo)"},
        {"tipo": "texto", "texto": "Análise dos crimes de furto (Art. 155) e roubo (Art. 157), com foco na diferença entre eles, consumação, tentativa, qualificadoras e privilégios."},
        {"tipo": "h3", "texto": "Furto (Art. 155 do CP)"},
        {"tipo": "conceito", "texto": "**Furto Simples**\n\nSubtrair, para si ou para outrem, coisa móvel alheia. Pena: reclusão de 1 a 4 anos + multa."},
        {"tipo": "texto", "texto": "Bem jurídico: patrimônio."},
        {"tipo": "texto", "texto": "Elemento subjetivo: dolo + intenção de assenhoramento definitivo (animus domini)."},
        {"tipo": "conceito", "texto": "**Furto Privilegiado (§2º)**\n\nSe o agente é primário e a coisa é de pequeno valor, o juiz pode substituir a pena privativa de liberdade por restritiva de direitos, ou reduzir a pena de 1/3 a 2/3, ou aplicar somente a multa."},
        {"tipo": "texto", "texto": "Requisitos cumulativos: primariedade + pequeno valor (STJ: valor não superior a 1/4 do salário mínimo)."},
        {"tipo": "conceito", "texto": "**Furto Qualificado (§4º)**\n\nSe o crime é cometido com:"},
        {"tipo": "ul", "itens": ["Destruição ou rompimento de obstáculo;", "Abuso de confiança;", "Escalada;", "Chave falsa;", "Concurso de duas ou mais pessoas."]},
        {"tipo": "texto", "texto": "Pena: reclusão de 2 a 8 anos + multa."},
        {"tipo": "texto", "texto": "Furto qualificado pelo emprego de explosivo (§4º-A, incluído pela Lei 13.964/2019): reclusão de 4 a 10 anos + multa."},
        {"tipo": "conceito", "texto": "**Furto de Uso**\n\nQuando o agente pega a coisa para usar e devolver, sem intenção definitiva de se apropriar. Em regra, não configura furto (ausência de animus domini)."},
        {"tipo": "conceito", "texto": "**Consumação e Tentativa (Teoria da Amotio)**\n\nConsumação: o furto consuma-se quando a coisa sai da esfera de vigilância da vítima, ainda que por pouco tempo (STF).\n\nTentativa: inicia a execução, mas não consegue concluir a subtração por circunstâncias alheias à sua vontade."},
        {"tipo": "h3", "texto": "Roubo (Art. 157 do CP)"},
        {"tipo": "conceito", "texto": "**Roubo Simples**\n\nSubtrair coisa móvel alheia, para si ou para outrem, mediante violência ou grave ameaça à pessoa. Pena: reclusão de 4 a 10 anos + multa."},
        {"tipo": "texto", "texto": "Bens jurídicos: patrimônio + integridade física + liberdade."},
        {"tipo": "texto", "texto": "Diferença crucial para o furto: a violência ou ameaça."},
        {"tipo": "conceito", "texto": "**Roubo Qualificado (§2º)**\n\nSe o roubo é cometido com:"},
        {"tipo": "ul", "itens": ["Concurso de duas ou mais pessoas;", "Uso de arma de fogo (ou arma branca, mas o STJ entende que qualquer arma pode qualificar);", "Resultado de lesão corporal grave ou morte (latrocínio, §3º)."]},
        {"tipo": "texto", "texto": "Pena: reclusão de 7 a 15 anos (para as qualificadoras do §2º) e de 20 a 30 anos para o latrocínio (§3º)."},
        {"tipo": "conceito", "texto": "**Latrocínio (Art. 157, §3º)**\n\nRoubo seguido de morte (homicídio doloso)."},
        {"tipo": "texto", "texto": "Pena: reclusão de 20 a 30 anos."},
        {"tipo": "texto", "texto": "Natureza: crime hediondo."},
        {"tipo": "texto", "texto": "Diferença para homicídio qualificado: no latrocínio, a morte é meio para subtração ou ocorre durante o roubo; no homicídio, a morte é o fim."},
        {"tipo": "texto", "texto": "Tentativa de latrocínio: admite-se se a morte não ocorrer ou se a subtração não se consumar."},
        {"tipo": "atencao", "texto": "**Pegadinha sobre roubo e furto**\n\n❌ 'No roubo, a violência ou ameaça pode ser posterior à subtração.' → ERRADO. Para ser roubo, a violência ou ameaça deve ser anterior ou concomitante à subtração, para garantir a impunidade ou a posse da coisa (art. 157, §1º, excepciona a violência posterior, mas ainda é roubo)."},
        {"tipo": "texto", "texto": "❌ 'O roubo privilegiado existe.' → NÃO. O roubo não tem privilégio, ao contrário do furto."},
        {"tipo": "h3", "texto": "Princípio da Insignificância"},
        {"tipo": "conceito", "texto": "**Insignificância (Bagatela)**\n\nÉ um critério de interpretação que afasta a tipicidade material quando a conduta é de mínima ofensividade, sem periculosidade social, com reduzido grau de reprovabilidade e inexpressiva lesão jurídica (STF)."},
        {"tipo": "texto", "texto": "Requisitos (STF):"},
        {"tipo": "ul", "itens": ["Mínima ofensividade;", "Nenhuma periculosidade social;", "Reduzido grau de reprovabilidade;", "Inexpressividade da lesão jurídica."]},
        {"tipo": "texto", "texto": "Efeito: o fato é atípico – não há crime."},
        {"tipo": "texto", "texto": "Aplicação: é mais comum em furtos de pequeno valor, mas não se aplica a crimes violentos, nem a crimes contra a administração pública, nem a crimes militares (restritamente)."}
      ]
    }
  ].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
  
})(window);
