/* Coordena carregadores por matéria e só inicia a aplicação quando todos terminam. */
(function (global) {
  'use strict';
  var ids = ['administrativo', 'atualidades', 'constitucional', 'direitos-humanos', 'extravagante', 'guardas', 'informatica', 'matematica', 'penal', 'portugues', 'processo-penal', 'raciocinio-logico'];
  var finalizados = [];
  var erros = [];
  var container = document.querySelector('#main .app-container');
  global.GMTopicosPronto = false;

  function status(texto, papel) {
    if (!container) return;
    container.textContent = texto;
    if (papel) container.setAttribute('role', papel);
    else container.removeAttribute('role');
  }
  function carregarArquivo(caminho) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = caminho + '?v=' + Date.now();
      script.async = false;
      script.onload = resolve;
      script.onerror = function () { reject(new Error('Falha ao carregar ' + caminho)); };
      document.head.appendChild(script);
    });
  }
  function finalizar(id, arquivos, erro) {
    finalizados.push({ id: id, arquivos: arquivos });
    if (erro) erros.push(id + ': ' + erro.message);
    status('Carregando matérias… (' + finalizados.length + '/' + ids.length + ')', 'status');
    if (finalizados.length !== ids.length) return;
    global.GMTopicosPronto = true;
    if (erros.length) status('Alguns tópicos não carregaram: ' + erros.join(' | '), 'alert');
    else status('', null);
    document.dispatchEvent(new CustomEvent('gm:topicos-prontos', {
      detail: { total: finalizados.reduce(function (n, m) { return n + m.arquivos.length; }, 0), materias: finalizados.filter(function (m) { return m.arquivos.length; }).sort(function (a, b) { return ids.indexOf(a.id) - ids.indexOf(b.id); }) }
    }));
  }
  function arquivosDaPasta(html) {
    var documento = new DOMParser().parseFromString(html, 'text/html');
    return Array.from(documento.querySelectorAll('a[href]')).map(function (link) {
      return decodeURIComponent(link.getAttribute('href').split(/[?#]/)[0].split('/').pop());
    }).filter(function (arquivo) { return /^[a-zA-Z0-9_-]+\.js$/i.test(arquivo); })
      .filter(function (arquivo, i, lista) { return lista.indexOf(arquivo) === i; })
      .sort(ordenarNomes);
  }
  function arquivosDoIndice(id) {
    var indice = global.GMIndiceTopicos || {};
    return (indice[id] || []).slice().sort(ordenarNomes);
  }
  function ordenarNomes(a, b) {
    return a.localeCompare(b, 'pt-BR', { numeric: true });
  }
  /* Um arquivo ausente não pode derrubar a matéria inteira: se o índice ficou
     desatualizado (arquivo apagado sem rodar gerar-indice.py) ou o servidor
     devolveu um link quebrado, carrega o resto e avisa no console. */
  function carregarTodos(id, pasta, arquivos) {
    return Promise.allSettled(arquivos.map(function (arquivo) {
      return carregarArquivo(pasta + arquivo);
    })).then(function (resultados) {
      var faltando = arquivos.filter(function (arquivo, i) {
        return resultados[i].status === 'rejected';
      });
      if (faltando.length) {
        console.warn('[tópicos:' + id + '] ignorados por não existirem: ' + faltando.join(', ') +
          ' — rode "python3 gerar-indice.py" se a pasta mudou');
      }
      var carregados = arquivos.filter(function (arquivo, i) {
        return resultados[i].status === 'fulfilled';
      });
      if (!carregados.length) throw new Error('Nenhum arquivo .js carregou de ' + pasta);
      return finalizar(id, carregados);
    });
  }
  function carregarMateria(id) {
    var pasta = 'assets/js/data/materias/' + id + '/topicos/';
    status('Carregando matérias… (0/' + ids.length + ')', 'status');
    var viaIndice = function () {
      var arquivos = arquivosDoIndice(id);
      if (!arquivos.length) throw new Error('Nenhum arquivo .js encontrado em ' + pasta);
      return carregarTodos(id, pasta, arquivos);
    };
    if (location.protocol === 'file:') {
      viaIndice().catch(function (erro) { console.error('[tópicos:' + id + ']', erro); finalizar(id, [], erro); });
      return;
    }
    fetch(pasta, { cache: 'no-store' }).then(function (resposta) {
      if (!resposta.ok) throw new Error('Não foi possível acessar ' + pasta);
      return resposta.text();
    }).then(function (html) {
      var arquivos = arquivosDaPasta(html);
      if (!arquivos.length) throw new Error('Nenhum arquivo .js encontrado em ' + pasta);
      return arquivos;
    }).then(function (arquivos) {
      return carregarTodos(id, pasta, arquivos);
    }).catch(function (erro) {
      console.warn('[tópicos:' + id + '] listagem de pasta indisponível, usando índice gerado', erro);
      viaIndice().catch(function (erroIndice) {
        console.error('[tópicos:' + id + ']', erroIndice);
        finalizar(id, [], erroIndice);
      });
    });
  }
  global.GMCarregadorMaterias = { carregar: carregarMateria };
})(window);
