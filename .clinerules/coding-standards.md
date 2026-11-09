# Coding Standards

- TypeScript: strict typing; avoid any. Define request/response interfaces in libs/core/api-types. Prefer readonly fields where possible.
- Angular: standalone components, ChangeDetectionStrategy.OnPush when feasible; favor async pipe over manual subscriptions; keep templates simple and accessible.
- NestJS: shape responses as DTO-like objects (not raw entities). Use interfaces for response contracts; annotate controllers with Swagger decorators when practical (ApiTags).
- Formatting/Linting: adhere to workspace ESLint + Prettier; preserve existing naming conventions (kebab-case files, PascalCase classes, camelCase members).
