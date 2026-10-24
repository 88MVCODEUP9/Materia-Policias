#!/usr/bin/env python3
"""Gera páginas estáticas a partir dos JSONs. Somente biblioteca padrão do Python."""
import html,json,re,unicodedata,math
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[1]
MATERIAS=ROOT/'Materias'
TYPES={'teoria':('Teoria','Ler a teoria','Conceitos e explicações do assunto.'),'questoes':('Questões e simulados','Resolver questões','Exercícios para praticar o assunto.'),'resumo':('Resumos e mapas','Revisar o resumo','Pontos principais para memorizar.'),'legislacao':('Legislação e artigos','Consultar a lei','Artigos e leis citados no assunto.')}
ICONS={'teoria':'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M5 3h11a3 3 0 0 1 3 3v14a1 1 0 0 1-1.5.86L14 19H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm1 4v2h9V7H6zm0 4v2h9v-2H6z"/></svg>','questoes':'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1 15v-2h2v2h-2zm3.1-6.2-.9.9c-.6.6-1.2 1.1-1.2 2.3h-2v-.5c0-1 .6-1.9 1.2-2.5l1.2-1.2c.3-.3.5-.8.5-1.2 0-1-.9-1.8-2-1.8s-2 .8-2 1.8H8c0-2.2 1.8-3.8 4-3.8s4 1.6 4 3.8c0 .6-.3 1.2-.9 1.8z"/></svg>','resumo':'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.1 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z"/></svg>','legislacao':'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a1.5 1.5 0 0 1 1.5 1.5V5H20v2h-1.2l2.6 6.2a1 1 0 0 1-.1.9C20.4 15.4 19.2 16 18 16s-2.4-.6-3.3-1.9a1 1 0 0 1-.1-.9L17.2 7H13.5v12H18v2H6v-2h4.5V7H6.8l2.6 6.2a1 1 0 0 1-.1.9C8.4 15.4 7.2 16 6 16s-2.4-.6-3.3-1.9a1 1 0 0 1-.1-.9L5.2 7H4V5h6.5V3.5A1.5 1.5 0 0 1 12 2z"/></svg>'}
def esc(x):return html.escape(str(x or ''),quote=True)
def norm(x):return unicodedata.normalize('NFKD',str(x)).encode('ascii','ignore').decode().lower()
def safe_path(x):
 p=Path(x)
 if p.is_absolute() or '..' in p.parts or not re.fullmatch(r'[a-z0-9][a-z0-9/-]*',str(x)):raise ValueError('Identificador de caminho inválido: '+str(x))
 return str(x)
def url(x):
 x=str(x or '').strip()
 if any(ord(c)<32 or ord(c)==127 for c in x):return ''
 return x if x and not re.match(r'(?i)^(?:javascript|data|vbscript|file):',x) and (not re.match(r'^[\w+.-]+:',x) or x.startswith(('https://','http://'))) and not x.startswith('//') else ''
def fix_text(s):
 s=str(s or '')
 s=re.sub(r'\\+n','\n',s)
 s=re.sub(r'\\+"','"',s)
 s=re.sub(r"\\+'","'",s)
 s=re.sub(r'\\{2,}',r'\\',s)
 return s
def editorial(s):
 # Retira apenas pictogramas decorativos; mantém os símbolos de matemática e lógica.
 return re.sub(r'[\U0001F000-\U0001FAFF\uFE0F\u200D]', '', str(s)).strip()

KINDS={'assunto':'Conceito', 'explicacao':'Explicação', 'lei':'Legislação', 'artigo':'Artigo',
 'sumula':'Súmula', 'paragrafo':'Parágrafo', 'certo':'Certo', 'errado':'Errado',
 'bizu':'Bizu', 'mnemonico':'Mnemônico', 'alerta':'Atenção', 'exemplo':'Exemplo',
 'resumo':'Resumo', 'questoes':'Questões', 'formula':'Fórmula e cálculo',
 'expressao':'Expressão lógica', 'comando':'Comando', 'fonte':'Referência', 'passo':'Resolução'}

def role(text):
 if str(text).lstrip().startswith('✅'):return 'certo'
 if str(text).lstrip().startswith('❌'):return 'errado'
 t=norm(editorial(text)).strip(' .:—–-')
 for kind,pattern in [
  ('mnemonico',r'^mnemon'),('bizu',r'^(bizu|dica|macete)\b'),
  ('errado',r'^(errado|incorreto|falso)\s*[:.!-]'),('certo',r'^(certo|correto|verdadeiro)\s*[:.!-]'),
  ('sumula',r'^sumula'),('paragrafo',r'^(paragrafo|§)'),('artigo',r'^(art\.?|artigo)\s*\d'),
  ('lei',r'^(lei|legislacao|base legal|decreto)\b'),('alerta',r'^(atencao|importante|pegadinha|cuidado)\b'),
  ('exemplo',r'^exemplo'),('resumo',r'^(resumo|mapa mental|visao geral)'),
  ('explicacao',r'^(conceito|definicao|explicacao|para leigos)|explicacao para leigos'),
  ('fonte',r'^(fonte|referencia)'),('passo',r'^(passo|resolucao|solucao)\b')]:
  if re.search(pattern,t):return kind
 return ''

