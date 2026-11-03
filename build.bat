@echo off
echo ==========================================
echo Building Smart Clinic Management Platform
echo ==========================================

echo [1/3] Building Backend (TypeScript to JavaScript)...
cd backend
call npm run build
if %errorlevel% neq 0 (
    echo Backend build failed!
    pause
    exit /b %errorlevel%
)
cd ..

echo [2/3] Building Frontend (React + Vite + Tailwind)...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed!
    pause
    exit /b %errorlevel%
)
cd ..

echo [3/3] Build Completed Successfully!
echo ==========================================
echo Production distribution files generated:
echo  - Backend:  backend\dist\
echo  - Frontend: frontend\dist\
echo ==========================================
echo You can run 'npm start' or double-click start-production.bat
pause
