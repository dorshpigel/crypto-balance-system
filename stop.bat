@echo off
echo 🛑 Stopping NestJS Microservices...

:: Create a temporary file to store process information
echo > temp_processes.txt
wmic process where "name='node.exe'" get commandline, processid /format:csv > temp_processes.txt

:: Look for and stop balance-service
echo 🔍 Looking for balance-service process...
findstr /i "balance-service" temp_processes.txt > balance_pid.txt
if %errorlevel% equ 0 (
  for /f "tokens=2 delims=," %%a in (balance_pid.txt) do (
    echo 🛑 Stopping balance-service (PID: %%a)
    taskkill /F /PID %%a
    if %errorlevel% equ 0 (
      echo ✅ balance-service stopped successfully
    ) else (
      echo ⚠️ Failed to stop balance-service
    )
  )
) else (
  echo ℹ️ No running process found for balance-service
)

:: Look for and stop rate-service
echo 🔍 Looking for rate-service process...
findstr /i "rate-service" temp_processes.txt > rate_pid.txt
if %errorlevel% equ 0 (
  for /f "tokens=2 delims=," %%a in (rate_pid.txt) do (
    echo 🛑 Stopping rate-service (PID: %%a)
    taskkill /F /PID %%a
    if %errorlevel% equ 0 (
      echo ✅ rate-service stopped successfully
    ) else (
      echo ⚠️ Failed to stop rate-service
    )
  )
) else (
  echo ℹ️ No running process found for rate-service
)

:: Clean up temporary files
del temp_processes.txt
del balance_pid.txt
del rate_pid.txt

echo ✨ Stop process completed