def paragraph(text):
 text=editorial(text)
 if not text or text in ('⚠','⚖','❗','✅','❌'):return ''
 # Rótulos editoriais são separados do texto explicativo, sem alterar sua redação.
 chunks=re.split(r'(?=✅|❌|\*\*(?:Exemplo|Bizu|Mnemônico|Macete|Atenção|Pegadinha|Importante|Base legal)\s*[:：]|(?<![\w*])(?:Bizu|Mnemônico|Macete)\s*[:：])',text,flags=re.I)
 output=[]
 for chunk in chunks:
  if not chunk.strip() or chunk.strip() in ('⚠','⚖','❗','✅','❌'):continue
  kind=role(re.sub(r'\*\*','',chunk))
  attrs=' class="note" data-study-kind="'+kind+'"' if kind else ''
  if kind in ('certo','errado') and chunk.lstrip().startswith(('✅','❌')):
   chunk=chunk.lstrip()[1:].lstrip()
   chunk='**'+KINDS[kind]+':** '+chunk
  sentences=re.split(r'(?<=[.!?;])\s+(?=(?:\*\*)?[A-ZÁÉÍÓÚÂÊÔÃÕÇ“→])|(?=→\s*(?:macOS|XNU|Darwin|Dock|Finder|Spotlight|Mission|Launchpad))',chunk) if len(chunk)>460 else [chunk]
  groups=[];group=''
  for sentence in sentences:
   if len(group)+len(sentence)>400 and group:groups.append(group);group=sentence
   else:group+=(' ' if group else '')+sentence
  if group:groups.append(group)
  for part in groups:
   rendered='<p'+attrs+'>'+inline(part)+'</p>'
   output.append(memory_html(rendered) if kind in ('bizu','mnemonico') else rendered)
 return ''.join(output)

def inline(s):
 t=esc(editorial(fix_text(s)))
 t=re.sub(r'(https?://[^\s<]+?)([.,;:)]*)(?=\s|<|$)',lambda m:'<a href="'+m[1]+'" rel="noopener">'+m[1]+'</a>'+m[2],t)
 t=re.sub(r'\*\*(.+?)\*\*',r'<strong>\1</strong>',t)
 t=re.sub(r'`([^`]+)`',r'<code>\1</code>',t)
 return t

def table(headers,rows):
 return '<div class="table-wrap" tabindex="0" role="region" aria-label="Tabela com rolagem horizontal"><table><thead><tr>'+''.join('<th scope="col">'+inline(c)+'</th>' for c in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+inline(c)+'</td>' for c in row)+'</tr>' for row in rows)+'</tbody></table></div>'
def prose(s):
 lines=fix_text(s).splitlines();out=[];para=[];items=[];tag='ul';i=0
 def flush():
  if para:out.append(paragraph(' '.join(para)));para.clear()
 def flush_list():
  if items:out.append('<'+tag+'>'+''.join('<li>'+inline(p)+'</li>' for p in items)+'</'+tag+'>');items.clear()
 while i<len(lines):
  t=lines[i].strip()
  if t.startswith('```'):
   flush();flush_list();code=[];i+=1
   while i<len(lines) and not lines[i].strip().startswith('```'):code.append(lines[i]);i+=1
   out.append('<pre class="code" tabindex="0"><code>'+esc('\n'.join(code))+'</code></pre>');i+=1;continue
  if t.startswith('|') and i+1<len(lines) and re.fullmatch(r'[\s|:\-]+',lines[i+1]) and '-' in lines[i+1]:
   flush();flush_list();heads=t.strip('|').split('|');rows=[];i+=2
   while i<len(lines) and lines[i].strip().startswith('|'):rows.append(lines[i].strip().strip('|').split('|'));i+=1
   out.append(table(heads,rows));continue
  m=re.match(r'^(?:([-*•])\s+|\d+[.)]\s+)(.*)',t)
  heading=re.match(r'^(#{1,4})\s+(.+)',t)
  if not t:flush();flush_list()
  elif heading:flush();flush_list();level=min(5,len(heading[1])+1);out.append(f'<h{level}>'+inline(heading[2])+f'</h{level}>')
  elif m:
   flush();new='ul' if m[1] else 'ol'
   if new!=tag:flush_list();tag=new
   items.append(m[2])
  else:
   flush_list()
   if para and (t.startswith(('**','→','✅','❌')) or role(re.sub(r'\*\*','',editorial(t))) in ('bizu','mnemonico')):flush()
   para.append(t)
  i+=1
 flush();flush_list();return ''.join(out)
