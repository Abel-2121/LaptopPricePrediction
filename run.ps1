# Predict.io Full-Stack Launcher
# Initializes AI Core, Backend API, and Frontend concurrently.

Write-Host "Starting Predict.io System Architecture..." -ForegroundColor Cyan

# 1. Verify and Start Python AI Microservice
Write-Host "🔍 Resolving Python Environment..." -ForegroundColor Cyan

$pythonCmd = "python"
try {
    $null = Get-Command $pythonCmd -ErrorAction Stop
} catch {
    try {
        $null = Get-Command "python3" -ErrorAction Stop
        $pythonCmd = "python3"
    } catch {
        Write-Host "❌ ERROR: Python is not found on your system PATH!" -ForegroundColor Red
        Write-Host "👉 Please install Python 3.9+ and ensure it's added to your PATH environment variable." -ForegroundColor Yellow
        Pause
        Exit 1
    }
}

Write-Host "✅ Using Python Command: $pythonCmd" -ForegroundColor Green

# Check and install python dependencies
Write-Host "📦 Verifying Python dependencies..." -ForegroundColor Cyan
& $pythonCmd -c "import flask, flask_cors, pandas, sklearn, joblib, numpy" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Missing Python dependencies. Installing requirements..." -ForegroundColor Yellow
    & $pythonCmd -m pip install -r "$PSScriptRoot/predict-io/backend/ml/requirements.txt"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Python dependencies. Please run 'pip install -r predict-io/backend/ml/requirements.txt' manually." -ForegroundColor Red
    } else {
        Write-Host "✅ Python dependencies installed successfully!" -ForegroundColor Green
    }
} else {
    Write-Host "✅ All Python dependencies are already installed!" -ForegroundColor Green
}

Write-Host "🚀 Starting Python AI Microservice (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot/predict-io/backend/ml'; $pythonCmd app.py" -WindowStyle Normal

# Give the Python AI service 4 seconds to load its model and start listening
Write-Host "⏳ Waiting for AI Core to load machine learning models..." -ForegroundColor Gray
Start-Sleep -Seconds 4

# 2. Start Node.js Backend API
Write-Host "🚀 Starting Node.js Backend API (Port 3001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot/predict-io/backend'; node server.js" -WindowStyle Normal

# Give the Node.js API server 2 seconds to initialize and bind to the port
Write-Host "⏳ Waiting for Node.js API to establish security links..." -ForegroundColor Gray
Start-Sleep -Seconds 2

# 3. Start React Frontend
Write-Host "🚀 Starting React Frontend (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot/predict-io/frontend'; npm run dev" -WindowStyle Normal

Write-Host "`n✅ System initialized successfully!" -ForegroundColor Green
Write-Host "📍 AI Core:      http://127.0.0.1:5000" -ForegroundColor Green
Write-Host "📍 API Backend:  http://localhost:3001/api" -ForegroundColor Green
Write-Host "📍 UI Frontend:  http://localhost:5173" -ForegroundColor Green
