#!/bin/sh
# Inicia a biblioteca local; mantenha esta janela aberta enquanto estuda.
cd -- "$(dirname -- "$0")" || exit 1
exec python3 -m http.server 8776 --bind 127.0.0.1