class CleanHTML(HTMLParser):
 CLASSES_OK={'badge','symbol','hl','alert','alert--warning','alert--danger','blk','blk--definicao'}
 allowed=set('p br strong em b i u h2 h3 h4 h5 ul ol li table thead tbody tr th td caption blockquote code pre div span figure figcaption img a details summary sub sup'.split())
 def __init__(self):super().__init__(convert_charrefs=True);self.parts=[];self.skip=0
 def handle_starttag(self,tag,attrs):
  if tag in ('script','style','iframe','object'):self.skip+=1;return
  if self.skip or tag not in self.allowed:return
  at=[]
  for k,v in attrs:
   if k in ('alt','title','colspan','rowspan','scope'):at.append((k,v))
   if k=='class':
    cls=' '.join(t for t in str(v).split() if t in self.CLASSES_OK)
    if cls:at.append(('class',cls))
   if k in ('src','href') and url(v):at.append((k,url(v)))
  if tag=='img':at.extend([('loading','lazy'),('decoding','async')])
  if tag=='table':self.parts.append('<div class="table-wrap" tabindex="0" role="region" aria-label="Tabela com rolagem horizontal">')
  self.parts.append('<'+tag+''.join(' '+k+'="'+esc(v)+'"' for k,v in at)+'>')
 def handle_endtag(self,tag):
  if tag in ('script','style','iframe','object'):self.skip=max(0,self.skip-1);return
  if not self.skip and tag in self.allowed:
   self.parts.append('</'+tag+'>')
   if tag=='table':self.parts.append('</div>')
 def handle_data(self,data):
  if not self.skip:self.parts.append(esc(editorial(data)) if re.search(r'[\U0001F000-\U0001FAFF]',data) else esc(data))
def clean(s):
 s=re.sub(r'^\s*[^<]+</h[23]>\s*', '', str(s))
 p=CleanHTML();p.feed(s);out=''.join(p.parts)
 out=re.sub(r'<p>([^<>]*)</p>',lambda m:paragraph(html.unescape(m[1])),out)
 def memory_note(match):
  plain=html.unescape(re.sub(r'<[^>]+>','',match[2]))
  if '<' in match[2] and 'data-study-kind' not in match[1] and role(plain) in ('bizu','mnemonico'):return memory_html(match[0])
  return match[0]
 return re.sub(r'<p([^>]*)>(.*?)</p>',memory_note,out,flags=re.S)
def category(b):
 t=b.get('tipo','');r=norm(b.get('rotulo',''))
 if t in ('questao','simulado'):return 'questoes'
 if t in ('lei','artigo','lei-seca') or r in ('legislacao','lei','artigo'):return 'legislacao'
 if t in ('resumo','mapa-mental','diagrama') or r in ('resumo','mapa mental','bizu','dica','macete'):return 'resumo'
 return 'teoria'
def unique(blocks):
 seen=set();result=[]
 for b in blocks:
  key=json.dumps(b,sort_keys=True,ensure_ascii=False)
  if key not in seen:seen.add(key);result.append(b)
 # Cabeçalhos vazios do legado repetem o título do bloco seguinte.
 return [b for i,b in enumerate(result) if not (
  b.get('tipo')=='destaque' and not b.get('rotulo') and not b.get('titulo')
  and i+1<len(result) and b.get('texto')==result[i+1].get('titulo')
 )]

def mnemonic_html(content):
 # Organiza somente sequências explicitamente marcadas, como **F** Finalidade.
 entries=list(re.finditer(r'<p><strong>([A-ZÁÉÍÓÚÇ]{1,4})</strong>\s*',content))
 if len(entries)<2:return content
 key=''.join('<span class="mnemonic-tone-'+str(i%8+1)+'">'+m[1]+'</span>' for i,m in enumerate(entries))
 rows=[]
 for i,match in enumerate(entries):
  end=entries[i+1].start() if i+1<len(entries) else len(content)
  body=content[match.end():end]
  # Destaca o nome e a pergunta-guia, mantendo a explicação original.
  body=re.sub(r'^([^<:]{2,110}:)',r'<strong class="mnemonic-term">\1</strong>',body,count=1)
  rows.append('<div class="mnemonic-item mnemonic-tone-'+str(i%8+1)+'"><span class="mnemonic-letter">'+match[1]+'</span><div class="mnemonic-text"><p>'+body+'</div></div>')
 return content[:entries[0].start()]+'<div class="mnemonic-key" aria-label="Sequência do mnemônico">'+key+'</div><div class="mnemonic-list">'+''.join(rows)+'</div>'

def is_memory_block(b):
 return isinstance(b,dict) and (b.get('tipo')=='dica' or role(b.get('rotulo','')) in ('bizu','mnemonico')
  or bool(re.search(r'mnemon|bizu|macete|gatilho mental|como memorizar|decore',norm(b.get('titulo','')))))

MEMORY_TERMS={
 'resumo: formal vs material': ('Formal','Material'),
 'dica sobre extensoes': ('.docx','.xlsx','.pdf','Word','Excel','Adobe Reader'),
 'hardware = fisico': ('hardware','software','tocar'),
 'thermal throttling': ('temperatura','frequência','desempenho','consumo'),
 'software livre ≠ gratuito': ('Livre','Gratuito','liberdade','custo zero'),
 'gatilhos mentais e pegadinhas': ('teoria da atividade','ubiquidade','Retroatividade','soma','exasperação'),
 'como memorizar': ('Soldo','Vantagens permanentes','Indenizações'),
 'macete: bicondicional = valores iguais → v. (v↔v = v; f↔f = v)': ('Bicondicional','valores iguais'),
 'macete: ou → e (nega tudo e troca ou por e).': ('nega tudo','troca'),
 'macete: a negacao do bicondicional significa que p e q tem valores diferentes.': ('negação','bicondicional','valores diferentes'),
}

