"""Valida integridade do dossiê sem depender da rede: python3 scripts/validar-dossie.py."""
import json
from pathlib import Path
import re
import subprocess
import tempfile
from urllib.parse import urlparse

page = Path(__file__).resolve().parents[1] / 'BRASIL-2022-2026-DOSSIE-REVISADO.html'
s = page.read_text()
data = json.loads(s.split('const D=', 1)[1].split(';\nconst FONTES=', 1)[0])
refs = json.loads(s.split('const FONTES=', 1)[1].split(';\nconst FOTOS=', 1)[0])
items = [v for t in data['T'] for v in t['v']]
assert len(data['T']) == 8 and sorted(v['id'] for v in items) == list(range(1, 27))
expected = ['reel/De2WM5PiLWn/', 'p/DeNmBKTRutN/', 'reel/De2dd8iP5hP/', 'reel/DewuvcTuCQy/', 'reel/De3FQzeDpKP/', 'reel/DeRyCn7RFAY/', 'p/DejxxseRGlH/', 'reel/DenGrOBg8q3/', 'reel/DexHBHgJxZg/', 'reel/DezR1JLRy-R/']
by_id = {v['id']: v for v in items}
for i, path in enumerate(expected, 1):
    assert by_id[i]['url'] == 'https://www.instagram.com/' + path
assert all(not v['url'] for v in items if v['id'] > 10)
for t in data['T']:
    for o in [t] + t['v'] + t['ex']:
        assert o.get('status') and all(k in refs for k in o['refs'])
for v in items:
    assert len(v['s']) == 3 and all(v['s'])
assert all(urlparse(r['url']).scheme == 'https' for r in refs.values())
assert not re.search(r'https?://[^\s\"\']*Exemplo|}nst D=', s)
with tempfile.TemporaryDirectory() as folder:
    js = Path(folder) / 'mapa.js'
    js.write_text(s.split('<script>', 1)[1].split('</script>', 1)[0])
    subprocess.run(['node', '--check', str(js)], check=True)
print(f'OK: 8 troncos, 26 itens únicos, 10 links originais, {len(refs)} fontes; JavaScript válido.')
