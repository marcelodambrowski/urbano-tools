/* Navegação: rolagem exata até a seção (descontando menu fixo + índice fixo),
   correção após imagens carregarem e menu hambúrguer no celular. */
(function () {
  var raiz = document.documentElement;

  function alturaFixa() {
    var h = 0, nav = document.querySelector(".topnav"), ind = document.querySelector(".indice");
    if (nav) h += nav.getBoundingClientRect().height;
    if (ind) h += ind.getBoundingClientRect().height;
    return h;
  }
  function medir() {
    // 14px de respiro; o scroll-padding cobre também links digitados na URL
    raiz.style.scrollPaddingTop = Math.ceil(alturaFixa() + 14) + "px";
  }
  function alvo(hash) {
    if (!hash || hash.length < 2) return null;
    try { return document.getElementById(decodeURIComponent(hash.slice(1))); } catch (e) { return null; }
  }
  function posicao(el) { return Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - alturaFixa() - 14); }

  var temporizador;
  function irPara(el, suave) {
    medir();
    var reduz = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: posicao(el), behavior: suave && !reduz ? "smooth" : "auto" });
    // Imagens "lazy" carregam no caminho e empurram o layout: reconfere até assentar.
    var tentativas = 0;
    clearInterval(temporizador);
    temporizador = setInterval(function () {
      tentativas++;
      if (tentativas < 6) return; // deixa a animação suave terminar (~900 ms)
      var erro = posicao(el) - window.pageYOffset;
      if (Math.abs(erro) > 2) window.scrollTo({ top: posicao(el), behavior: "auto" });
      if (tentativas >= 14) clearInterval(temporizador);
    }, 150);
  }

  // menu do celular
  function fechaMenu() {
    var l = document.querySelector(".nav-links"), b = document.querySelector(".menu-btn");
    if (l) l.classList.remove("aberto");
    if (b) { b.setAttribute("aria-expanded", "false"); var i = b.querySelector("i"); if (i) i.className = "ti ti-menu-2"; }
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".menu-btn");
    if (b) {
      var l = document.querySelector(".nav-links"), ab = l.classList.toggle("aberto");
      b.setAttribute("aria-expanded", ab ? "true" : "false");
      b.querySelector("i").className = ab ? "ti ti-x" : "ti ti-menu-2";
      return;
    }
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) { if (!e.target.closest(".nav-links")) fechaMenu(); return; }
    if (a.closest(".nav-links")) fechaMenu();
    var url;
    try { url = new URL(a.getAttribute("href"), location.href); } catch (err) { return; }
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
    var el = alvo(url.hash);
    if (!el) return;
    e.preventDefault();
    if (history.pushState) history.pushState(null, "", url.hash);
    irPara(el, true);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") fechaMenu(); });

  window.addEventListener("resize", function () { medir(); if (window.innerWidth > 860) fechaMenu(); });
  window.addEventListener("load", function () {
    medir();
    var el = alvo(location.hash);
    if (el) setTimeout(function () { irPara(el, false); }, 50); // link vindo de outra página
  });
  window.addEventListener("popstate", function () { var el = alvo(location.hash); if (el) irPara(el, false); });
  document.addEventListener("DOMContentLoaded", medir);
})();
