import http.server
import functools
from pathlib import Path

DIR = Path(__file__).resolve().parent
Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(DIR))
httpd = http.server.HTTPServer(('127.0.0.1', 3000), Handler)
print(f'Sirviendo: {DIR}')
print('http://localhost:3000')
httpd.serve_forever()
