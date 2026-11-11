"""Classifica parágrafos de leitura sem alterar o texto dos materiais."""
from pathlib import Path
import re
from collections import Counter
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
RULES = [
    ('artigo', r'^[“"\s]*Art\.?\s*\d'),
    ('dispositivo-paragrafo', r'^(?:§|Parágrafo\s+único)'),
    ('inciso', r'^[IVXLCDM]+\s*[-–—.)]'),
    ('alinea', r'^[a-z]\s*\)'),
]

def organizar(fragment, counts):
    def paragraph(match):
        attrs, body = match.groups()
        if re.search(r'\bclass\s*=', attrs):
            return match.group(0)
        text = BeautifulSoup(body, 'html.parser').get_text(' ', strip=True)
        if not text:
            return match.group(0)
        kind = next((kind for kind, rule in RULES if re.match(rule, text, re.I if kind == 'dispositivo-paragrafo' else 0)), 'texto')
        counts[kind] += 1
        return f'<p{attrs} class="leitura-paragrafo leitura-{kind}">{body}</p>'
    return re.sub(r'<p\b([^>]*)>(.*?)</p>', paragraph, fragment, flags=re.S)

if __name__ == '__main__':
    counts = Counter()
    changed = 0
    for file in sorted(ROOT.rglob('*.html')):
        original = file.read_text()
        updated = re.sub(r'<article\b[^>]*class="[^"]*\bprose\b[^"]*"[^>]*>.*?</article>', lambda m: organizar(m.group(0), counts), original, flags=re.S)
        # A classificação não pode remover, acrescentar nem reordenar conteúdo.
        before = BeautifulSoup(original, 'html.parser')
        after = BeautifulSoup(updated, 'html.parser')
        assert before.get_text() == after.get_text(), file
        assert len(before.select('p')) == len(after.select('p')), file
        if updated != original:
            file.write_text(updated)
            changed += 1
    print(f'{changed} HTMLs atualizados; parágrafos: {dict(counts)}')
