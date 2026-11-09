# Architecture Guidelines

- Monorepo/Nx: Feature- and domain-oriented libraries under libs/, apps/ contains Angular frontend and NestJS backend.
- Backend (NestJS + MikroORM):
  - Organize per domain (module, controller, service, entity/DTO). Keep controllers thin; put business logic in services.
  - Use MikroORM repositories/QueryBuilder for data access. Prefer deriving aggregate values (COUNT, SUM, MIN) in the service layer via QB.
  - Keep roster endpoint public (no auth requirement) for wide discoverability.
- Frontend (Angular standalone + Nx):
  - Route configuration per feature lib (e.g., libs/roster). Components are standalone; import CommonModule directives/pipes explicitly.
  - Fetch data via a small feature service using shared ApiService (@realworld/core/http-client). Components remain presentational and async-pipe driven.
  - API contracts live in libs/core/api-types and are exported for re-use.
