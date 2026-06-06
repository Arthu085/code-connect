# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

pnpm monorepo with two apps under `apps/`:

- `apps/api` — NestJS REST API (TypeScript), runs on port 3000
- `apps/web` — Vite + TypeScript frontend (vanilla TS, no UI framework yet)

## Commands

All commands use pnpm. Run from the repo root unless noted.

### Development

```bash
pnpm dev                  # run both api and web in parallel (watch mode)
pnpm web:dev              # web only (Vite HMR)
pnpm api:dev              # api only (NestJS watch)
```

### Build

```bash
pnpm web:build            # tsc + vite build
pnpm api:build            # nest build → dist/
pnpm api:start            # run built api (node dist/main)
```

### API tests (run from apps/api or via filter)

```bash
pnpm --filter api test              # unit tests (Jest, *.spec.ts)
pnpm --filter api test:watch        # watch mode
pnpm --filter api test:cov          # with coverage
pnpm --filter api test:e2e          # e2e (test/jest-e2e.json)
```

Run a single test file:

```bash
pnpm --filter api test -- src/app.controller.spec.ts
```

### Lint & format

```bash
pnpm --filter api lint    # eslint --fix on src/ and test/
pnpm --filter api format  # prettier --write
```

## Architecture

### API (`apps/api`)

Standard NestJS module structure. Entry point: `src/main.ts` → `AppModule`. The module wires controllers and providers via decorators (`@Module`, `@Controller`, `@Injectable`). Test files live alongside source as `*.spec.ts`; e2e tests are in `test/`.

#### REST conventions

- **Resources as nouns**: routes must be noun-based and plural (`/posts`, `/users/:id`), never verbs.
- **Correct HTTP verbs**: `GET` for reads, `POST` for creation, `PUT`/`PATCH` for updates, `DELETE` for deletion.
- **Meaningful status codes**: `200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `404 Not Found`, `409 Conflict`, `422 Unprocessable Entity`, `500 Internal Server Error` — use the most specific one.
- **Consistent response shape**: successful responses return the resource or a list of resources; error responses return `{ message, statusCode }`.
- **Stateless**: no session state on the server; auth context must come from the request itself (e.g. JWT).

### Web (`apps/web`)

Plain TypeScript with Vite. No framework installed yet — `src/main.ts` is the entry point doing vanilla DOM manipulation. Assets live in `src/assets/`.

#### Frontend conventions

- **Atomic Design**: organize components under `src/components/` following the hierarchy `atoms/`, `molecules/`, `organisms/`, `templates/`, `pages/`. Place each component in its own directory with an `index.tsx` and a co-located `*.test.tsx`.
- **Tailwind CSS**: use Tailwind utility classes for all styling. Avoid arbitrary CSS files for components.
- **Tests**: every component must have a test covering its essential usage (render, key interactions, critical props). Use the project's test runner; no component is considered done without a passing test.

### Workspace

`pnpm-workspace.yaml` includes `apps/*`. Cross-app commands use `pnpm --filter <name>` where `<name>` is the `name` field in each `package.json` (`api` and `web`).

## Git

All commits in both apps must follow **Conventional Commits**:

```
<type>(optional scope): <short description>
```

Common types: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`, `style`, `perf`, `ci`.

Examples:
- `feat(web): add Button atom with Tailwind styles`
- `fix(api): return 404 when post is not found`
- `test(web): cover Card molecule render`
- `chore: update pnpm lockfile`
