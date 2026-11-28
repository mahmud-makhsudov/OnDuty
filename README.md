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

```bash
# API on http://localhost:5080
dotnet run --project src/api/OnDuty.Api --launch-profile http

# Web app on http://localhost:5173 (in a second terminal)
cd src/web
npm install
npm run dev
```
