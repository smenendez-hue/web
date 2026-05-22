@echo off
cd /d "%~dp0"
start "" "http://localhost:3000/novedades.html"
py -3 "_server.py" || python "_server.py"
