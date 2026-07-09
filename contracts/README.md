# Contracts

`openapi.yaml` is the single source of truth for the API boundary. Both sides mirror it:

- Frontend: `types.ts` (imported as `@/contracts/types`).
- Backend: `services/api/app/schemas.py` (Pydantic).

## Keeping them in sync

`services/api/tests/test_contract.py` is a gate test that loads `openapi.yaml` and asserts
the app's generated schema still covers every contracted path, method, and core schema. If
you change an endpoint or a shape, update all three files in the same commit or the gate
fails.

## Versioning

This is `info.version` in `openapi.yaml`. Bump it on any breaking change to a shape or
endpoint, and update both mirrors in the same commit (per the services-first contract rule).
