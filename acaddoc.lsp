;;; ============================================================
;;; ACADDOC.LSP - URBANO TOOLS (CARREGAMENTO INTELIGENTE)
;;; ============================================================

(defun urbano:init (/ root pastaData cuixPath vlxPath cuiName oldCmdecho)
  (setq root      "C:\\urbano-tools"
        pastaData (strcat root "\\data")
        cuixPath  (strcat pastaData "\\urbano-tools.cuix")
        vlxPath   (strcat pastaData "\\urbano-tools.vlx")  
        cuiName   "URBANO_TOOLS") ; Garanta que este nome seja o "Menu Group Name" definido dentro do CUIX
  
  (prompt "\n[URBANO] Inicializando ecossistema...")
  
  ;; Garante a criação das pastas locais se o cliente for novo
  (if (not (vl-file-directory-p root)) (vl-mkdir root))
  (if (not (vl-file-directory-p pastaData)) (vl-mkdir pastaData))
  
  ;; 1. INTERFACE (CUIX): Carrega SÓ SE o menu NÃO existir na sessão global
  (if (not (menugroup cuiName))
    (if (findfile cuixPath)
      (progn
        (setq oldCmdecho (getvar "CMDECHO"))
        (setvar "CMDECHO" 0)
        ;; Usa o comando via LISP de forma silenciosa
        (vl-cmdf "_.CUILOAD" cuixPath)
        (setvar "CMDECHO" oldCmdecho)
        (prompt "\n[URBANO] Interface Visual (CUIX) carregada com sucesso."))
      (prompt "\n[URBANO] Interface Visual (CUIX) não localizada (será baixada no update)."))
    ;; Opcional: Avisar discretamente que já estava carregado (útil para debug)
    ;; (prompt "\n[URBANO] Interface Visual já ativa.")
  )
  
  ;; 2. MOTOR (VLX): Roda a cada desenho aberto para validar segurança e atualizações
  (if (findfile vlxPath)
    (load vlxPath)
    (prompt "\n[URBANO] Erro Crítico: Motor do sistema não encontrado na pasta data."))
  
  (princ)
)

(urbano:init)
(princ)