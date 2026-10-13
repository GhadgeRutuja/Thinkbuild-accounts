# ThinkBuild Accounts (Stage 1)

**ThinkBuild Accounts** is an enterprise-grade accounting and financial resource management platform tailored for high-volume transactions, inventory tracking, auditing, and multi-tenant ledger integrity.

This repository contains the complete Stage 1 architecture:
- **Backend**: Spring Boot 3 with Java 21, Spring Security (JWT RBAC), Spring Data JPA, Flyway migrations, and Kafka event streaming.
- **Frontend**: Modern Angular single-page application adhering to the ThinkBuild minimalist design system.
- **Infrastructure**: Docker Compose orchestration for PostgreSQL 16, Redis 7 (in-memory caching / token blacklisting), Confluent Kafka 7.6 in KRaft mode, backend API, and Nginx reverse proxy.

---

## Prerequisites

Ensure the following tools are installed on your host system:

| Tool | Minimum Version | Notes |
| :--- | :--- | :--- |
| **Docker & Docker Compose** | Docker Desktop 24.0+ / Compose v2.20+ | Required for containerized orchestration |
| **Java Development Kit (JDK)** | OpenJDK / Temurin 21 LTS | Required for local backend development |
| **Apache Maven** | Maven 3.9+ | Required for building backend artifacts |
| **Node.js & npm** | Node.js 20 LTS (or 22 LTS), npm 10+ | Required for local frontend development |

---

## Quick Start (Full Docker Stack)

To spin up the entire application stack using Docker Compose:

1. **Navigate to the infrastructure directory:**
   ```bash
   cd infra
   ```

2. **Initialize the environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Build and launch all services:**
   ```bash
   docker compose up --build
   ```

To run in detached (background) mode:
```bash
docker compose up -d --build
```

To stop all services and preserve data volumes:
```bash
docker compose down
```

To wipe volumes completely and reset data:
```bash
docker compose down -v
```

---

## Service URLs

Once the stack is running, access the services using the endpoints below:

