#!/bin/bash

set -e  # Stop on any error

echo "📦 Installing dependencies..."
npm install

echo "📝 Creating .env files..."

mkdir -p apps/balance-service/data
mkdir -p apps/rate-service/data

cat > apps/balance-service/.env <<EOF
balancePort=3000
ratePort=3001
RATE_SERVICE_URL='http://localhost:3001'
BALANCE_SERVICE_URL='http://localhost:3000'
BALANCE_FILE='data/balances'
RATES_FILE='data/balances'
ENABLE_RATE_CRON=true
EOF

cat > apps/rate-service/.env <<EOF
PORT=3001
RATES_FILE=data/rates
EOF

echo "🚀 Starting services with concurrent..."

npx concurrently \
  -n "rate,balance" \
  -c "cyan,green" \
  "npm run start-rate" \
  "npm run start-balance"
