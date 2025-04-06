<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

<h2 align="center">Crypto Balance System</h2>
<p align="center">A modular, scalable, and testable NestJS-based system for managing crypto holdings and real-time valuation.</p>

---

## 🚀 Features

- 🧱 **Modular Architecture** using NestJS monorepo
- 📈 **Balance Microservice**: Handles asset holdings per user and rebalancing logic
- 🌐 **Rate Microservice**: Fetches real-time data from CoinGecko API and caches it with TTL
- 🧰 **Shared Library**:
  - Centralized logging service
  - File-based data persistence
  - Common types/interfaces
- 🔄 **Scheduled Cron Job** in `rate-service` to refresh rates every minute
- 🚦 **Throttling** enabled with `@nestjs/throttler` to limit excessive requests (e.g., 10 req/min per IP)
- 📄 **Swagger API Docs** auto-generated for each service
- 🧪 **Unit tests** with Jest and ts-jest
- 🛡 Simple `.env` config and local scripts for all OSes

---

## 📚 Swagger API

After services are running, visit:

- **Balance Service**: [http://localhost:3000/api](http://localhost:3000/api)
- **Rate Service**: [http://localhost:3001/api](http://localhost:3001/api)

---

## 🧩 Setup:

- **Linux/Mac**: run bash file on root
- **Windows**: run deploy/stop/status files on root
- **General node setup instructions**: On project root after adding the env file,on console:
1.npm i
2.npm run build
3.npm run start-rate
4.In a new terminal - npm run start-balance
5.You should be good to go.

For any issues please feel free to reach out.

