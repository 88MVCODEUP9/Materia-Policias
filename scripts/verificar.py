#!/usr/bin/env python3
"""Verificação sem dependências: links locais e contratos do gerador."""
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit,unquote
from gerar import ROOT,MATERIAS,category,block,prose,clean,safe_path
class Links(HTMLParser):
 def __init__(self):super().__init__();self.urls=[]
 def handle_starttag(self,tag,attrs):
  for key,value in attrs:
   if key in ('href','src') and value:self.urls.append(value)
def main():
 catalog=json.loads((ROOT/'dados/catalogo.json').read_text());ds=json.loads((ROOT/'dados/disciplinas.json').read_text())
 sources=list({i['pagina'] for i in catalog})
 assert len({i['id'] for i in catalog})==len(catalog),'IDs duplicados no catálogo'
 missing=[p for p in sources if not (ROOT/p).exists()]
 assert not missing,'HTML ausente: '+', '.join(missing)
 pages=[ROOT/'index.html',ROOT/'componentes.html']+[MATERIAS/d['id']/'index.html' for d in ds]+[ROOT/p for p in {i['pagina'] for i in catalog}]
 errors=[]
 for page in pages:
  parser=Links();parser.feed(page.read_text())
  for address in parser.urls:
   parts=urlsplit(address)
   if parts.scheme or parts.netloc or not parts.path:continue
   target=(page.parent/unquote(parts.path)).resolve()
   if not target.exists():errors.append(f'{page.relative_to(ROOT)}: {address}')
 assert not errors,'Links ausentes:\n'+'\n'.join(errors)
 assert category({'tipo':'destaque','rotulo':'Conceito','texto':'lei resumo questão'})=='teoria'
 assert category({'tipo':'lei'})=='legislacao'
 assert category({'tipo':'destaque','rotulo':'Bizu'})=='resumo'
 assert category({'tipo':'questao'})=='questoes'
 assert '<script' not in clean('<script>alert(1)</script><p onclick="x">Texto</p>')
 assert 'javascript:' not in clean('<a href="javascript:alert(1)">X</a>')
 assert '<table>' in prose('| A | B |\n|---|---|\n| um | dois |')
 assert '&lt;script&gt;' in prose('<script>')
 try:block({'tipo':'questao','alternativas':['A'],'correta':5})
 except ValueError:pass
 else:raise AssertionError('Gabarito inválido aceito')
 try:safe_path('../escape')
 except ValueError:pass
 else:raise AssertionError('Caminho inseguro aceito')
 print(f'OK: {len(pages)} páginas, {len(sources)} assuntos, {len(catalog)} materiais; links locais e contratos de renderização verificados.')
if __name__=='__main__':main()