def memory_terms(b):
 title=norm(b.get('titulo',''))
 # norm remove sinais não ASCII; as chaves passam pela mesma normalização.
 for key,terms in MEMORY_TERMS.items():
  if norm(key)==title:return terms
 text=norm(b.get('texto',''))
 if text.startswith('memorize as formulas'):return ('fórmulas','π')
 if text.startswith('em concursos, razao'):return ('razão','proporção','divisão de valores','escala','comparação')
 if text.startswith('praca = permanente'):return ('Praça','Permanente','Oficial','Especial')
 return ()

class MemoryHighlights(HTMLParser):
 """Acrescenta cor à marcação existente; nunca expande siglas nem muda o texto."""
 def __init__(self,terms=()):
  super().__init__(convert_charrefs=False);self.parts=[];self.frames=[];self.index=0;self.terms=terms
 def tone(self):
  self.index+=1;return 'mnemonic-tone-'+str((self.index-1)%8+1)
 def handle_starttag(self,tag,attrs):
  data=dict(attrs);classes=data.get('class','')
  blocked=(self.frames[-1][1] if self.frames else False) or (tag in ('code','pre','a','summary') or (tag in ('h1','h2','h3','h4','h5') and not self.terms)) or any(c in classes.split() for c in ('mnemonic-key','mnemonic-letter','mnemonic-term','memory-acronym','memory-aid'))
  bold=tag=='strong' and not blocked
  if bold:
   data['class']=(classes+' memory-keyword '+self.tone()).strip()
  self.parts.append('<'+tag+''.join(' '+k+'="'+esc(v)+'"' for k,v in data.items())+'>')
  if tag not in ('img','br','hr','input','source','wbr'):self.frames.append((tag,blocked,bold))
 def handle_startendtag(self,tag,attrs):self.parts.append(self.get_starttag_text())
 def handle_endtag(self,tag):
  self.parts.append('</'+tag+'>')
  if self.frames and self.frames[-1][0]==tag:self.frames.pop()
 def handle_entityref(self,name):self.parts.append('&'+name+';')
 def handle_charref(self,name):self.parts.append('&#'+name+';')
 def acronym(self,text):
  # Mantém inclusive pontos, espaços e hífens da sequência original.
  i=0
  def letter(match):
   nonlocal i
   i+=1;return '<span class="memory-keyword mnemonic-tone-'+str((i-1)%8+1)+'">'+match[0]+'</span>'
  return '<span class="memory-acronym">'+re.sub(r'[A-ZÁÉÍÓÚÇ]',letter,text)+'</span>'
 def handle_data(self,text):
  blocked=self.frames[-1][1] if self.frames else False
  if blocked:self.parts.append(text);return
  bold=self.frames[-1][2] if self.frames else False
  if bold:
   if re.fullmatch(r'[A-ZÁÉÍÓÚÇ](?:[ .·+-]*[A-ZÁÉÍÓÚÇ]){1,15}',text.strip()):self.parts.append(self.acronym(text))
   else:self.parts.append(re.sub(r'\b[A-Z](?:\s*[+·.-]\s*[A-Z]){1,12}\b',lambda m:self.acronym(m[0]),text))
   return
  pattern=r'(?<![\w/])(?:[A-ZÁÉÍÓÚÇ](?:[-·.][A-ZÁÉÍÓÚÇ]){1,12}|[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{2,12})(?![\w/])|[A-ZÁÉÍÓÚÇ]{2,}(?=[a-záéíóúâêôãõç])|\b\d+(?:[.,]\d+)*(?:\s*(?:dias?|anos?|horas?|meses|%))?|[ℕℤℚℝℂπ¬∧∨↔⊕≈⊂≤≥]'
  if self.terms:pattern='(?i:'+'|'.join(re.escape(term) for term in sorted(self.terms,key=len,reverse=True))+')|'+pattern
  def mark(match):
   token=match[0]
   if re.fullmatch(r'[A-ZÁÉÍÓÚÇ](?:[-·.][A-ZÁÉÍÓÚÇ]){1,12}',token):return self.acronym(token)
   return '<span class="memory-keyword '+self.tone()+'">'+token+'</span>'
  self.parts.append(re.sub(pattern,mark,text))

def memory_html(content,terms=()):
 parser=MemoryHighlights(terms);parser.feed(content)
 return '<div class="memory-aid">'+''.join(parser.parts)+'</div>'

def block(b):
 content=render_block(b)
 return memory_html(content,memory_terms(b)) if is_memory_block(b) else content

