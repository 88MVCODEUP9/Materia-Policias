"""Organiza divisões explícitas dos materiais, preservando texto e ordem."""
from pathlib import Path
import re
from collections import Counter
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
MARKER = re.compile(r'^(?:[-•–]\s+|\d+[.)]\s+|[IVXLCDM]+\s*[-–—]\s+|[a-z]\)\s+)')

def normalized(soup):
    return re.sub(r'\s+', '', soup.get_text())

def organize(fragment, counts):
    soup = BeautifulSoup(fragment, 'html.parser')
    for p in list(soup.select('p')):
        if p.find_parent(['pre', 'code', 'td', 'th']) or 'symbol' in p.get('class', []):
            continue
        # Só divide quebras explícitas; nunca adivinha onde termina uma frase.
        if p.find('br', recursive=False):
            groups = [[]]
            for child in list(p.contents):
                if child.name == 'br':
                    groups.append([])
                else:
                    groups[-1].append(child)
            groups = [g for g in groups if ''.join(str(x) for x in g).strip()]
            if len(groups) < 2:
                continue
            texts = [BeautifulSoup(''.join(str(x) for x in g), 'html.parser').get_text(' ', strip=True) for g in groups]
            marker_count = sum(bool(MARKER.match(t)) for t in texts)
            container = soup.new_tag('div', attrs={'class': 'texto-organizado'})
            active_list = None
            for index, group in enumerate(groups):
                if marker_count >= 2 and MARKER.match(texts[index]):
                    if active_list is None:
                        active_list = soup.new_tag('ol' if re.match(r'^\d+[.)]', texts[index]) else 'ul', attrs={'class':'lista-organizada'})
                        container.append(active_list)
                        counts['listas'] += 1
                    block = soup.new_tag('li')
                    active_list.append(block)
                    counts['itens'] += 1
                else:
                    active_list = None
                    block = soup.new_tag('p', attrs={'class': 'linha-organizada'})
                    container.append(block)
                    counts['paragrafos'] += 1
                for child in group:
                    block.append(child.extract())
            p.replace_with(container)
            counts['blocos_divididos'] += 1
    # Rótulos isolados já presentes no material passam a ser subtítulos.
    for p in list(soup.select('p')):
        meaningful = [c for c in p.contents if str(c).strip()]
        if (len(meaningful) == 1 and getattr(meaningful[0], 'name', None) in ('strong', 'b')
                and len(p.get_text(strip=True)) <= 120
                and not p.find_parent(['li','td','th','figure'])
                and not any(c in p.get('class',[]) for c in ['muted','card-kicker','lei-versao'])):
            p.name = 'h4'
            p['class'] = ['topico-organizado']
            counts['subtitulos'] += 1
    return str(soup)

if __name__ == '__main__':
    counts = Counter()
    changed = 0
    for file in sorted(ROOT.rglob('*.html')):
        original = file.read_text()
        updated = re.sub(r'<article\b[^>]*class="[^"]*\bprose\b[^"]*"[^>]*>.*</article>', lambda m: organize(m.group(0), counts), original, flags=re.S)
        assert normalized(BeautifulSoup(original, 'html.parser')) == normalized(BeautifulSoup(updated, 'html.parser')), file
        if updated != original:
            file.write_text(updated)
            changed += 1
    print(f'{changed} arquivos atualizados: {dict(counts)}')
