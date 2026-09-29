#!/usr/bin/env python3
"""Servidor local simples: python3 servidor.py [porta]."""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
RAIZ = Path(__file__).resolve().parent
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(RAIZ), **kwargs)
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()
if __name__ == '__main__':
    porta = int(sys.argv[1]) if len(sys.argv) > 1 else 8003
    print(f'Carreiras Policiais em http://localhost:{porta} (Ctrl+C encerra)', flush=True)
    ThreadingHTTPServer(('127.0.0.1', porta), Handler).serve_forever()