def render_block(b):
 if isinstance(b,str):return prose(b)
 t=b.get('tipo','texto');txt=b.get('texto',b.get('conteudo',''));title=b.get('titulo','');label=b.get('rotulo','');cat=category(b)
 if t=='laboratorio-logico':return logic_lab()
 if t=='html':return clean(b.get('html',''))
 if t in ('h2','h3','h4','h5'):return f'<{t}>'+inline(txt)+f'</{t}>'
 if t in ('texto','p'):return prose(txt)
 if t in ('ul','ol','lista'):return '<'+('ol' if t=='ol' else 'ul')+'>'+''.join('<li>'+inline(i)+'</li>' for i in b.get('itens',[]))+'</'+('ol' if t=='ol' else 'ul')+'>'
 if t=='tabela':return table(b.get('colunas',[]),b.get('linhas',[]))
 if t in ('imagem','figura'):
  source=url(b.get('src',b.get('url','')))
  if not source:raise ValueError('Imagem sem endereço seguro')
  return '<figure><img src="'+esc(source)+'" alt="'+esc(b.get('alt',title))+'" loading="lazy" decoding="async"><figcaption>'+inline(b.get('legenda',''))+'</figcaption></figure>'
 if t in ('mapa-mental','diagrama'):
  def branches(items):return '<ul class="branches">'+''.join('<li><strong>'+inline(i.get('titulo',''))+'</strong>'+prose(i.get('texto',''))+(branches(i['ramos']) if i.get('ramos') else '')+'</li>' for i in items)+'</ul>'
  return '<figure><figcaption>'+inline(title or 'Mapa mental')+'</figcaption><div class="mind-root">'+inline(b.get('raiz',title))+'</div>'+branches(b.get('ramos',[]))+'</figure>'
 if t=='acordeao':return '<details><summary>'+inline(title or 'Saiba mais')+'</summary>'+prose(txt)+''.join(block(c) for c in b.get('blocos',[]))+'</details>'
 if t=='questao':
  opts=b.get('alternativas',[]);correct=b.get('correta')
  if not opts or not isinstance(correct,int) or not 0<=correct<len(opts):raise ValueError('Questão requer alternativas e correta (índice inteiro).')
  return '<form class="question" data-correct="'+str(correct)+'"><fieldset><legend>'+inline(title or txt)+'</legend>'+ (prose(txt) if title and txt else '')+''.join('<label><input type="radio" name="resposta" value="'+str(i)+'" required> '+inline(v)+'</label>' for i,v in enumerate(opts))+'</fieldset><button class="primary" type="submit">Conferir resposta</button><output aria-live="polite"></output><details><summary>Comentário</summary>'+prose(b.get('explicacao',''))+'</details></form>'
 if not title and not label:return prose(txt) if str(txt).strip() else ''
 content=prose(txt)
 if is_memory_block(b):content=mnemonic_html(content)

 if cat=='teoria' and norm(label) in ('conceito','conteudo','explicacao','exemplo','analogia','') and t not in ('atencao','dica','pegadinha'):
  return '<div class="text-section">'+('<h2>'+inline(title)+'</h2>' if title else '')+content+'</div>'
 return '<aside class="callout '+cat+'"><span class="label">'+esc(label or t.replace('-',' '))+'</span>'+('<h2>'+inline(title)+'</h2>' if title else '')+content+'</aside>'

def shell(title,body,disciplines,prefix='',active='',description='Materiais de estudo organizados para concursos policiais.',disc_prefix=None):
 disc_prefix=prefix if disc_prefix is None else disc_prefix
 technical=active if active in ('matematica','raciocinio-logico','informatica') else ''
 nav='<a href="'+prefix+'index.html"'+(' aria-current="page"' if not active else '')+'>Biblioteca</a><p class="nav-label">Disciplinas</p>'+''.join('<a href="'+disc_prefix+d['id']+'/index.html"'+(' aria-current="page"' if active==d['id'] else '')+'>'+esc(d['nome'])+'</a>' for d in disciplines)
 return ('<!doctype html>\n<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
  '<meta name="theme-color" content="#101820"><meta name="color-scheme" content="dark"><title>'+esc(title)+' · Matéria Policial</title>'
  '<meta name="description" content="'+esc(description)+'"><link rel="icon" href="'+prefix+'assets/icone.png">'
  '<link rel="stylesheet" href="'+prefix+'assets/css/estilos.css"><script defer src="'+prefix+'assets/js/app.js"></script></head>'
  '<body class="tema-biblioteca"'+(' data-study-discipline="'+technical+'"' if technical else '')+'><a class="skip" href="#conteudo">Pular para o conteúdo</a>'
  '<aside class="sidebar" id="sidebar"><a class="brand" href="'+prefix+'index.html"><span>Matéria<br>Policial<span class="brand-period">.</span><small>CONCURSOS PÚBLICOS</small></span></a>'
  '<button class="mobile-menu" aria-controls="navegacao" aria-expanded="false">Abrir menu</button><nav id="navegacao" aria-label="Navegação principal">'+nav+'</nav><div class="sidebar-footer">Biblioteca de estudos<br><span>Teoria · revisão · legislação</span></div></aside>'
  '<div class="workspace"><header class="topbar"><a href="'+prefix+'index.html">Biblioteca de estudos</a><span>Matéria Policial</span>'
  '</header><main id="conteudo">'+body+
  '<footer class="footer"><span>Matéria Policial · Conteúdo para estudar e revisar.</span><a href="'+prefix+'index.html">Voltar à biblioteca</a></footer></main></div></body></html>\n')