| Component | URL | Notes |
| :--- | :--- | :--- |
| **Frontend Web App** | [http://localhost](http://localhost) | Nginx reverse proxy routing to Angular SPA |
| **Backend REST API** | [http://localhost:8080](http://localhost:8080) | Direct Spring Boot API endpoint |
| **Swagger UI Documentation** | [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) | Interactive OpenAPI 3 specification |
| **OpenAPI Raw Spec** | [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs) | JSON schema representation |
| **Apache Kafka (Host Access)** | `localhost:29092` | KRaft external client bootstrap server |

---

## Default User Credentials

The database migrations seed initial test accounts representing key organizational roles:

| Username | Default Password | Role | Description / Permissions |
| :--- | :--- | :--- | :--- |
| `admin` | `Admin@123` | **ADMIN** | Full administrative rights, user management, system configs |
| `accountant1` | `Accountant@123` | **ACCOUNTANT** | General ledger, journal vouchers, financial statements |
| `storekeeper1` | `StoreKeeper@123` | **STOREKEEPER** | Inventory, goods receipt, delivery notes, stock valuation |
| `sales1` | `Sales@123` | **SALES** | Invoices, credit notes, customer accounts |
| `cashier1` | `Cashier@123` | **CASHIER** | Cash registers, counter payments, receipts |
| `viewer1` | `Viewer@123` | **VIEWER** | Read-only access to ledger reports and dashboards |

---

## Port Mapping Table

The table below outlines external host ports and container internal network ports:

| Service Name | Container Name | Container Port | Host Port | Protocol / Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `frontend` (Nginx) | `thinkbuild-frontend` | `80` | `80` | HTTP web traffic & SPA asset delivery |
| `backend` | `thinkbuild-backend` | `8080` | `8080` | HTTP REST API & actuator endpoints |
| `db` (PostgreSQL) | `thinkbuild-db` | `5432` | `5432` | PostgreSQL relational database |
| `redis` | `thinkbuild-redis` | `6379` | `6379` | In-memory key-value cache / session store |
| `kafka` (KRaft) | `thinkbuild-kafka` | `9092` (internal)<br>`9093` (controller)<br>`29092` (host) | `29092` | Apache Kafka client event broker |

---

## Architecture Overview

ThinkBuild Accounts adopts an event-driven, decoupled micro-layered architecture engineered for auditability, high throughput, and zero financial inconsistency:

```
                      +-----------------------------+
                      |     Client Web Browser      |
                      +-----------------------------+
                                     |
                                     v
                        [Port 80] Nginx Proxy
                       /                      \
        (Static SPA Assets)              (Reverse Proxy /api)
                     v                                  v
        +-------------------------+      +-------------------------------+
        |   Angular 17+ SPA       |      |   Spring Boot 3 API (Java 21) |
        |  (ThinkBuild Design Sys)|      |  - Stateless JWT Auth (RBAC)  |
        +-------------------------+      |  - Double-Entry Ledger Engine |
                                         +-------------------------------+
                                            /           |           \
                                           /            |            \
                                          v             v             v
                           +----------------+   +---------------+   +-------------------+
                           | PostgreSQL 16  |   |    Redis 7    |   | Kafka 7.6 (KRaft) |
                           | Persistent DB  |   | Session Cache |   |  Audit & Journal  |
                           | & Ledger State |   |  & Blacklist  |   |   Event Streams   |
                           +----------------+   +---------------+   +-------------------+
```

### Key Architectural Pillars:
1. **Stateless Authentication with Sliding Refresh**:
   - Access tokens are signed JWTs with a 15-minute expiration window.
   - Refresh tokens are long-lived (7 days) and validated against Redis for revocation capabilities.
2. **Strict Double-Entry Ledger Principles**:
   - Journal entries require balanced debits and credits prior to transaction commitment.
   - Immutable audit logs streamed to Apache Kafka topics for asynchronous financial auditing.
3. **Kafka KRaft Architecture**:
   - Modern Kafka deployment operating without ZooKeeper, utilizing Confluent KRaft consensus metadata quorum.
4. **Nginx Frontend & Edge Layer**:
   - High-efficiency static file serving with 1-year immutable caching for fingerprinted assets.
   - Dynamic gzip compression and sub-millisecond reverse proxying to Spring Boot.

---

## Local Development Setup (Without Dockerizing App Services)

For iterative local coding with hot reload, run PostgreSQL, Redis, and Kafka in Docker while executing the Backend and Frontend on your host machine.

### 1. Launch Backing Services via Docker

From the `infra` directory, start only the storage and messaging containers:

```bash
cd infra
cp .env.example .env
docker compose up -d db redis kafka
```

Verify that all three services pass health checks:
```bash
docker compose ps
```

### 2. Run Backend (Spring Boot & Java 21)

Ensure your active JDK is version 21:
```bash
java -version
```

Navigate to the backend directory and launch the application:
```bash
cd ../backend

# Set environment variables for local host connection (or rely on application-dev.yml)
export DB_URL="jdbc:postgresql://localhost:5432/thinkbuild_accounts"
export DB_USERNAME="thinkbuild"
export DB_PASSWORD="ThinkBuild@2024"
export REDIS_HOST="localhost"
export REDIS_PORT="6379"
export KAFKA_BOOTSTRAP_SERVERS="localhost:29092"
export JWT_SECRET="c21NdmhkK3k2QkxvSEJCVUZSZDRhT0Jrc21yU09iQ3JBNTN0N0hscXNuaz0="
export JWT_REFRESH_SECRET="djl5WGpndzBNY3lEaXkrcVJVRzM5N211Y1N5dmtxNjhIeXh6clNZcW1MQT0="

# Run using Maven
mvn clean spring-boot:run
```

The backend server starts on port `8080`.

### 3. Run Frontend (Angular)

In a separate terminal window:
```bash
cd frontend
npm install
npm start
```

The frontend development server starts on `http://localhost:4200` and proxies API calls to `http://localhost:8080`.

---

## Documentation Links

- **Design System Specification**: [docs/DESIGN.md](docs/DESIGN.md)
- **API Documentation**: Available at `/swagger-ui.html` during runtime.
