@echo off
echo 🚀 Deploying NestJS Microservices...

:: Install dependencies if needed
echo 📦 Installing dependencies...
call npm install

:: Build each service explicitly
echo 🔨 Building balance-service...
call nest build balance-service

echo 🔨 Building rate-service...
call nest build rate-service

:: Check if build was successful
if not exist "dist\apps\balance-service" (
  echo ❌ Error: balance-service build failed.
  exit /b 1
)

if not exist "dist\apps\rate-service" (
  echo ❌ Error: rate-service build failed.
  exit /b 1
)

echo ✅ Services successfully built

:: Create logs directory if it doesn't exist
if not exist logs mkdir logs

:: Start balance-service
echo 🔄 Starting balance-service...
start /b cmd /c "node dist\apps\balance-service\main.js > logs\balance-service.log 2>&1"
echo ✅ balance-service started

:: Start rate-service
echo 🔄 Starting rate-service...
start /b cmd /c "node dist\apps\rate-service\main.js > logs\rate-service.log 2>&1"
echo ✅ rate-service started

echo ✨ All services deployed successfully!
echo 📊 Check logs in the 'logs' directory