def filters(available=None,first='Todos os materiais'):
 keys=[k for k in TYPES if available is None or k in available]
 return '<div class="filters" role="group" aria-label="Tipo de material"><button class="filter" data-type="" aria-pressed="true">'+first+'</button>'+''.join('<button class="filter '+k+'" data-type="'+k+'" aria-pressed="false"><span class="dot" aria-hidden="true"></span>'+TYPES[k][0]+'</button>' for k in keys)+'</div>'
def subject_card(subject,href):
 types=[k for k in TYPES if k in subject['tipos']];labels=[TYPES[k][0] for k in types]
 badges=''.join('<span class="badge '+k+'">'+TYPES[k][0]+'</span>' for k in types)
 return '<a class="material subject" data-kind="assunto" data-types="'+' '.join(types)+'" data-discipline="'+subject['disciplina']+'" data-search="'+esc(subject['titulo']+' '+subject['nomeDisciplina']+' '+' '.join(labels))+'" data-href="'+href+'" href="'+href+'"><span class="badges">'+badges+'</span><h3>'+esc(subject['titulo'])+'</h3><span class="discipline">'+esc(subject['nomeDisciplina'])+'</span><span class="card-footer"><span>Abrir assunto</span><span class="go" aria-hidden="true">→</span></span></a>'
def subject_cards(items,discipline=None):
 groups={};order=[]
 for item in items:
  key=item['pagina']
  if key not in groups:
   groups[key]={'pagina':key,'arquivo':key.rsplit('/',1)[-1],'titulo':item['titulo'],'disciplina':item['disciplina'],'nomeDisciplina':item['nomeDisciplina'],'tipos':[]}
   order.append(key)
  if item['tipo'] not in groups[key]['tipos']:groups[key]['tipos'].append(item['tipo'])
 return ''.join(subject_card(groups[key],groups[key]['arquivo'] if discipline else groups[key]['pagina']) for key in order)
def discipline_directory(items,ds):
 cards=[]
 for number,d in enumerate(ds,1):
  count=len({i['pagina'] for i in items if i['disciplina']==d['id']})
  cards.append('<a class="discipline-card" href="Materias/'+esc(d['id'])+'/index.html"><span class="discipline-number" aria-hidden="true">'+f'{number:02d}'+'</span><h3>'+esc(d['nome'])+'</h3><p>'+esc(d['descricao'])+'</p><span class="discipline-bottom">'+str(count)+' assuntos <span aria-hidden="true">→</span></span></a>')
 return '<section class="discipline-directory" aria-labelledby="disciplinas-title"><div class="section-title"><div><p class="eyebrow">ACERVO POR DISCIPLINA</p><h2 id="disciplinas-title">Escolha sua matéria.</h2></div><a class="directory-shortcut" href="#biblioteca">Ver todos os assuntos</a></div><div class="discipline-grid">'+''.join(cards)+'</div></section>'

def listing(items,ds,discipline=None):
 chosen=[i for i in items if not discipline or i['disciplina']==discipline['id']]
 subjects=len({i['pagina'] for i in chosen})
 available=[k for k in TYPES if any(i['tipo']==k for i in chosen)]
 title=discipline['nome'] if discipline else 'Biblioteca de estudos.'
 intro=discipline['descricao'] if discipline else 'Teoria, resumos e legislação para concursos policiais. Escolha uma matéria ou procure o assunto que precisa revisar.'
 stats='<div><strong>'+str(subjects)+'</strong><span>assuntos</span></div>'+('' if discipline else '<div><strong>'+str(len(ds))+'</strong><span>disciplinas</span></div>')
 hero='<section class="hero"><div><p class="eyebrow">'+('CONTEÚDO DA DISCIPLINA' if discipline else 'MATÉRIA POLICIAL / BIBLIOTECA')+'</p><h1>'+esc(title)+'</h1><p>'+esc(intro)+'</p></div><div class="hero-stats">'+stats+'</div></section>'
 options='<option value="">Todas as disciplinas</option>'+''.join('<option value="'+d['id']+'">'+esc(d['nome'])+'</option>' for d in ds)
 toolbar='<div class="toolbar"><div class="search-row"><label class="search-box"><span aria-hidden="true">⌕</span><input type="search" id="busca" aria-label="Buscar assunto ou disciplina" placeholder="Qual assunto você quer estudar?"></label>'+('' if discipline else '<select id="disciplina" aria-label="Filtrar por disciplina">'+options+'</select>')+'</div>'+filters(available)+'<button id="reset-filters" class="reset-filters" hidden>Limpar filtros</button></div>'
 results='<p class="results" id="resultados" role="status"></p><div class="grid" id="materiais">'+subject_cards(chosen,discipline)+'</div><div class="empty" id="vazio" hidden><h3>Nenhum assunto encontrado</h3><p>Tente outro termo ou remova os filtros.</p><button id="limpar">Limpar filtros</button></div>'
 if discipline:return hero+'<section id="biblioteca" aria-labelledby="materials-title"><div class="section-title"><h2 id="materials-title">Assuntos da disciplina</h2></div>'+toolbar+results+'</section>'
 return hero+toolbar+discipline_directory(items,ds)+'<details class="catalog-all" id="biblioteca"><summary id="materials-title">Todos os '+str(subjects)+' assuntos</summary>'+results+'</details><noscript><p>Abra a lista acima para consultar todos os assuntos.</p></noscript>'


