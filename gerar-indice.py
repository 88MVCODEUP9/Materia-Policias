#!/usr/bin/env python3
"""Gera assets/js/data/materias/topicos-indice.js a partir das pastas de tópicos.

O navegador não consegue listar diretórios quando a página é aberta por
file:// (duplo clique no index.html). Nesse caso o carregador usa este índice
como alternativa ao fetch da listagem.

Uso:  python3 gerar-indice.py
"""
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
MATERIAS = RAIZ / 'assets' / 'js' / 'data' / 'materias'
ARQ_SAIDA = MATERIAS / 'topicos-indice.js'
VALIDA = re.compile(r'^[a-zA-Z0-9_-]+\.js$')

# mesmo ordenamento usado pelo carregador no navegador
def ordem(nome):
    return [int(p) if p.isdigit() else p for p in re.split(r'(\d+)', nome)]


def main():
    indice = {}
    for pasta in sorted(MATERIAS.glob('*/topicos')):
        materia = pasta.parent.name
        arquivos = sorted(
            (a.name for a in pasta.iterdir() if a.is_file() and VALIDA.match(a.name)),
            key=ordem,
        )
        indice[materia] = arquivos

    linhas = [f'  {materia!r}: [{", ".join(repr(a) for a in arquivos)}],'
              for materia, arquivos in indice.items()]
    conteudo = (
        '/* Gerado por gerar-indice.py — nao editar a mao.\n'
        '   Lista os .js de cada pasta de topicos para o carregador funcionar\n'
        '   mesmo quando a pagina e aberta por file:// (sem listagem de pasta). */\n'
        'window.GMIndiceTopicos = {\n'
        + '\n'.join(linhas)
        + '\n};\n'
    )
    ARQ_SAIDA.write_text(conteudo, encoding='utf-8')
    total = sum(len(a) for a in indice.values())
    print(f'topicos-indice.js: {len(indice)} materias, {total} topicos')


if __name__ == '__main__':
    main()
