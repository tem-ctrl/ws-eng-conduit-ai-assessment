# Testing Approach

- Manual acceptance test only (per assessment):
  1) Log in (any user), open Roster page, verify users and stats are shown correctly.
  2) Create a new article, open Roster again, verify your total article count increments.
- Optional smoke checks:
  - Inspect Swagger /docs to see GET /roster listed and returning expected JSON.
  - Scan seed data to spot-check counts.
