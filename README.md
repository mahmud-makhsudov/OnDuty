# OnDuty

Shows restaurant staff which manager is on duty right now.

## Repository layout

| Folder | Contents |
| --- | --- |
| `src/api` | ASP.NET Core API (.NET 10) |
| `src/web` | React + TypeScript web app |
| `infra` | Azure infrastructure (Bicep) |
| `docs/adr` | Architecture Decision Records |

## Running locally

Prerequisites: [.NET 10 SDK](https://dotnet.microsoft.com/download), [Node.js](https://nodejs.org/) (LTS) and [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
# PostgreSQL and the Mailpit email inbox
docker compose up -d

# API on http://localhost:5080
dotnet run --project src/api/OnDuty.Api --launch-profile http

# Web app on http://localhost:5173 (in a second terminal)
cd src/web
npm install
npm run dev
```

| Service | URL |
| --- | --- |
| Web app | http://localhost:5173 |
| API health check | http://localhost:5080/api/health |
| Mailpit (local email inbox) | http://localhost:8025 |
| PostgreSQL | `localhost:5432`, database `onduty`, user `onduty` |

Stop the services with `docker compose down` (add `-v` to also delete the local database).

## Architecture decisions

Key technical decisions are recorded in [docs/adr](docs/adr).
