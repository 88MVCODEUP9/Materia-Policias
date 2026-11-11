"""Aplica estilos por disciplina e organiza linhas sem modificar a redação."""
from pathlib import Path
from bs4 import BeautifulSoup
import re
from collections import Counter
ROOT = Path(__file__).resolve().parent.parent
COUNTS = Counter()
TITLES = {'Frações equivalentes', 'Simplificação', 'Soma e subtração', 'Multiplicação', 'Divisão', 'Adição', 'Subtração', 'Propriedades', 'Fórmula', 'Resolução', 'Exemplo', 'Exemplos', 'Cálculo', 'Aplicação'}

def norm(text):
    return re.sub(r'\s+', '', BeautifulSoup(text, 'html.parser').get_text())

def paragraph(match, subject):
    attrs, body = match.groups()
    text = BeautifulSoup(body, 'html.parser').get_text(' ', strip=True)
    if not text or 'card-kicker' in attrs or 'muted' in attrs:
        return match.group(0)
    if subject == 'matematica' and text in TITLES:
        COUNTS['subtitulos'] += 1
        return f'<h4 class="topico-matematica">{body}</h4>'
    # Só separa frases em texto puro; preserva marcação inline e decimais.
    parts = [body]
    if subject == 'matematica' and '<' not in body and len(text) > 150:
        parts = re.split(r'(?<=\.)\s+(?=[A-ZÁÉÍÓÚΔ\d])', body)
    output = []
    for part in parts:
        content = BeautifulSoup(part, 'html.parser').get_text(' ', strip=True)
        extra = []
        if re.match(r'^(?:Exemplo|Ex\s*\.):', content, re.I):
            extra.append('exemplo-linha')
        if subject in ('matematica', 'raciocinio-logico') and len(content) < 230 and re.search(r'[=≡↔⇒]|[∧∨¬].*[∧∨¬]', content):
            extra.append('calculo-linha')
        new_attrs = attrs
        if extra:
            if re.search(r'class="', new_attrs):
                new_attrs = re.sub(r'class="([^"]*)"', lambda m: 'class="' + ' '.join(dict.fromkeys(m[1].split() + extra)) + '"', new_attrs, count=1)
            else:
                new_attrs += ' class="' + ' '.join(extra) + '"'
            COUNTS['linhas_destacadas'] += 1
        if subject == 'matematica' and '<' not in part:
            def fraction(m):
                COUNTS['fracoes'] += 1
                return f'<span class="fracao"><span class="numerador">({m[1]})</span><span class="barra-fracao">/</span><span class="denominador">({m[2]})</span></span>'
            part = re.sub(r'\(([\d𝑎𝑏abcxyz +−-]{1,15})\)/\(([\d𝑎𝑏abcxyz +−-]{1,15})\)', fraction, part)
        output.append(f'<p{new_attrs}>{part}</p>')
    COUNTS['frases_separadas'] += len(parts)-1
    return '\n'.join(output)

if __name__ == '__main__':
    for subject in ('matematica','informatica','raciocinio-logico'):
        for file in sorted((ROOT/subject).glob('*.html')):
            original=file.read_text()
            updated=re.sub(r'<p\b([^>]*)>(.*?)</p>', lambda m: paragraph(m,subject), original, flags=re.S)
            updated=re.sub(r'(<div\b[^>]*class="study-card"[^>]*)(>)', lambda m: m[1] + (' data-conteudo="exemplo"' if 'data-conteudo=' not in m[1] and re.search(r'data-study-(?:kind|label)="[Ee]xemplo"',m[1]) else '') + m[2], updated)
            link=f'<link rel="stylesheet" href="{subject}.css?v=20261106-1"/>'
            if link not in updated:
                updated=updated.replace('</head>',link+'\n</head>',1)
            assert norm(original)==norm(updated),file
            file.write_text(updated)
            COUNTS['htmls']+=1
    print(dict(COUNTS))
