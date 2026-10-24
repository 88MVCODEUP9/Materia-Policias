#!/bin/sh
# Inicia a biblioteca local; mantenha esta janela aberta enquanto estuda.
cd -- "$(dirname -- "$0")" || exit 1
python3 atualizar.py   # inclui no site os assuntos novos que você colocou nas pastas

# Mata qualquer processo existente na porta 8776 para evitar erro de "Address already in use"
pkill -f "python3 -m http.server 8776" 2>/dev/null || true
sleep 1

exec python3 -m http.server 8776 --bind 127.0.0.1
