#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
sleep 1 && open "http://localhost:3000/novedades.html" &
python3 "$DIR/_server.py"
