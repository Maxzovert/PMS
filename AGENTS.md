# PARKAR AI Instructions

1. Read `memory.md` before any code change.
2. Read relevant documentation before implementation.
3. Use existing architecture and components.
4. Use assets only from `src/assets`.
5. Never hardcode secrets or credentials.
6. Never modify database schema without migration and documentation.
7. Never change public API contracts silently.
8. Run relevant tests before completion.
9. Update documentation and `memory.md` after every completed task.
10. Ask for approval before destructive, architectural or irreversible changes.

## Mandatory context order

`AGENTS.md` → `memory.md` → `documentation/` → relevant code → plan + security note → smallest safe change → test → update docs/memory

## Authority (highest wins)

1. Approved human requirement
2. Security and legal requirements
3. `AGENTS.md` and `.cursor/rules`
4. `memory.md`
5. `documentation/`
6. Existing codebase
7. AI assumptions (last resort)

## Never

- Invent a new standard when a project standard already exists.
- Create a new top-level folder without approval.
- Put full feature specifications inside this file.

See `documentation/ai-engineering-handbook.md` for the full operating manual.