def logic_lab():
 return ('<div class="logic-lab" data-logic-lab><h2>Laboratório de conectivos</h2><p>Altere os valores de p e q para comparar as operações.</p>'
 '<div class="logic-inputs"><label>Proposição p <select data-proposition="p" aria-label="Valor lógico de p"><option value="true">Verdadeiro (V)</option><option value="false">Falso (F)</option></select></label>'
 '<label>Proposição q <select data-proposition="q" aria-label="Valor lógico de q"><option value="true">Verdadeiro (V)</option><option value="false">Falso (F)</option></select></label></div>'
 '<div class="logic-results" aria-live="polite">'+''.join('<div><span class="symbol">'+symbol+'</span><small>'+name+'</small><output data-logic-result="'+key+'">'+initial+'</output></div>' for key,symbol,name,initial in [('not','¬p','Negação','F'),('and','p ∧ q','Conjunção','V'),('or','p ∨ q','Disjunção','V'),('xor','p ⊕ q','OU exclusivo','F'),('implies','p → q','Condicional','V'),('iff','p ↔ q','Bicondicional','V')])+'</div></div>')

def lesson_sections(blocks,discipline,title):
 groups=[]
 for index,b in enumerate(blocks):
  t=b.get('tipo','');heading=t in ('h2','h3','h4','h5')
  # Junta o título isolado ao conteúdo seguinte, mantendo todos os destinos antigos.
  if groups and not heading and not b.get('titulo') and not b.get('rotulo') and t in ('texto','p','ul','ol','lista','tabela') and groups[-1]['heading'] and groups[-1]['cat']==category(b):
   groups[-1]['items'].append((index,b));continue
  name=b.get('titulo') or (b.get('texto','') if heading else '')
  groups.append({'items':[(index,b)],'heading':heading,'title':editorial(name),'cat':category(b)})
 sections=[];toc=[]
 for group in groups:
  first=group['items'][0][1];name=group['title'];cat=group['cat'];anchor='bloco-'+str(group['items'][0][0])
  if discipline=='informatica' and not name and not first.get('rotulo') and re.match(r'(?i)^(logo(?:tipo)?s?\b|icone da|ilustracao de|diagrama de|mascote tux|arquitetura simplificada)',norm(first.get('texto',''))):
   # Legendas de imagens ausentes no acervo não viram cartões vazios.
   sections.append('<span class="block-anchor" id="'+anchor+'"></span>');continue
  kind=role(first.get('rotulo','')) or role(name) or {'resumo':'resumo','legislacao':'lei','questoes':'questoes'}.get(cat,'assunto')
  combined=' '.join(str(b.get('texto','')) for _,b in group['items'])
  if kind=='assunto' and discipline=='matematica' and re.search(r'[=²³√±]',combined):kind='formula'
  if kind=='assunto' and discipline=='informatica' and re.match(r'(?i)(comando|terminal|prompt|sintaxe)',name):kind='comando'
  if kind=='assunto' and discipline=='raciocinio-logico' and re.search(r'[¬∧∨↔]',combined):kind='expressao'
  if name and norm(name)==norm(title):name=''
  content=''
  for idx,b in group['items']:
   value=block(b)
   if discipline=='matematica':
    def calculation(match):
     text=match[1]
     if 'Exemplo:' not in text or '→' not in text:return match[0]
     before,example=text.split('Exemplo:',1)
     lines=re.split(r'(?=→)',example)
     return '<p>'+before+'<span class="calculation">'+''.join('<span>'+('Exemplo:' if j==0 else '')+line+'</span>' for j,line in enumerate(lines))+'</span></p>'
    value=re.sub(r'<p>([^<>]*)</p>',calculation,value)
   if idx==group['items'][0][0] and group['heading'] and not name:value=''
   content+=('' if idx==group['items'][0][0] else '<span class="block-anchor" id="bloco-'+str(idx)+'"></span>')+value
  if not content.strip():content='<p>'+esc(name or title)+'</p>'
  # Uma única superfície por seção; as notas internas podem ter a sua própria cor.
  label=KINDS[kind] if role(first.get('rotulo','')) or not first.get('rotulo') else editorial(first['rotulo'])
  sections.append('<section class="content-block study-card" data-study-kind="'+kind+'" data-study-label="'+label+'" data-type="'+cat+'" id="'+anchor+'"><p class="card-kicker">'+label+'</p>'+content+'</section>')
  if name and len(name)<125:toc.append('<a data-type="'+cat+'" href="#'+anchor+'">'+esc(name)+'</a>')
 return ''.join(sections),toc

