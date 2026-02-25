# HelixSoft Stock Management

> 🇭🇺 [Magyar verzió](README.hu.md)

Full-stack inventory management platform for tracking products, warehouses, and stock movements with real-time stock reports.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Roles & Permissions](#roles--permissions)
- [API Endpoints](#api-endpoints)
- [Local Setup – Docker Compose](#local-setup--docker-compose)
- [Linting & Formatting](#linting--formatting)
- [Environment Variables](#environment-variables)
- [Seed Data – Test Accounts](#seed-data--test-accounts)
- [Running Tests](#running-tests)
- [Design Decisions & Trade-offs](#design-decisions--trade-offs)
- [Deployment](#deployment)

---

## Tech Stack

### Backend
| Package | Role |
|---|---|
| [Fastify](https://fastify.dev/) | HTTP server |
| [Prisma](https://www.prisma.io/) | ORM + migrations |
| PostgreSQL | Database |
| `@fastify/jwt` | JWT-based authentication |
| `@fastify/swagger` + `@fastify/swagger-ui` | API documentation (`/docs`) |
| `bcrypt` | Password hashing |
| `tsx` | Running TypeScript directly on Node.js |
| Vitest + Supertest | Unit and integration tests |

### Frontend
| Package | Role |
|---|---|
| React 19 + TypeScript | UI |
| [Vite](https://vite.dev/) | Build tool + dev server |
| [MUI (Material UI)](https://mui.com/) | Component library |
| [TanStack Query](https://tanstack.com/query) | Server state management |
| React Hook Form + Zod | Form handling + validation |
| React Router v7 | Client-side routing |
| Vitest + Testing Library | Frontend tests |

---

## Architecture

```
stock-management/
├── backend/              # Fastify REST API (port 3000)
│   ├── prisma/           # Schema, migrations, seed
│   └── src/
│       ├── controllers/  # Route handlers
│       ├── services/     # Business logic
│       ├── repositories/ # Database queries (Prisma)
│       ├── middlewares/  # authenticate, requireRole
│       ├── utils/        # Error helpers, sendError
│       └── tests/        # Vitest tests
└── frontend/             # React SPA (port 5173)
    └── src/
        ├── api/          # Fetch wrappers
        ├── auth/         # AuthContext, useAuth hook
        ├── components/   # Reusable UI components
        ├── pages/        # Pages (routes)
        ├── routes/       # ProtectedRoute, PublicOnlyRoute
        └── types/        # TypeScript types
```

The frontend dev server proxies all `/api` requests to the backend (`http://localhost:3000`). In Docker Compose the proxy target is `http://backend:3000`.

---

## Roles & Permissions

| Action | viewer | manager | admin |
|---|:---:|:---:|:---:|
| View products, warehouses, movements | ✅ | ✅ | ✅ |
| View stock report | ✅ | ✅ | ✅ |
| Record stock movement (IN / OUT / TRANSFER) | ❌ | ✅ | ✅ |
| Create / edit / delete products | ❌ | ❌ | ✅ |
| Create / edit / delete warehouses | ❌ | ❌ | ✅ |

---

## API Endpoints

All protected endpoints require an `Authorization: Bearer <token>` header.  
Interactive documentation available at: **`GET /docs`**

### Auth
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Login, returns JWT token |

### Products
| Method | Path | Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/products` | viewer+ | List all products (optional `?search=` query param) |
| `GET` | `/api/v1/products/:id` | viewer+ | Product details (including stock per warehouse) |
| `POST` | `/api/v1/products` | admin | Create a new product |
| `PUT` | `/api/v1/products/:id` | admin | Update a product |
| `DELETE` | `/api/v1/products/:id` | admin | Delete a product (only if no active stock or movements) |

### Warehouses
| Method | Path | Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/warehouses` | viewer+ | List all warehouses |
| `GET` | `/api/v1/warehouses/:id` | viewer+ | Warehouse details |
| `POST` | `/api/v1/warehouses` | admin | Create a new warehouse |
| `PUT` | `/api/v1/warehouses/:id` | admin | Update a warehouse |
| `DELETE` | `/api/v1/warehouses/:id` | admin | Delete a warehouse (only if empty) |

### Stock Movements
| Method | Path | Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/stock-movements` | viewer+ | List movements (filterable by `type`, `warehouseId`, `productId`, `startDate`, `endDate`) |
| `POST` | `/api/v1/stock-movements` | manager+ | Record a new movement (`IN` / `OUT` / `TRANSFER`) |

### Reports
| Method | Path | Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/reports/stock-on-hand` | viewer+ | Current stock levels by product and warehouse |

### Other
| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Server health check |

---

## Local Setup – Docker Compose

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Steps

1. Copy `.env.example` to `.env` in the root directory and fill in the values:

```bash
cp .env.example .env
```

Example values:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=stock_management_db
DB_PORT=5432
DATABASE_URL=postgresql://postgres:postgres@db:5432/stock_management_db
JWT_SECRET=your_jwt_secret_here
BACKEND_PORT=3000
FRONTEND_PORT=5173
```

2. Start the containers:

```bash
docker compose up --build
```

On first run the backend automatically executes migrations (`prisma migrate deploy`) and the seed script (`prisma db seed`).

3. Open in browser:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:3000](http://localhost:3000)
   - Swagger UI: [http://localhost:3000/docs](http://localhost:3000/docs)

---

## Linting & Formatting

Both the backend and frontend use **ESLint** for linting and **Prettier** for code formatting.

```bash
# Lint
cd backend && npm run lint
cd frontend && npm run lint

# Format
cd backend && npm run format
cd frontend && npm run format
```

---

## Environment Variables

### `.env` in the root directory (Docker Compose)

| Variable | Description |
|---|---|
| `POSTGRES_USER` | PostgreSQL username |
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `POSTGRES_DB` | Database name |
| `DB_PORT` | Postgres port exposed to the host |
| `DATABASE_URL` | Backend connection string (within Compose network) |
| `JWT_SECRET` | JWT secret key |
| `BACKEND_PORT` | Backend port exposed to the host |
| `FRONTEND_PORT` | Frontend port exposed to the host |
| `CORS_ORIGIN` | Allowed CORS origin – set to `http://localhost:5173` locally |
| `VITE_API_BASE_URL` | Backend base URL for the frontend – leave empty locally (Vite proxy handles it) |

---

## Seed Data – Test Accounts

The `npm run seed` command loads the following data:

### Users

| Email | Password | Role |
|---|---|---|
| `admin@helixsoft.com` | `admin123` | admin |
| `manager@helixsoft.com` | `manager123` | manager |
| `viewer@helixsoft.com` | `viewer123` | viewer |

### Warehouses
- Budapest Main Warehouse
- Debrecen Warehouse

### Products
- Laptop (SKU-001), Monitor (SKU-002), Keyboard (SKU-003), Mouse (SKU-004), Headset (SKU-005)
- Each product: 50 units in Budapest, 30 units in Debrecen

---

## Running Tests

### Backend

```bash
cd backend
npm test
```

Tests cover:
- `auth.test.ts` – login: valid/invalid credentials, missing body
- `product.test.ts` – SKU uniqueness check on creation
- `stockMovement.test.ts` – OUT movement: insufficient stock, no stock record, successful processing

### Frontend

```bash
cd frontend
npm test
```

---

## Design Decisions & Trade-offs

### Database & ORM (PostgreSQL + Prisma)
The backend was built with Fastify as required. PostgreSQL was chosen as the database because the structured relationships between warehouses, products, and movements map naturally to a relational model. Prisma was used as the ORM, which — combined with the TypeScript requirement — ensured end-to-end type safety across the entire project and significantly sped up development through IDE autocompletion.

### Race conditions & atomicity
One of the core requirements was preventing stock from going negative and ensuring TRANSFER operations are atomic. This was handled using database-level transactions (`Prisma $transaction`). For a TRANSFER, the deduction from the source warehouse and the addition to the target warehouse happen in a single transaction. If either step fails (e.g. insufficient stock), the entire transaction rolls back, preventing race conditions and data inconsistencies.

### Frontend technology choices
On top of the required React and TypeScript base, Material UI (MUI) was chosen as the component library, which the project brief explicitly recommended. This avoided spending time on CSS from scratch and kept the UI polished, freeing up time for more complex logic like client-side filtering, multi-column sorting, and form validation with React Hook Form + Zod. TanStack Query was used for API calls and server state management. It conveniently handles loading/error states and automatically refetches data after successful mutations (e.g. after recording a stock movement).

---

## Deployment

The project is deployed on [Render](https://render.com):

| Service | URL |
|---|---|
| **Frontend** | [https://stock-management-1-k7lr.onrender.com](https://stock-management-1-k7lr.onrender.com) |
| **Backend API** | [https://stock-management-tznd.onrender.com](https://stock-management-tznd.onrender.com) |
| **Swagger UI** | [https://stock-management-tznd.onrender.com/docs](https://stock-management-tznd.onrender.com/docs) |

- **Backend:** Web Service – `npm run migrate && npm run seed && npm start`
- **Frontend:** Static Site – `npm run build`, publish dir: `dist`

### Required environment variables in the Render dashboard

**Backend (Web Service):**
| Variable | Value |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `CORS_ORIGIN` | `https://stock-management-1-k7lr.onrender.com` |

**Frontend (Static Site – Build Environment Variables):**
| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://stock-management-tznd.onrender.com` |

> `VITE_*` variables are baked into the bundle at build time by Vite. Without `VITE_API_BASE_URL` set in the Render dashboard, all API calls in production would target the frontend's own URL instead of the backend, breaking the entire app.
