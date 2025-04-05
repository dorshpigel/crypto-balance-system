@echo off
echo 📊 Checking status of NestJS Microservices...

:: Find node processes running the services
set BALANCE_RUNNING=0
set RATE_RUNNING=0

:: This will check for processes containing the service names
for /f "tokens=*" %%i in ('tasklist /fi "imagename eq node.exe" /fo csv') do (
  echo %%i | find "balance-service" > nul
  if not errorlevel 1 set BALANCE_RUNNING=1
  
  echo %%i | find "rate-service" > nul
  if not errorlevel 1 set RATE_RUNNING=1
)

:: Display status for each service
if %BALANCE_RUNNING%==1 (
  echo ✅ balance-service is running
) else (
  echo ❌ balance-service is not running
)

if %RATE_RUNNING%==1 (
  echo ✅ rate-service is running
) else (
  echo ❌ rate-service is not running
)

echo.
echo 📝 Check logs in the 'logs' directory for more details:
echo - logs\balance-service.log
echo - logs\rate-service.log