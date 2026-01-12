@echo off
echo ========================================
echo    KNOT CREW - Groupie Tracker Launcher
echo ========================================
echo.
echo Demarrage de l'application...
echo.

cd /d "%~dp0"

echo [1/2] Verification des dependances...
if not exist "node_modules" (
    echo Installation des dependances...
    call npm install
)

echo [2/2] Lancement du serveur de developpement...
echo.
echo L'application sera disponible sur: http://localhost:5173
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

start http://localhost:5173

call npm run dev

pause
