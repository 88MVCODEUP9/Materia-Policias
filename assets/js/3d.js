/* Camada 3D · Matéria Policial.
   Estante giratória, inclinação dos cartões, entrada por rolagem e barra de progresso.
   Nada aqui é necessário para ler o conteúdo: sem JS, os links e textos continuam funcionando. */
(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js-3d');
  const reduzir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ponteiroFino = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const PASSO_GAP = 36;

  /* ---------- Estante (anel de livros) ---------- */
  function iniciarEstante(cena) {
    const anel = cena.querySelector('.anel3d');
    const livros = [...cena.querySelectorAll('.livro3d')];
    const legenda = cena.querySelector('[data-legenda]');
    const prev = cena.querySelector('[data-prev]');
    const next = cena.querySelector('[data-next]');
    const n = livros.length;
    if (!anel || n < 3) return;
    const passo = 360 / n;

    const estilo = getComputedStyle(cena);
    const largura = parseFloat(estilo.getPropertyValue('--w')) || 132;
    const raio = Math.round(largura / 2 / Math.tan(Math.PI / n)) + PASSO_GAP;
    cena.style.setProperty('--n', n);
    cena.style.setProperty('--R', raio + 'px');
    livros.forEach((l, i) => l.style.setProperty('--i', i));

    let giro = 0, alvo = null, vel = 0;
    let arrastando = false, pausado = false, visivel = true, ultimo = 0, frame = 0;
    let inicioX = 0, moveu = 0, giroInicio = 0, ultimoX = 0, ultimoT = 0, ociosoAte = 0;
    let frenteAtual = -1;

    const norm = a => ((a % 360) + 360) % 360;
    const frente = () => Math.round(norm(-giro) / passo) % n;

    function legendar() {
      const f = frente();
      if (f === frenteAtual) return;
      frenteAtual = f;
      const l = livros[f];
      if (legenda) legenda.innerHTML = '';
      if (legenda) {
        legenda.append(document.createTextNode(l.dataset.nome || ''));
        const s = document.createElement('small'); s.textContent = l.dataset.qtd || '';
        legenda.append(s);
      }
    }
    function aplicar() {
      anel.style.setProperty('--giro', giro.toFixed(2) + 'deg');
      legendar();
    }
    function irPara(indice) {
      const k = ((indice % n) + n) % n;
      const destino = -k * passo;
      let d = norm(destino - giro); if (d > 180) d -= 360;
      alvo = giro + d; vel = 0;
      acordar();
    }
    function tick(t) {
      frame = 0;
      const dt = Math.min(0.05, (t - (ultimo || t)) / 1000); ultimo = t;
      let vivo = false;
      if (arrastando) { vivo = true; }
      else if (alvo !== null) {
        const d = alvo - giro;
        giro += d * (1 - Math.pow(0.0009, dt));       // ease-out exponencial
        if (Math.abs(d) < 0.04) { giro = alvo; alvo = null; } else vivo = true;
      } else if (Math.abs(vel) > 4) {
        giro += vel * dt; vel *= Math.pow(0.04, dt); vivo = true;
        if (Math.abs(vel) <= 4) { vel = 0; alvo = -Math.round(-giro / passo) * passo; vivo = true; }
      } else if (!reduzir && !pausado && performance.now() > ociosoAte) {
        giro -= 5 * dt; vivo = true;                  // rotação lenta em repouso
      }
      aplicar();
      if (vivo && visivel && !document.hidden) frame = requestAnimationFrame(tick);
      else ultimo = 0;
    }
    function acordar() { if (!frame && visivel && !document.hidden) frame = requestAnimationFrame(tick); }

    /* arrastar */
    cena.addEventListener('pointerdown', e => {
      if (e.button !== 0 || e.target.closest('.cena3d-controles')) return;
      arrastando = true; moveu = 0; alvo = null; vel = 0;
      inicioX = ultimoX = e.clientX; giroInicio = giro; ultimoT = performance.now();
      cena.classList.add('arrastando');
      cena.setPointerCapture(e.pointerId);
      acordar();
    });
    cena.addEventListener('pointermove', e => {
      if (!arrastando) return;
      const dx = e.clientX - inicioX; moveu = Math.max(moveu, Math.abs(dx));
      giro = giroInicio + dx * 0.32;
      const agora = performance.now(), dtm = Math.max(1, agora - ultimoT);
      vel = ((e.clientX - ultimoX) * 0.32) / (dtm / 1000) * 0.6 + vel * 0.4;
      ultimoX = e.clientX; ultimoT = agora;
    });
    const soltar = e => {
      if (!arrastando) return;
      arrastando = false; cena.classList.remove('arrastando');
      try { cena.releasePointerCapture(e.pointerId); } catch (_) {}
      if (reduzir || Math.abs(vel) < 20) { vel = 0; alvo = -Math.round(-giro / passo) * passo; }
      ociosoAte = performance.now() + 2500;
      acordar();
    };
    cena.addEventListener('pointerup', soltar);
    cena.addEventListener('pointercancel', soltar);
    cena.addEventListener('click', e => { if (moveu > 6) { e.preventDefault(); e.stopPropagation(); moveu = 0; } }, true);
    cena.addEventListener('dragstart', e => e.preventDefault());

    /* pausa: hover e foco */
    cena.addEventListener('pointerenter', () => { if (ponteiroFino) pausado = true; });
    cena.addEventListener('pointerleave', () => { pausado = false; ociosoAte = performance.now() + 1200; acordar(); });
    cena.addEventListener('focusin', e => {
      pausado = true;
      const l = e.target.closest('.livro3d'); if (l) irPara(livros.indexOf(l));
    });
    cena.addEventListener('focusout', () => { pausado = false; ociosoAte = performance.now() + 1200; acordar(); });

    /* botões e teclado */
    prev && prev.addEventListener('click', () => irPara(frente() - 1));
    next && next.addEventListener('click', () => irPara(frente() + 1));
    cena.addEventListener('keydown', e => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const atual = livros.indexOf(document.activeElement.closest && document.activeElement.closest('.livro3d'));
      if (atual < 0) return;
      e.preventDefault();
      const novo = (atual + (e.key === 'ArrowRight' ? 1 : -1) + n) % n;
      livros[novo].focus();
    });

    /* só anima visível */
    new IntersectionObserver(es => { visivel = es[0].isIntersecting; if (visivel) acordar(); }, { threshold: 0.05 }).observe(cena);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) acordar(); });

    /* começa com um livro de frente, depois gira sozinho */
    giro = -((n >> 1) - 1) * passo + 14;
    aplicar(); acordar();
  }
  document.querySelectorAll('[data-estante3d]').forEach(iniciarEstante);

  /* ---------- Inclinação dos cartões ---------- */
  if (ponteiroFino && !reduzir) {
    const SEL = '.discipline-card, .material.subject, .lei-card';
    let alvoAtual = null, pend = null, quadro = 0;
    const MAX_Y = 6, MAX_X = 5;
    const aplicarInclinacao = () => {
      quadro = 0;
      if (!alvoAtual || !pend) return;
      const r = alvoAtual.getBoundingClientRect();
      const x = (pend.x - r.left) / r.width, y = (pend.y - r.top) / r.height;
      alvoAtual.style.setProperty('--ry', ((x - 0.5) * 2 * MAX_Y).toFixed(2));
      alvoAtual.style.setProperty('--rx', (-(y - 0.5) * 2 * MAX_X).toFixed(2));
    };
    const zerar = el => { el.classList.remove('tilt-ativo'); el.style.setProperty('--rx', 0); el.style.setProperty('--ry', 0); };
    document.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const c = e.target.closest && e.target.closest(SEL);
      if (c !== alvoAtual) { if (alvoAtual) zerar(alvoAtual); alvoAtual = c; if (c) c.classList.add('tilt-ativo'); }
      if (!c) return;
      pend = { x: e.clientX, y: e.clientY };
      if (!quadro) quadro = requestAnimationFrame(aplicarInclinacao);
    }, { passive: true });
    document.addEventListener('pointerleave', () => { if (alvoAtual) { zerar(alvoAtual); alvoAtual = null; } });
  }

  /* ---------- Entrada por rolagem ---------- */
  if (!reduzir && 'IntersectionObserver' in window) {
    const alvos = [...document.querySelectorAll('.discipline-card, .lei-card, .study-card')];
    const io = new IntersectionObserver(entradas => {
      let ordem = 0;
      entradas.filter(e => e.isIntersecting).forEach(e => {
        const el = e.target;
        el.style.setProperty('--d', Math.min(ordem++, 10));
        el.classList.add('entrou');
        io.unobserve(el);
        const limpar = ev => {
          if (ev.target !== el || ev.propertyName !== 'opacity') return;
          el.classList.remove('rev', 'entrou'); el.style.removeProperty('--d');
          el.removeEventListener('transitionend', limpar);
        };
        el.addEventListener('transitionend', limpar);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    alvos.forEach(el => { el.classList.add('rev'); io.observe(el); });
  }

  /* ---------- Progresso de leitura nas aulas ---------- */
  if (document.querySelector('.reader-header, .lei-texto')) {
    const barra = document.createElement('div');
    barra.className = 'progresso3d'; barra.setAttribute('aria-hidden', 'true');
    document.body.append(barra);
    let q = 0;
    const atualizar = () => {
      q = 0;
      const h = root.scrollHeight - innerHeight;
      barra.style.setProperty('--p', h > 0 ? Math.min(1, scrollY / h).toFixed(4) : 0);
    };
    addEventListener('scroll', () => { if (!q) q = requestAnimationFrame(atualizar); }, { passive: true });
    atualizar();
  }
})();
