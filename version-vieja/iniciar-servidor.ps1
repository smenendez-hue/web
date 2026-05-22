$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir
Start-Process "http://localhost:3000/novedades.html"
if (Get-Command py -ErrorAction SilentlyContinue) {
    py -3 .\_server.py
} else {
    python .\_server.py
}
