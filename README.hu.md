# HelixSoft Stock Management

> 🇬🇧 [English version](README.md)

Full-stack készletkezelő platform, amely lehetővé teszi termékek, raktárak és készletmozgások kezelését, valamint valós idejű készletriportok megtekintését.

---

## Tartalom

- [Technológiai stack](#technológiai-stack)
- [Architektúra](#architektúra)
- [Szerepkörök és jogosultságok](#szerepkörök-és-jogosultságok)
- [API végpontok](#api-végpontok)
- [Lokális futtatás – Docker Compose](#lokális-futtatás--docker-compose)
- [Linting és formázás](#linting-és-formázás)
- [Környezeti változók](#környezeti-változók)
- [Seed adatok – tesztfiókok](#seed-adatok--tesztfiókok)
- [Tesztek futtatása](#tesztek-futtatása)
- [Tervezési döntések és trade-off-ok](#tervezési-döntések-és-trade-off-ok)
- [Deployment](#deployment)

---

## Technológiai stack

### Backend
| Csomag | Szerep |
|---|---|
| [Fastify](https://fastify.dev/) | HTTP szerver |
| [Prisma](https://www.prisma.io/) | ORM + migrációk |
| PostgreSQL | Adatbázis |
| `@fastify/jwt` | JWT alapú authentikáció |
| `@fastify/swagger` + `@fastify/swagger-ui` | API dokumentáció (`/docs`) |
| `bcrypt` | Jelszó hashelés |
| `tsx` | TypeScript futtatása Node.js alatt |
| Vitest + Supertest | Unit és integrációs tesztek |

### Frontend
| Csomag | Szerep |
|---|---|
| React 19 + TypeScript | UI |
| [Vite](https://vite.dev/) | Build tool + dev szerver |
| [MUI (Material UI)](https://mui.com/) | Komponens könyvtár |
| [TanStack Query](https://tanstack.com/query) | Szerver állapot kezelés |
| React Hook Form + Zod | Űrlapkezelés + validáció |
| React Router v7 | Kliens oldali routing |
| Vitest + Testing Library | Frontend tesztek |

---

## Architektúra

```
stock-management/
├── backend/              # Fastify REST API (port 3000)
│   ├── prisma/           # Séma, migrációk, seed
│   └── src/
│       ├── controllers/  # Route handlerek
│       ├── services/     # Üzleti logika
│       ├── repositories/ # Adatbázis lekérdezések (Prisma)
│       ├── middlewares/  # authenticate, requireRole
│       ├── utils/        # Hibaképzők, sendError
│       └── tests/        # Vitest tesztek
└── frontend/             # React SPA (port 5173)
    └── src/
        ├── api/          # Fetch wrapperek
        ├── auth/         # AuthContext, useAuth hook
        ├── components/   # Újrafelhasználható UI komponensek
        ├── pages/        # Oldalak (route-ok)
        ├── routes/       # ProtectedRoute, PublicOnlyRoute
        └── types/        # TypeScript típusok
```

A frontend dev szerver a `/api` kéréseket proxy-n keresztül továbbítja a backendnek (`http://localhost:3000`). Docker Compose környezetben a proxycél `http://backend:3000`.

---

## Szerepkörök és jogosultságok

| Művelet | viewer | manager | admin |
|---|:---:|:---:|:---:|
| Termékek, raktárak, mozgások megtekintése | ✅ | ✅ | ✅ |
| Stock riport megtekintése | ✅ | ✅ | ✅ |
| Stock mozgás rögzítése (IN / OUT / TRANSFER) | ❌ | ✅ | ✅ |
| Termék létrehozása / szerkesztése / törlése | ❌ | ❌ | ✅ |
| Raktár létrehozása / szerkesztése / törlése | ❌ | ❌ | ✅ |

---

## API végpontok

Az összes védett végpont `Authorization: Bearer <token>` fejlécet vár.  
Interaktív dokumentáció elérhető: **`GET /docs`**

### Auth
| Metódus | Útvonal | Leírás |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Bejelentkezés, JWT token visszaadása |

### Termékek
| Metódus | Útvonal | Jogosultság | Leírás |
|---|---|---|---|
| `GET` | `/api/v1/products` | viewer+ | Összes termék listázása (opcionális `?search=` query param) |
| `GET` | `/api/v1/products/:id` | viewer+ | Egy termék részletei (raktárkészletekkel együtt) |
| `POST` | `/api/v1/products` | admin | Új termék létrehozása |
| `PUT` | `/api/v1/products/:id` | admin | Termék szerkesztése |
| `DELETE` | `/api/v1/products/:id` | admin | Termék törlése (csak ha nincs aktív készlet és mozgás) |

### Raktárak
| Metódus | Útvonal | Jogosultság | Leírás |
|---|---|---|---|
| `GET` | `/api/v1/warehouses` | viewer+ | Összes raktár listázása |
| `GET` | `/api/v1/warehouses/:id` | viewer+ | Egy raktár részletei |
| `POST` | `/api/v1/warehouses` | admin | Új raktár létrehozása |
| `PUT` | `/api/v1/warehouses/:id` | admin | Raktár szerkesztése |
| `DELETE` | `/api/v1/warehouses/:id` | admin | Raktár törlése (csak ha üres) |

### Készletmozgások
| Metódus | Útvonal | Jogosultság | Leírás |
|---|---|---|---|
| `GET` | `/api/v1/stock-movements` | viewer+ | Mozgások listázása (szűrhető: `type`, `warehouseId`, `productId`, `startDate`, `endDate`) |
| `POST` | `/api/v1/stock-movements` | manager+ | Új mozgás rögzítése (`IN` / `OUT` / `TRANSFER`) |

### Riportok
| Metódus | Útvonal | Jogosultság | Leírás |
|---|---|---|---|
| `GET` | `/api/v1/reports/stock-on-hand` | viewer+ | Aktuális készletszintek termék és raktár szerint |

### Egyéb
| Metódus | Útvonal | Leírás |
|---|---|---|
| `GET` | `/health` | Szerver egészségellenőrzés |

---

## Lokális futtatás – Docker Compose

### Előfeltételek
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Lépések

1. Másold a `.env.example` fájlt `.env` névre a gyökérkönyvtárban, és töltsd ki az értékeket:

```bash
cp .env.example .env
```

Példa értékek:

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

2. Indítsd el a konténereket:

```bash
docker compose up --build
```

Az első indításkor a backend automatikusan lefuttatja a migrációkat (`prisma migrate deploy`) és a seed scriptet (`prisma db seed`).

3. Nyisd meg a böngészőben:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:3000](http://localhost:3000)
   - Swagger UI: [http://localhost:3000/docs](http://localhost:3000/docs)

---

## Linting és formázás

Mindkét oldal **ESLint**-et használ a lintinghez és **Prettier**-t a kódformázáshoz.

```bash
# Lint
cd backend && npm run lint
cd frontend && npm run lint

# Formázás
cd backend && npm run format
cd frontend && npm run format
```

---

## Környezeti változók

### `.env` a gyökérkönyvtárban (Docker Compose)

| Változó | Leírás |
|---|---|
| `POSTGRES_USER` | PostgreSQL felhasználónév |
| `POSTGRES_PASSWORD` | PostgreSQL jelszó |
| `POSTGRES_DB` | Adatbázis neve |
| `DB_PORT` | Host porton megjelenő Postgres port |
| `DATABASE_URL` | Backend connection string (Compose hálózaton belül) |
| `JWT_SECRET` | JWT titkos kulcs |
| `BACKEND_PORT` | Host porton megjelenő backend port |
| `FRONTEND_PORT` | Host porton megjelenő frontend port |
| `CORS_ORIGIN` | Engedélyezett CORS origin – lokálisan: `http://localhost:5173` |
| `VITE_API_BASE_URL` | Backend alap URL a frontend számára – lokálisan hagyható üresen (a Vite proxy kezeli) |

---

## Seed adatok – tesztfiókok

A `npm run seed` parancs az alábbi adatokat tölti be:

### Felhasználók

| E-mail | Jelszó | Szerepkör |
|---|---|---|
| `admin@helixsoft.com` | `admin123` | admin |
| `manager@helixsoft.com` | `manager123` | manager |
| `viewer@helixsoft.com` | `viewer123` | viewer |

### Raktárak
- Budapest Main Warehouse
- Debrecen Warehouse

### Termékek
- Laptop (SKU-001), Monitor (SKU-002), Keyboard (SKU-003), Mouse (SKU-004), Headset (SKU-005)
- Minden termékből 50 egység a budapesti, 30 egység a debreceni raktárban

---

## Tesztek futtatása

### Backend

```bash
cd backend
npm test
```

A tesztek a következőket fedik le:
- `auth.test.ts` – bejelentkezés: helyes/helytelen hitelesítő adatok, hiányzó body
- `product.test.ts` – SKU egyediség ellenőrzése létrehozáskor
- `stockMovement.test.ts` – OUT mozgás: elégtelen készlet, nem létező stock, sikeres feldolgozás

### Frontend

```bash
cd frontend
npm test
```

---

## Tervezési döntések és trade-off-ok

### Adatbázis és ORM (PostgreSQL + Prisma)
A backendet a kiírásnak megfelelően Fastify keretrendszerben írtam meg. Adatbázisnak a javasolt PostgreSQL-t választottam, mert a raktárak, termékek és mozgások adatai nagyon jól strukturálhatók egy relációs adatbázisban. ORM-ként a Prismát használtam. Ez nagyon sokat segített abban, hogy a kötelező TypeScripttel  együtt a teljes projekt típusbiztos maradjon, és az autocompletion (IDE) felgyorsítsa a munkát.

### Versenyhelyzet (race condition) és atomicitás
A feladat egyik legfontosabb része az volt, hogy a készlet ne mehessen mínuszba , és a raktárközi átmozgatás (TRANSFER) biztonságos (atomikus) legyen. Ezt a Prisma (`Prisma $transaction`) funkciójával oldottam meg az adatbázis szintjén. Ez azt jelenti, hogy a TRANSFER műveletnél a levonás és a hozzáadás egyszerre történik. Ha valaki időközben eladná az utolsó darabot, és a tranzakció egyik fele elbukik, akkor a rendszer az egészet visszavonja (rollback), így megelőztem a versenyhelyzeteket (race condition), és nem csúszik szét a készletünk.

### Frontend technológiák
A kötelező React és TypeScript alapok mellé a Material UI (MUI) komponenskönyvtárat választottam, amit a kiírás is kifejezetten ajánlott. Így nem kellett a CSS-sel nulláról bajlódnom, egyből esztétikus lett a felület, és több időm maradt a React Hook Form + Zod alapú űrlapokra. Az API hívásokhoz és az állapotkezeléshez az elvárt TanStack Query-t használtam. Kényelmessé tette a munkát: automatikusan kezeli a "loading" és "error" állapotokat, és magától újratölti a táblázatokat, miután sikeresen elmentettem egy raktármozgást.

---

## Deployment

A projekt [Render](https://render.com)-en van deployolva:

| Szolgáltatás | URL |
|---|---|
| **Frontend** | [https://stock-management-1-k7lr.onrender.com](https://stock-management-1-k7lr.onrender.com) |
| **Backend API** | [https://stock-management-tznd.onrender.com](https://stock-management-tznd.onrender.com) |
| **Swagger UI** | [https://stock-management-tznd.onrender.com/docs](https://stock-management-tznd.onrender.com/docs) |

- **Backend:** Web Service – `npm run migrate && npm run seed && npm start`
- **Frontend:** Static Site – `npm run build`, publish dir: `dist`

### Szükséges environment változók a Render dashboardon

**Backend (Web Service):**
| Változó | Érték |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | JWT aláíráshoz használt titkos kulcs |
| `CORS_ORIGIN` | `https://stock-management-1-k7lr.onrender.com` |

**Frontend (Static Site – Build Environment Variables):**
| Változó | Érték |
|---|---|
| `VITE_API_BASE_URL` | `https://stock-management-tznd.onrender.com` |

> A `VITE_*` változókat a Vite build-time égeti bele a bundle-be. Ha `VITE_API_BASE_URL` nincs beállítva a Render dashboardon, akkor production-ben az összes API hívás a frontend saját URL-jére menne a backend helyett, és az egész app meghibásodna.
