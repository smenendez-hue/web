import http.server, functools

DIR = "/Users/flatmess/Documents/Claude/Github /yiqi-design-system"
Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=DIR)
httpd = http.server.HTTPServer(('127.0.0.1', 3000), Handler)
print(f'Sirviendo: {DIR}')
print('http://localhost:3000')
httpd.serve_forever()