def generate():
 ds=json.loads((ROOT/'dados/disciplinas.json').read_text());items=[];topics=[];removed=0
 assert len({d['id'] for d in ds})==len(ds),'Disciplinas duplicadas'
 for d in ds:
  safe_path(d['id']);p=MATERIAS/d['id']/'conteudos'
  if not p.is_dir():raise ValueError('Pasta de conteúdo ausente: '+str(p))
  for f in sorted(p.glob('*.json')):
   a=json.loads(f.read_text());s=safe_path(f.stem);assert a['titulo'] and isinstance(a['blocos'],list)
   blocks=unique(a['blocos']);removed+=len(a['blocos'])-len(blocks);cats=list(dict.fromkeys(category(b) for b in blocks));page='Materias/'+d['id']+'/'+s+'.html'
   topics.append((d,a,blocks,page))
   for k in cats:items.append({'id':d['id']+'/'+s+'/'+k,'titulo':a['titulo'],'disciplina':d['id'],'nomeDisciplina':d['nome'],'tipo':k,'pagina':page})
 for pos,(d,a,blocks,page) in enumerate(topics):
  cats=list(dict.fromkeys(category(b) for b in blocks));sections,toc=lesson_sections(blocks,d['id'],a['titulo'])
  wordcount=len(re.findall(r'\b\w+\b',html.unescape(re.sub(r'<[^>]+>',' ',sections))))
  controls='<div class="filters" role="group" aria-label="Filtrar blocos do assunto"><button class="filter" data-type="" aria-pressed="true">Assunto completo</button>'+''.join('<button class="filter '+k+'" data-type="'+k+'" aria-pressed="false"><span class="dot" aria-hidden="true"></span>'+TYPES[k][0]+'</button>' for k in cats)+'</div>'
  neighbors=[t for t in topics if t[0]['id']==d['id']];idx=next(i for i,t in enumerate(neighbors) if t[3]==page)
  links=('<a class="prev" href="'+neighbors[idx-1][3].rsplit('/',1)[-1]+'"><small>← Anterior</small>'+esc(neighbors[idx-1][1]['titulo'])+'</a>' if idx else '<span></span>')+('<a class="next" href="'+neighbors[idx+1][3].rsplit('/',1)[-1]+'"><small>Próximo →</small>'+esc(neighbors[idx+1][1]['titulo'])+'</a>' if idx+1<len(neighbors) else '')
  body='<nav class="breadcrumbs" aria-label="Caminho"><a href="../../index.html">Biblioteca</a> / <a href="index.html">'+esc(d['nome'])+'</a> / Assunto</nav><header class="reader-header"><a class="chip" href="index.html">'+esc(d['nome'])+'</a><h1>'+esc(editorial(a['titulo']))+'</h1><p class="muted">'+str(max(1,math.ceil(wordcount/200)))+' min de leitura</p></header><div class="reader-actions"><button id="concluir" data-key="'+esc(page)+'" aria-pressed="false">Marcar como estudado</button><button id="imprimir">Imprimir / salvar PDF</button><span class="status" id="salvamento" role="status"></span></div>'+controls+'<p class="status" id="blocos-status" role="status"></p><div class="reader-layout"><article class="prose">'+sections+'</article><aside class="toc" aria-label="Nesta página"><p class="eyebrow">NESTA AULA</p><strong>Roteiro de leitura</strong>'+''.join(toc)+'</aside></div><nav class="bottom-nav" aria-label="Assuntos anterior e próximo">'+links+'</nav>'
  (ROOT/page).write_text(shell(a['titulo'],body,ds,'../../',d['id'],disc_prefix='../'))
 (ROOT/'index.html').write_text(shell('Biblioteca',listing(items,ds),ds,disc_prefix='Materias/'))
 for d in ds:(MATERIAS/d['id']/'index.html').write_text(shell(d['nome'],listing(items,ds,d),ds,'../../',d['id'],disc_prefix='../'))
 (ROOT/'dados/catalogo.json').write_text(json.dumps(items,ensure_ascii=False,indent=2)+'\n')
 demo=json.loads((ROOT/'modelos/exemplo.json').read_text())
 body='<div class="reader-header"><h1>Guia de componentes</h1><p class="muted">Os blocos usados nas páginas de estudo. A questão de exemplo não faz parte do acervo.</p></div><article class="prose">'+''.join(block(b) for b in demo['blocos'])+'</article>'
 (ROOT/'componentes.html').write_text(shell('Guia de componentes',body,ds,disc_prefix='Materias/'))
 print(f'Gerados {len(topics)} assuntos, {len(ds)} disciplinas, {len(items)} materiais. {removed} blocos redundantes (repetições e cabeçalhos repetidos) omitidos apenas na apresentação.')
 return topics,items
if __name__=='__main__':generate()
