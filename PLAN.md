Conduit Roster – Implementation Plan

Context and Goal
- Add a new “Roster” page that lists all users with per-author stats so readers can find and follow popular authors.
- Stats per user:
  - Username with link to their profile (/profile/:username)
  - Total number of articles (0 if none)
  - Total number of favorites received on their articles (0 if none)
  - Date of their first posted article (empty if none)
- Acceptance: After creating a new article, your article count on the Roster should increment accordingly.

Decisions (from stakeholder clarifications)
- Ranking: Sort strictly by total favorites received across an author’s articles (descending). No secondary sorting.
- Pagination: None for now; return all users.
- Date format: Use the same format as the Home page article preview (Angular DatePipe with 'longDate').
17 | Architecture Guidelines
18 | - Monorepo with Nx: features live under libs/, apps/ contains Angular frontend and NestJS backend.
19 | - Backend (NestJS + MikroORM):
20 |   - Organize per domain (module, controller, service, entity/DTO). Keep controllers thin; put business logic in services.
21 |   - Use MikroORM repositories/QueryBuilder for data access. Prefer deriving aggregate values (COUNT, SUM, MIN) in the service layer via QB.
22 |   - Keep roster endpoint public (no auth requirement) for wide discoverability.
23 | - Frontend (Angular standalone + Nx):
24 |   - Route configuration per feature lib (e.g., libs/roster). Components are standalone; import CommonModule directives/pipes explicitly.
25 |   - Fetch data via a small feature service using shared ApiService (@realworld/core/http-client). Components remain presentational and async-pipe driven.
26 |   - API contracts live in libs/core/api-types and are exported for reuse.
27 | 
28 | Coding Standards
29 | - TypeScript: strict typing; avoid any. Define request/response interfaces in libs/core/api-types. Prefer readonly fields where possible.
30 | - Angular: standalone components, ChangeDetectionStrategy.OnPush; favor async pipe over manual subscriptions; keep templates simple and accessible.
31 | - NestJS: shape responses as DTO-like objects (not raw entities). Use interfaces for response contracts; annotate controllers with Swagger decorators (ApiTags).
32 | - Formatting/Linting: adhere to workspace ESLint + Prettier; preserve existing naming conventions (kebab-case files, PascalCase classes, camelCase members).
33 | 
34 | Testing Approach (per assessment guidance)
35 | - Manual acceptance test only:
36 |   1) Log in (any user), open Roster page, verify users and stats are shown correctly.
37 |   2) Create a new article, open Roster again, verify your total article count increments.
38 | - Optional smoke checks:
39 |   - Inspect Swagger /docs to see GET /roster listed and returning expected JSON.
40 |   - Scan seed data to spot-check counts.
See .clinerules/testing.md

Backend Design
- New domain: Roster
  - Files (apps/backend/src/roster/):
    - roster.interface.ts
      - export interface RosterEntry { username: string; articlesCount: number; favoritesCount: number; firstArticleDate: string | null }
      - export interface RosterResponse { roster: RosterEntry[] }
    - roster.service.ts
      - getRoster(): Promise<RosterResponse>
      - Use MikroORM QueryBuilder to LEFT JOIN user u to article a to include users with zero articles.
      - SELECT columns:
        - u.username as username
        - COUNT(a.id) as articlesCount
        - COALESCE(SUM(a.favorites_count), 0) as favoritesCount
        - MIN(a.created_at) as firstArticleDate
      - GROUP BY u.id
      - ORDER BY favoritesCount DESC (strictly)
      - Map raw result rows to RosterEntry, converting date to ISO string if present; null otherwise.
    - roster.controller.ts
      - @Controller('roster') with @Get() returning RosterResponse.
      - @ApiTags('roster') for Swagger grouping.
    - roster.module.ts
      - Provide controller and service.
  - Wire RosterModule in apps/backend/src/app.module.ts (imports: [RosterModule, ...]).

Notes
- DB schema (see InitialMigration) uses snake_case for columns; MikroORM QB should reference correct physical names (e.g., favorites_count, created_at) when aggregating over the article table.
- No authentication required for /roster.

Frontend Design
- API Types (libs/core/api-types/src/lib/roster.ts):
  - export interface RosterEntry { username: string; articlesCount: number; favoritesCount: number; firstArticleDate: string | null }
  - export interface RosterResponse { roster: RosterEntry[] }
  - Export from libs/core/api-types/src/index.ts
- Data Access (libs/roster/src/lib/roster.service.ts):
  - Injectable service using ApiService to GET '/roster' and return Observable<RosterResponse>.
- UI (libs/roster/src/lib/roster.component.ts and .html):
  - Component: standalone, OnPush; import NgIf, NgFor, AsyncPipe, DatePipe, RouterLink.
  - Expose roster$ = rosterService.getRoster().
  - Template: heading “Conduit Roster” and a table with columns:
    - Rank (# row index + 1)
    - Author (routerLink to /profile/:username)
    - Total Articles
    - Total Favorites
69 |     - First Article (format using date:'longDate' or similar; show empty cell if null)

Edge Cases & Considerations
- Users with no articles: appear with 0 counts and blank first date (LEFT JOIN + COALESCE + MIN handling).
- Ties in favorites: ordering left unspecified beyond favorites-only sort; natural DB order may break ties non-deterministically, which is acceptable per decision (no secondary sort).
- Performance: For assessment-scale data this simple GROUP BY is sufficient. If the dataset grows, consider indexed views/materialization or separate stats table updated via triggers/jobs.

Step-by-Step Checklist (to implement next)
1) [Done] Backend: add roster interfaces, service (QB aggregation), controller, module; import module in AppModule; ensure Swagger tags show in /docs.
2) Frontend: add roster API types and export; implement roster service; implement component logic and template.
3) Manual verify per acceptance steps.

Done when
- GET /roster returns all users with correct stats and sorted by total favorites desc.
- Frontend Roster page renders the table as specified.
- Creating a new article updates your articles count on the Roster.
