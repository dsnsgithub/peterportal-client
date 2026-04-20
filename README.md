![AntAlmanac Logo](site/src/asset/logo.svg)

# About

AntAlmanac Planner is a web application designed to aid UCI students with course discovery and planning. We consolidate public data available on multiple UCI sources via [Anteater API](https://docs.icssc.club/docs/about/anteaterapi) to improve the user experience when planning course schedules. Features include:

- **A drag-and-drop multi-year course planner**:
  - Select multiple majors and minors
  - Import your unofficial transcript via [StudentAccess](https://www.reg.uci.edu/access/student/transcript/?seg=U) to automatically fill in your roadmap to date
  - View how your planned roadmap fulfills your **major**, **specialization**, **minor**, and **GE** requirements
  - Import any **transferred courses**, **AP exams**, and **GE/Elective credits**

![Roadmap](assets/roadmap.png)

- **Course Search**:
  - Recent offerings 
  - Grade distribution visualizations
  - Visual prerequisite tree
  - Historic Schedule of Classes data
  - Reviews from UCI students

![Course Search](assets/coursesearch.png)

- **Instructor Search**:
  - Grade distribution visualizations
  - Historic Schedule of Classes data
  - Reviews from UCI students
  
![Instructor Search](assets/instructorsearch.png)

## Technology

### Frontend
- [React](https://react.dev/) - Library to build dynamic, component-based UIs.
- [Next.js](https://nextjs.org/) - React framework with server-side rendering.
- [Material UI](https://mui.com/material-ui/) - React component library that implements Google's Material Design. 

### Backend
- [Anteater API](https://github.com/icssc/anteater-api) - API maintained by ICSSC for retrieving UCI data.
- [Express](https://expressjs.com/) - Minimalist backend framework for Node.js.
- [tRPC](https://trpc.io/) - Library for type-safe APIs.
- [PostgreSQL](https://www.postgresql.org/) - Relational database for storing user data and planners.
- [Drizzle ORM](https://orm.drizzle.team/) - High-performance type-safe SQL-like access layer.

### Tooling
- [SST](https://sst.dev/) - Infrastructure as code framework for AWS deployment.
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with type-checking.

## History
AntAlmanac Planner was originally created in 2020 under the name **PeterPortal** by a team of ICSSC Projects Committee members led by @uci-mars, aiming to unify fragmented course information and long-term planning resources in one application.

In February 2026, PeterPortal [merged](https://docs.icssc.club/docs/about/antalmanac/merge) with [AntAlmanac](https://github.com/icssc/AntAlmanac/) into one ultimate course planning platform. Following the merger, PeterPortal was rebranded as **AntAlmanac Planner**, while the original AntAlmanac became **AntAlmanac Scheduler**.

Year|Project Lead
:-:|:-:
2020 - 2021|@uci-mars
2021 - 2022|@chenaaron3
2022 - 2023|@ethanwong16
2023 - 2024|@js0mmer
2024 - 2025|@Awesome-E
2025 - Present|@CadenLee2

# Contributing
We welcome all open-source contributions! Here is a rough guide on how to contribute:

## First Time Setup

This guide walks you through a full local dev environment: the Next.js frontend, the Express + tRPC backend, a local PostgreSQL database, and "Sign in with Google" via OIDC. Everything below is a one-time setup — after this, day-to-day dev is just `pnpm dev`.

### 1. Prerequisites

Install the following once:

1. **Node.js 18, 20, or 22 LTS.** Check with `node -v`. If you're on a different version, use [nvm](https://github.com/nvm-sh/nvm) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows).
2. **pnpm 10+** — our package manager. Install with `npm i -g pnpm`.
3. **Docker Desktop** — used to run PostgreSQL locally. Install from [docker.com](https://www.docker.com/products/docker-desktop/) and make sure it's running before the database steps below.
    - If you'd rather use a PostgreSQL server you already have installed (or a managed one like Neon/Supabase), you can skip Docker and just plug its connection string into `DATABASE_URL` in step 4.

### 2. Clone and install

Committee members:

```
git clone https://github.com/icssc/peterportal-client
cd peterportal-client
pnpm install
```

Open-source contributors: [fork the repo](https://github.com/icssc/peterportal-client/fork) first, then clone your fork instead:

```
git clone https://github.com/<your username>/peterportal-client
cd peterportal-client
pnpm install
```

`pnpm install` pulls dependencies for the root, `api`, `site`, and `types` workspaces. It can take a few minutes the first time.

### 3. Start PostgreSQL

Boot a PostgreSQL container bound to the default port `5432`, with a persistent Docker volume so your data survives restarts:

```bash
docker run -d \
  --name peterportal-pg \
  -e POSTGRES_USER=peterportal \
  -e POSTGRES_PASSWORD=peterportal \
  -e POSTGRES_DB=peterportal \
  -p 5432:5432 \
  -v peterportal-pgdata:/var/lib/postgresql/data \
  postgres:17-alpine
```

> On Windows PowerShell, replace the trailing `\` line-continuations with backticks (`` ` ``) or put the whole command on one line.

Useful follow-ups:

- `docker stop peterportal-pg` / `docker start peterportal-pg` — pause and resume the database.
- `docker logs -f peterportal-pg` — tail PostgreSQL logs.
- `docker exec -it peterportal-pg psql -U peterportal` — open a `psql` shell.
- Reset the database from scratch: `docker rm -f peterportal-pg && docker volume rm peterportal-pgdata`, then re-run the `docker run` above.

### 4. Configure environment variables

The backend reads env vars from two files in `api/`, both loaded by [`dotenv-flow`](https://www.npmjs.com/package/dotenv-flow):

- **`api/.env.local`** — committed to git, shared across contributors. Contains the non-secret OIDC config that points at ICSSC's dev auth provider. Leave this alone unless you have a reason to change it.
- **`api/.env`** — git-ignored, yours alone. This is where you put your local database URL, session secret, and any optional secrets.

Create `api/.env` by copying the example:

```
cp api/.env.example api/.env
```

Then fill it in so it looks like this:

```bash
PUBLIC_API_URL=https://anteaterapi.com/v2/rest/
PORT=8080

DATABASE_URL=postgres://peterportal:peterportal@localhost:5432/peterportal
SESSION_SECRET=<any long random string>

ADMIN_EMAILS=[]
```

Notes:

- `PORT=8080` must match the proxy target in `site/next.config.mjs`, which rewrites `/planner/api/*` to `http://localhost:8080/planner/api/*`.
- Generate a good `SESSION_SECRET` with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
- If you use a PostgreSQL server other than the Docker one above, just point `DATABASE_URL` at it — any reachable PostgreSQL 14+ works.
- `ADMIN_EMAILS` is a JSON array of emails that get admin privileges after signing in (e.g. `["you@uci.edu"]`). Leave `[]` if you don't need admin.

### 5. Run database migrations

With `api/.env` populated and PostgreSQL running, apply all Drizzle migrations:

```
pnpm db:migrate
```

You should see `[✓] migrations applied successfully!`. This creates every table the app needs, including the `session` table used by `connect-pg-simple`.

Other Drizzle scripts you may want later:

- `pnpm db:studio` — opens [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview) to browse/edit rows in a browser.
- `pnpm db:generate` — regenerates migration SQL from schema changes (see `api/src/db/schema.ts`).

### 6. Sign in with Google (OIDC)

The backend supports "Sign in with Google" out of the box through ICSSC's shared OIDC provider — the `api/.env.local` committed to this repo is already configured with:

```
OIDC_CLIENT_ID=peterportal-dev
OIDC_ISSUER_URL=https://auth.icssc.club
PRODUCTION_DOMAIN=http://localhost:3000
```

This client authenticates users via Google under the hood, so after step 7 you'll be able to click "Sign in with Google" on the site and land back signed in, with sessions stored in your local PostgreSQL via `connect-pg-simple`.

> ℹ️ If you're deploying your own fork to a different domain, or you want to use a fully separate OIDC provider, register your own OIDC client and override `OIDC_CLIENT_ID`, `OIDC_ISSUER_URL`, and `PRODUCTION_DOMAIN` in `api/.env` (values in `.env` take precedence over `.env.local`).

### 7. Start the dev servers

From the repo root:

```
pnpm dev
```

This starts both servers concurrently:

- **Backend** (Express + tRPC + nodemon) on `http://localhost:8080`
- **Frontend** (Next.js) on `http://localhost:3000`

Visit `http://localhost:3000` — you'll be redirected to `/planner`, and the profile menu will let you sign in with Google.

If you prefer to run them separately, open two terminals and run `pnpm dev` inside `api/` and `site/` respectively.

### 8. (Optional) Anteater API key for search

Course, instructor, and schedule-of-classes search are powered by [Anteater API](https://github.com/icssc/anteater-api), which requires a key. Without one the backend will log:


```
ANTEATER_API_KEY env var is not defined. You will not be able to test search functionality. 
```
**Request one from the [Anteater API Dashboard](https://dashboard.anteaterapi.com/login).**


Everything else — roadmaps, reviews, saved courses, login — works without it. If you need the key to work on a search-related feature, ask in the [ICSSC Projects Discord](https://discord.gg/GzF76D7UhY) `#peterportal` channel, then add it to `api/.env`:

```
ANTEATER_API_KEY=<your key>
```

### Troubleshooting

- **`DATABASE_URL env var is not defined!`** or `SESSION_SECRET` warnings on backend startup — you forgot `api/.env`, or it's missing those keys. `dotenv-flow` loads `api/.env` then `api/.env.local`; `drizzle-kit` only loads `api/.env`, so database-related vars must live there.
- **`ECONNREFUSED 127.0.0.1:5432`** — PostgreSQL isn't running. `docker start peterportal-pg`.
- **Login loops back to `/?error=invalid_state`** — your session cookie isn't surviving the OIDC round-trip. Make sure you're hitting the site via `http://localhost:3000` (not an IP or alternate port) and that `PRODUCTION_DOMAIN` in `api/.env.local` still matches.
- **Port 3000 or 8080 already in use** — kill the existing process, or change `PORT` in `api/.env` (and the rewrite target in `site/next.config.mjs` if you change 8080).
- **Multiple lockfiles warning from Next.js** — harmless. Remove any stray `package-lock.json` in a parent directory, or set `turbopack.root` in `site/next.config.mjs`.

**Have any questions or need some help? Feel free to join the [ICSSC Projects Discord](https://discord.gg/GzF76D7UhY) and ask around in the `#peterportal` channel!**
  

## Open Source Contribution Guide

1. Choose an issue you would like to work on under the issues tab. Leave a comment requesting to work on this issue and wait for confirmation that it is not already assigned.

2. Switch to a branch you will be working on for each issue (pick a name that's relevant).

```
git checkout -b [branch name]
```

3. Once your feature is ready, [open a pull request](https://github.com/icssc/peterportal-client/compare) and a member from our team will review it. Follow the pull request template.

## Running the Project Locally (After Setup)

Once you've done the one-time setup above, day-to-day dev is just:

1. Make sure PostgreSQL is running: `docker start peterportal-pg` (no-op if already running).
2. From the repo root, run `pnpm dev` to start the backend and frontend together.
3. Visit the link printed by Next.js (defaults to <http://localhost:3000>).

You can also run `pnpm dev` inside `api/` and `site/` separately in two terminals if you want their logs split.

# Where Does the Data Come From?

We consolidate our data directly from official UCI sources such as: UCI Catalogue, UCI Public Records Office, and UCI WebReg (courtesy of [Anteater API](https://github.com/icssc/anteater-api)).

# Disclaimer

Although we consolidate our data directly from official UCI sources, this application is by no means an official UCI tool. We strive to keep our data as accurate as possible with the limited support we receive from UCI. Please take this into consideration while using the website.

# Terms & Conditions

There are no hard policies at the moment for utilizing this tool. However, please refrain from abusing the website by methods such as: sending excessive amount of requests in a small period of time or purposely looking to exploit the system.
