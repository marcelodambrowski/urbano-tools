/* Seletor de tema (Automático · Escuro · Claro), como na janela Licença do programa.
   Guarda a escolha só neste navegador; sem ela, segue o tema do sistema. */
(function () {
  var raiz = document.documentElement, chave = "urbano-tema";
  function ler() { try { return localStorage.getItem(chave) || "auto"; } catch (e) { return "auto"; } }
  function gravar(v) { try { localStorage.setItem(chave, v); } catch (e) {} }
  function aplicar(v) {
    if (v === "dark" || v === "light") raiz.setAttribute("data-theme", v); else raiz.removeAttribute("data-theme");
    document.querySelectorAll(".tema button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.tema === v ? "true" : "false");
    });
  }
  aplicar(ler());
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".tema button");
    if (!b) return;
    gravar(b.dataset.tema); aplicar(b.dataset.tema);
  });
  document.addEventListener("DOMContentLoaded", function () { aplicar(ler()); });
})();
