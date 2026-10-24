#!/usr/bin/env python3
"""Verificação sem dependências: links locais e contratos do gerador."""
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit,unquote
from gerar import ROOT,MATERIAS,category,block,prose,clean,safe_path,role,mnemonic_html,memory_html,is_memory_block,render_block,unique
class Links(HTMLParser):
 def __init__(self):super().__init__();self.urls=[];self.ids=[];self.stack=[];self.errors=[]
 def handle_starttag(self,tag,attrs):
  if tag not in ('area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'):self.stack.append(tag)
  for key,value in attrs:
   if key=='id':self.ids.append(value)
   if key in ('href','src') and value:self.urls.append(value)
 def handle_endtag(self,tag):
  if self.stack and self.stack[-1]==tag:self.stack.pop()
  else:self.errors.append(tag)
class VisibleText(HTMLParser):
 def __init__(self):super().__init__();self.parts=[]
 def handle_data(self,text):self.parts.append(text)
def text_of(content):
 parser=VisibleText();parser.feed(content);return ''.join(parser.parts)

def main():
 catalog=json.loads((ROOT/'dados/catalogo.json').read_text());ds=json.loads((ROOT/'dados/disciplinas.json').read_text())
 sources=list({i['pagina'] for i in catalog})
 assert len({i['id'] for i in catalog})==len(catalog),'IDs duplicados no catálogo'
 missing=[p for p in sources if not (ROOT/p).exists()]
 assert not missing,'HTML ausente: '+', '.join(missing)
 pages=[ROOT/'index.html',ROOT/'componentes.html']+[MATERIAS/d['id']/'index.html' for d in ds]+[ROOT/p for p in {i['pagina'] for i in catalog}]
 errors=[];parsed={}
 for page in pages:
  parser=Links();parser.feed(page.read_text());parsed[page.resolve()]=parser
  assert not parser.errors and not parser.stack, f'Marcação HTML inválida: {page}'
  assert len(parser.ids)==len(set(parser.ids)),f'IDs duplicados: {page}'
 for page in pages:
  parser=Links();parser.feed(page.read_text())
  for address in parser.urls:
   parts=urlsplit(address)
   if parts.scheme or parts.netloc:continue
   target=(page.parent/unquote(parts.path)).resolve() if parts.path else page.resolve()
   if not target.exists():errors.append(f'{page.relative_to(ROOT)}: {address}')
   elif parts.fragment and target in parsed and unquote(parts.fragment) not in parsed[target].ids:errors.append(f'Âncora ausente: {page.relative_to(ROOT)}: {address}')
 assert not errors,'Links ausentes:\n'+'\n'.join(errors)
 sample=prose('**F** Finalidade: texto.\n\nObservação mantida.\n\n**F** Forma: outro texto.')
 mnemonic=mnemonic_html(sample)
 assert mnemonic.count('class="mnemonic-letter"')==2
 assert 'mnemonic-item mnemonic-tone-1' in mnemonic and 'mnemonic-item mnemonic-tone-2' in mnemonic
 assert 'Observação mantida.' in mnemonic and '<strong class="mnemonic-term">Finalidade:</strong>' in mnemonic
 assert mnemonic_html('<p>Texto comum com <strong>F</strong> no meio.</p>')=='<p>Texto comum com <strong>F</strong> no meio.</p>'
 for sample in [
  '<ul><li><strong>L</strong>egalidade</li><li><strong>I</strong>mpessoalidade</li></ul>',
  '<p><strong>C</strong>ontraditório · <strong>A</strong>mpla defesa</p>',
  '<p><strong>LIMPE</strong> — ordem dos princípios.</p>',
  '<p>V-A-S-A-N-P: classes variáveis. Prazo: 15 dias.</p>',
  '<p>ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ</p>',
  '<p><strong>P + T + S = Estado</strong></p>',
 ]:
  highlighted=memory_html(sample)
  assert text_of(highlighted)==text_of(sample),'O destaque mudou o conteúdo'
  assert 'memory-keyword' in highlighted
 assert '<code>ABC = 15</code>' in memory_html('<p>Leia <code>ABC = 15</code>.</p>')
 assert 'class="memory-aid"' in prose('Explicação.\n\nMNEMÔNICO: **P**raça → Permanente.')
 memory_count=0
 for source in MATERIAS.glob('*/conteudos/*.json'):
  for item in unique(json.loads(source.read_text())['blocos']):
   if not is_memory_block(item):continue
   original=render_block(item);highlighted=block(item);memory_count+=1
   assert text_of(original)==text_of(highlighted),f'Texto alterado: {source} / {item.get("titulo")}'
   assert 'class="memory-aid"' in highlighted
   assert 'memory-keyword' in highlighted or 'mnemonic-letter' in highlighted,f'Sem destaque: {source} / {item.get("titulo")}'
 print(f'OK: {memory_count} blocos de memória com destaque e conteúdo preservado.')
 assert role('❌ A afirmação está errada')=='errado'
 assert role('Art. 37')=='artigo'
 assert role('Mnemônico')=='mnemonico'
 assert prose('**Bizu:** texto\n\nOutra ideia.').count('<p')==2
 assert '<span class="calculation">' in (MATERIAS/'matematica/equacoes-segundo-grau.html').read_text()
 assert 'Noções de Direito Civil' in (MATERIAS/'guardas-municipais/noes-de-direito-civil.html').read_text()
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
