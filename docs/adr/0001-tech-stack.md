# 0001. Technology stack

- **Status:** Accepted
- **Date:** 2026-11-28

## Context

OnDuty shows restaurant staff which manager is on duty and lets approved staff contact them. It will be used for real at one restaurant (about 30 concurrent users at most, all in one time zone) and may later be adopted by the corporation's other three restaurants, so the data model must support several restaurants from the start.

Constraints that shaped the choices:

- **One developer**, about 20 hours a week, no hard deadline.
- **Real personal data** (manager phone numbers and photos), so access control must be enforced on the server.
- **Small budget** once hosted.
- **Custom account flows:** self-registration under a restaurant, email verification, admin approval, invitations and removal.
- **Maintainability:** clean, readable code with meaningful tests and CI.

## Decision

| Area | Choice |
| --- | --- |
| Backend | ASP.NET Core Web API on .NET 10 with **minimal APIs** |
| Data access | EF Core, without a generic repository layer on top |
| Database | PostgreSQL (Docker locally) |
| Authentication | ASP.NET Core Identity with HttpOnly cookie authentication |
| Authorization | Role-based (SuperAdmin, Admin, Staff) plus one resource-based check that limits an Admin to their own restaurant |
| Code structure | Layered solution: `Api` → `Infrastructure` → `Core`; `Core` has no framework or database dependencies |
| Frontend | React + TypeScript (strict) with Vite and Tailwind CSS; TanStack Query and React Hook Form + Zod as screens are built |
| API contract | ASP.NET's built-in OpenAPI document, with TypeScript types generated from it |
| Testing | xUnit unit tests, integration tests against real PostgreSQL via Testcontainers, Vitest + Testing Library for the web app |
| Local environment | Docker Compose with PostgreSQL and Mailpit |
| CI | GitHub Actions on every pull request |
| Hosting | Microsoft Azure; the hosting design gets its own record when deployment is built |

## Alternatives considered

**Database**

- **SQL Server:** a natural fit with .NET, but it carries licensing costs for managed hosting and for other restaurants' deployments. PostgreSQL is free everywhere, runs the same in Docker and in the cloud, and supports exclusion constraints, which guarantee that one manager's shifts never overlap.
- **A document database (e.g. Cosmos DB):** the data is relational (restaurants, managers, shifts, users) and ASP.NET Identity expects a relational store.

**Authentication**

- **A hosted identity provider (e.g. Microsoft Entra External ID):** less code to write, but the registration, approval and invitation flows are custom and would fight the provider's model. Identity keeps all auth logic in one codebase.
- **JWTs stored in the browser:** tokens in localStorage can be stolen by any injected script. HttpOnly cookies can't be read by JavaScript, and because the web app and API are served from one origin, cookies work without CORS.

**API style**

- **Controllers:** familiar and fine, but minimal APIs are the current .NET default, need less ceremony for a small API, and have built-in validation since .NET 10. Endpoints are grouped by feature with route groups.

**Architecture**

- **Clean Architecture with MediatR/CQRS:** adds layers and indirection this app doesn't need. A plain three-project layering keeps the important rule (business logic in `Core`, free of the database and web framework) without the ceremony.
- **A single project:** simplest, but makes it easy for database and HTTP concerns to leak into business rules such as the on-duty calculation.

**Frontend**

- **Next.js:** server rendering adds hosting complexity and isn't needed for a small, mostly authenticated app. A static Vite build can be served by the ASP.NET app itself.

## Consequences

- **Easier:** one language per side (C# and TypeScript), one place for all access rules, the same database engine locally and in production, and a frontend that is just static files.
- **Harder:** more auth code to write and secure by hand (verification, reset, approval, invitations, cookie and CSRF settings), all of which needs tests.
- **Revisit if:** the app grows well beyond a handful of restaurants, needs a native mobile app (cookie auth would need rethinking), or a hosted identity provider becomes worth the trade-off.
