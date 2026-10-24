/* Tópicos complementares do edital. Os módulos já existentes são preservados. */
(function (global) {
  'use strict';
  var D = global.GMData;
  D.conteudoTeoria = D.conteudoTeoria || {};
  var modulo = D.conteudoTeoria["atualidades"] || (D.conteudoTeoria["atualidades"] = { materiaId: "atualidades", rotulo: "atualidades", fonteOriginal: 'Complemento de edital', assuntos: [] });
  modulo.assuntos = modulo.assuntos || [];
  var existentes = Object.create(null);
  modulo.assuntos.forEach(function (a) { existentes[a.id] = true; });
  [
  {
    "id": "politica-e-poder-publico",
    "titulo": "Política e poder público",
    "ordem": 1001,
    "editalComplementar": true,
    "origem": "edital-2026",
    "origemSecao": "politica-e-poder-publico",
    "blocos": [
      {
        "tipo": "h2",
        "texto": "Política e poder público"
      },
      {
        "tipo": "texto",
        "texto": "Tópico do edital dentro de Atualidades: fatos recentes de política, com foco nacional e internacional."
      },
      {
        "tipo": "destaque",
        "rotulo": "Como estudar",
        "titulo": "Matéria que expira",
        "texto": "Atualidades não se estuda de uma vez só. Este card marca o recorte do edital; o conteúdo muda até a data da prova. Releia o que foi publicado nos seis meses anteriores ao edital."
      }
    ]
  },
  {
    "id": "economia",
    "titulo": "Economia",
    "ordem": 1002,
    "editalComplementar": true,
    "origem": "edital-2026",
    "origemSecao": "economia",
    "blocos": [
      {
        "tipo": "h2",
        "texto": "Economia"
      },
      {
        "tipo": "texto",
        "texto": "Tópico do edital dentro de Atualidades: fatos recentes de economia, com foco nacional e internacional."
      },
      {
        "tipo": "destaque",
        "rotulo": "Como estudar",
        "titulo": "Matéria que expira",
        "texto": "Atualidades não se estuda de uma vez só. Este card marca o recorte do edital; o conteúdo muda até a data da prova. Releia o que foi publicado nos seis meses anteriores ao edital."
      }
    ]
  },
  {
    "id": "sociedade",
    "titulo": "Sociedade",
    "ordem": 1003,
    "editalComplementar": true,
    "origem": "edital-2026",
    "origemSecao": "sociedade",
    "blocos": [
      {
        "tipo": "h2",
        "texto": "Sociedade"
      },
      {
        "tipo": "texto",
        "texto": "Tópico do edital dentro de Atualidades: fatos recentes de sociedade, com foco nacional e internacional."
      },
      {
        "tipo": "destaque",
        "rotulo": "Como estudar",
        "titulo": "Matéria que expira",
        "texto": "Atualidades não se estuda de uma vez só. Este card marca o recorte do edital; o conteúdo muda até a data da prova. Releia o que foi publicado nos seis meses anteriores ao edital."
      }
    ]
  },
  {
    "id": "educacao",
    "titulo": "Educação",
    "ordem": 1004,
    "editalComplementar": true,
    "origem": "edital-2026",
    "origemSecao": "educacao",
    "blocos": [
      {
        "tipo": "h2",
        "texto": "Educação"
      },
      {
        "tipo": "texto",
        "texto": "Tópico do edital dentro de Atualidades: fatos recentes de educação, com foco nacional e internacional."
      },
      {
        "tipo": "destaque",
        "rotulo": "Como estudar",
        "titulo": "Matéria que expira",
        "texto": "Atualidades não se estuda de uma vez só. Este card marca o recorte do edital; o conteúdo muda até a data da prova. Releia o que foi publicado nos seis meses anteriores ao edital."
      }
    ]
  },
  {
    "id": "tecnologia",
    "titulo": "Tecnologia",
    "ordem": 1005,
    "editalComplementar": true,
    "origem": "edital-2026",
    "origemSecao": "tecnologia",
    "blocos": [
      {
        "tipo": "h2",
        "texto": "Tecnologia"
      },
      {
        "tipo": "texto",
        "texto": "Tópico do edital dentro de Atualidades: fatos recentes de tecnologia, com foco nacional e internacional."
      },
      {
        "tipo": "destaque",
        "rotulo": "Como estudar",
        "titulo": "Matéria que expira",
        "texto": "Atualidades não se estuda de uma vez só. Este card marca o recorte do edital; o conteúdo muda até a data da prova. Releia o que foi publicado nos seis meses anteriores ao edital."
      }
    ]
  },
  {
    "id": "energia",
    "titulo": "Energia",
    "ordem": 1006,
    "editalComplementar": true,
    "origem": "edital-2026",
    "origemSecao": "energia",
    "blocos": [
      {
        "tipo": "h2",
        "texto": "Energia"
      },
      {
        "tipo": "texto",
        "texto": "Tópico do edital dentro de Atualidades: fatos recentes de energia, com foco nacional e internacional."
      },
      {
        "tipo": "destaque",
        "rotulo": "Como estudar",
        "titulo": "Matéria que expira",
        "texto": "Atualidades não se estuda de uma vez só. Este card marca o recorte do edital; o conteúdo muda até a data da prova. Releia o que foi publicado nos seis meses anteriores ao edital."
      }
    ]
  },
  {
    "id": "relacoes-internacionais",
    "titulo": "Relações internacionais",
    "ordem": 1007,
    "editalComplementar": true,
    "origem": "edital-2026",
    "origemSecao": "relacoes-internacionais",
    "blocos": [
      {
        "tipo": "h2",
        "texto": "Relações internacionais"
      },
      {
        "tipo": "texto",
        "texto": "Tópico do edital dentro de Atualidades: fatos recentes de relações internacionais."
      },
      {
        "tipo": "destaque",
        "rotulo": "Como estudar",
        "titulo": "Matéria que expira",
        "texto": "Atualidades não se estuda de uma vez só. Este card marca o recorte do edital; o conteúdo muda até a data da prova. Releia o que foi publicado nos seis meses anteriores ao edital."
      }
    ]
  },
  {
    "id": "ecologia",
    "titulo": "Ecologia",
    "ordem": 1008,
    "editalComplementar": true,
    "origem": "edital-2026",
    "origemSecao": "ecologia",
    "blocos": [
      {
        "tipo": "h2",
        "texto": "Ecologia"
      },
      {
        "tipo": "texto",
        "texto": "Tópico do edital dentro de Atualidades: fatos recentes de ecologia, com foco nacional e internacional."
      },
      {
        "tipo": "destaque",
        "rotulo": "Como estudar",
        "titulo": "Matéria que expira",
        "texto": "Atualidades não se estuda de uma vez só. Este card marca o recorte do edital; o conteúdo muda até a data da prova. Releia o que foi publicado nos seis meses anteriores ao edital."
      }
    ]
  },
  {
    "id": "desenvolvimento-sustentavel",
    "titulo": "Desenvolvimento sustentável",
    "ordem": 1009,
    "editalComplementar": true,
    "origem": "edital-2026",
    "origemSecao": "desenvolvimento-sustentavel",
    "blocos": [
      {
        "tipo": "h2",
        "texto": "Desenvolvimento sustentável"
      },
      {
        "tipo": "texto",
        "texto": "Tópico do edital dentro de Atualidades: fatos recentes de desenvolvimento sustentável, com foco nacional e internacional."
      },
      {
        "tipo": "destaque",
        "rotulo": "Como estudar",
        "titulo": "Matéria que expira",
        "texto": "Atualidades não se estuda de uma vez só. Este card marca o recorte do edital; o conteúdo muda até a data da prova. Releia o que foi publicado nos seis meses anteriores ao edital."
      }
    ]
  }
].forEach(function (assunto) { if (!existentes[assunto.id]) modulo.assuntos.push(assunto); });
})(window);
