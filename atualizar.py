#!/usr/bin/env python3
"""
ATUALIZAR O SITE — rode este arquivo sempre que adicionar um assunto novo.

Como adicionar um assunto:
  1. Crie um arquivo .html com o NOME DO ASSUNTO, por exemplo:
         Crimes contra a Honra.html      (ou crimes-contra-a-honra.html)
  2. Coloque dentro da pasta da matéria correta:  Materias/direito-penal/
  3. Pronto. (No GitHub o site se atualiza sozinho; no computador, o
     iniciar-site.sh já roda este script antes de abrir o site.)

O arquivo pode ser só o CONTEÚDO (parágrafos, <h2>, listas, tabelas...) —
o script coloca o menu, o visual e os botões do site em volta.
Se o arquivo já for uma página completa (com <html>), ela é mantida como está.

O script também refaz sozinho: lista da matéria, página inicial, contagens,
busca, botões "Anterior/Próximo" e dados/catalogo.json.
"""
import html, json, math, re, sys, unicodedata
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / 'scripts'))
import gerar  # reaproveita o visual e os modelos já existentes

MATERIAS = ROOT / 'Materias'
MINUSCULAS = {'a', 'as', 'o', 'os', 'e', 'de', 'da', 'das', 'do', 'dos', 'em', 'na', 'nas', 'no', 'nos',
              'para', 'por', 'com', 'ao', 'aos', 'à', 'às', 'ou', 'um', 'uma'}


def natural(texto):
    return [int(p) if p.isdigit() else p.lower() for p in re.split(r'(\d+)', texto)]


def titulo_do_arquivo(stem):
    if re.search(r'[A-ZÁÉÍÓÚÂÊÔÃÕÇ]', stem):          # já foi escrito com maiúsculas: respeita
        return re.sub(r'[-_]+', ' ', stem).strip()
    palavras = re.sub(r'[-_]+', ' ', stem).split()
    return ' '.join(p if (i and p in MINUSCULAS) else p.capitalize() for i, p in enumerate(palavras))


def sem_tags(texto):
    return html.unescape(re.sub(r'<[^>]+>', ' ', texto)).strip()


def eh_fragmento(texto):
    return not re.search(r'<html[\s>]|<!doctype', texto, re.I)


def titulo_da_pagina(texto):
    m = re.search(r'<h1[^>]*>(.*?)</h1>', texto, re.S | re.I)
    if m and sem_tags(m[1]):
        return ' '.join(sem_tags(m[1]).split())
    m = re.search(r'<title[^>]*>(.*?)</title>', texto, re.S | re.I)
    if m:
        return ' '.join(sem_tags(m[1]).split()).split(' · ')[0]
    return ''


def tipos_da_pagina(texto):
    achados = re.findall(r'<section class="content-block[^>]*data-type="(\w+)"', texto)
    tipos = [t for t in gerar.TYPES if t in achados]
    if not tipos and 'class="question"' in texto:
        tipos.append('questoes')
    return tipos or ['teoria']


def embrulhar(fragmento, titulo, disc, ds, pagina_url):
    """Coloca o conteúdo puro dentro do visual do site."""
    m = re.search(r'<h1[^>]*>.*?</h1>', fragmento, re.S | re.I)
    if m:                                             # o título já aparece no cabeçalho
        titulo = ' '.join(sem_tags(m[0]).split()) or titulo
        fragmento = fragmento.replace(m[0], '', 1)
    fragmento = re.sub(r'<(/?)h1\b', r'<\1h2', fragmento, flags=re.I)
    toc, n = [], [0]

    def marcar(m):                                    # m: 1=tag (h2/h3), 2=atributos, 3=texto
        n[0] += 1
        achou = re.search(r'id="([^"]+)"', m[2])
        ident = achou[1] if achou else 'sec-%d' % n[0]
        atributos = m[2] if achou else (m[2] + ' id="%s"' % ident)
        toc.append('<a data-type="teoria" href="#%s">%s</a>' % (ident, html.escape(' '.join(sem_tags(m[3]).split()))))
        return '<%s%s>%s</%s>' % (m[1], atributos, m[3], m[1])
    fragmento = re.sub(r'<(h[23])(\b[^>]*)>(.*?)</\1>', marcar, fragmento, flags=re.S | re.I)
    minutos = max(1, math.ceil(len(re.findall(r'\w+', sem_tags(fragmento))) / 200))
    controles = ('<div class="filters" role="group" aria-label="Filtrar blocos do assunto"><button class="filter" data-type="" aria-pressed="true">'
                 'Assunto completo</button></div>')
    corpo = ('<nav class="breadcrumbs" aria-label="Caminho"><a href="../../index.html">Biblioteca</a> / <a href="index.html">'
             + html.escape(disc['nome']) + '</a> / Assunto</nav><header class="reader-header"><a class="chip" href="index.html">'
             + html.escape(disc['nome']) + '</a><h1>' + html.escape(titulo) + '</h1><p class="muted">' + str(minutos) + ' min de leitura</p></header>'
             '<div class="reader-actions"><button id="concluir" data-key="' + html.escape(pagina_url) + '" aria-pressed="false">Marcar como estudado</button>'
             '<button id="imprimir">Imprimir / salvar PDF</button><span class="status" id="salvamento" role="status"></span></div>'
             + controles + '<p class="status" id="blocos-status" role="status"></p><div class="reader-layout"><article class="prose">'
             '<section class="content-block study-card" data-study-kind="assunto" data-type="teoria" id="bloco-0">' + fragmento
             + '</section></article><aside class="toc" aria-label="Nesta página"><p class="eyebrow">NESTA AULA</p><strong>Roteiro de leitura</strong>'
             + ''.join(toc) + '</aside></div><nav class="bottom-nav" aria-label="Assuntos anterior e próximo"></nav>')
    return gerar.shell(titulo, corpo, ds, '../../', disc['id'], disc_prefix='../')


def navegacao(vizinhos, i):
    anterior = ('<a class="prev" href="%s"><small>← Anterior</small>%s</a>' % (vizinhos[i - 1]['href'], html.escape(vizinhos[i - 1]['titulo']))
                if i else '<span></span>')
    proximo = ('<a class="next" href="%s"><small>Próximo →</small>%s</a>' % (vizinhos[i + 1]['href'], html.escape(vizinhos[i + 1]['titulo']))
               if i + 1 < len(vizinhos) else '')
    return '<nav class="bottom-nav" aria-label="Assuntos anterior e próximo">' + anterior + proximo + '</nav>'


def main():
    ds = json.loads((ROOT / 'dados/disciplinas.json').read_text(encoding='utf-8'))
    conhecidas = {d['id'] for d in ds}
    for pasta in sorted(p for p in MATERIAS.iterdir() if p.is_dir() and p.name not in conhecidas):
        if any(pasta.glob('*.html')):
            print('AVISO: a pasta "%s" não é uma matéria cadastrada em dados/disciplinas.json — ignorada.' % pasta.name)

    itens, novos, total = [], [], 0
    for d in ds:
        pasta = MATERIAS / d['id']
        arquivos = sorted((f for f in pasta.glob('*.html') if f.name != 'index.html'), key=lambda f: natural(f.name))
        paginas = []
        for f in arquivos:
            texto = f.read_text(encoding='utf-8')
            url_rel = 'Materias/%s/%s' % (d['id'], quote(f.name))
            if eh_fragmento(texto):
                titulo = titulo_do_arquivo(f.stem)
                texto = embrulhar(texto, titulo, d, ds, url_rel)
                f.write_text(texto, encoding='utf-8')
                novos.append('%s/%s' % (d['id'], f.name))
            paginas.append({'arquivo': f, 'href': quote(f.name), 'url': url_rel, 'texto': texto,
                            'titulo': titulo_da_pagina(texto) or titulo_do_arquivo(f.stem), 'tipos': tipos_da_pagina(texto)})
        for i, p in enumerate(paginas):                # Anterior / Próximo sempre em dia
            atual = re.sub(r'<nav class="bottom-nav"[^>]*>.*?</nav>', lambda _: navegacao(paginas, i), p['texto'], count=1, flags=re.S)
            if atual != p['texto']:
                p['arquivo'].write_text(atual, encoding='utf-8')
            for tipo in p['tipos']:
                itens.append({'id': '%s/%s/%s' % (d['id'], p['arquivo'].stem, tipo), 'titulo': p['titulo'], 'disciplina': d['id'],
                              'nomeDisciplina': d['nome'], 'tipo': tipo, 'pagina': p['url']})
        total += len(paginas)

    (ROOT / 'index.html').write_text(gerar.shell('Biblioteca', gerar.listing(itens, ds), ds, disc_prefix='Materias/'), encoding='utf-8')
    for d in ds:
        (MATERIAS / d['id'] / 'index.html').write_text(
            gerar.shell(d['nome'], gerar.listing(itens, ds, d), ds, '../../', d['id'], disc_prefix='../'), encoding='utf-8')
    (ROOT / 'dados/catalogo.json').write_text(json.dumps(itens, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    for n in novos:
        print('  + novo assunto publicado:', n)
    print('Site atualizado: %d assuntos em %d matérias.' % (total, len(ds)))


if __name__ == '__main__':
    main()
