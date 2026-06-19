# Oslo Bysykkel

A small full-stack app that shows Oslo City Bike stations with the number of
available locks and free bikes right now, using the
[Oslo Bysykkel open API](https://oslobysykkel.no/apne-data/sanntid) (GBFS format).

- A **backend** fetches the live GBFS data, merges it, and serves a clean
  station list over a single endpoint.
- A **frontend** reads that endpoint and plots the stations on a map.

## Project structure

```
oslo-bysykkel/
├── backend/                 # Node + Express + TypeScript API
│   ├── src/
│   │   ├── server.ts        # Express app, GET /api/stations
│   │   ├── gbfs.ts          # fetches the two GBFS feeds
│   │   ├── merge.ts         # merges the feeds into the served shape
│   │   ├── types.ts         # shared type definitions
│   │   └── merge.test.ts    # unit tests for the merge logic
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                # Vite + React + TypeScript + Leaflet map
│   ├── src/
│   │   ├── App.tsx          # map, markers, popups, title + legend
│   │   ├── main.tsx         # React entry point
│   │   └── index.css        # Tailwind import + one Leaflet fix
│   ├── vite.config.ts       # Vite config + /api dev proxy
│   └── package.json
│
└── README.md
```

## Tech stack

**Backend**
- Node.js (runs TypeScript directly, no build step)
- Express — HTTP server and routing
- Native `fetch` — calls the Oslo Bysykkel GBFS feeds
- Node's built-in test runner (`node:test`) — unit tests, no extra framework

**Frontend**
- Vite — dev server and bundler
- React + TypeScript
- Leaflet + react-leaflet — interactive map
- OpenStreetMap — map tiles
- Tailwind CSS v4 — styling (via `@tailwindcss/vite`, no config file)

## Prerequisites

- **Node.js 23.6 or newer** and npm. The backend executes TypeScript directly,
  which requires Node's native type stripping (stable since 23.6). Check your
  version with `node --version`.
- A terminal and an internet connection (the backend calls the live Oslo
  Bysykkel API).

## Getting started

Clone the repository:

```bash
git clone <your-repo-url>
cd oslo-bysykkel
```

The backend and frontend are separate npm projects, so they are installed and
run independently. **The frontend needs the backend running**, so start the
backend first.

### 1. Start the backend

In one terminal:

```bash
cd backend
npm install
npm start
```

This serves the API on **http://localhost:3000**. You can verify it directly:

```bash
curl http://localhost:3000/api/stations
```

For development with auto-reload on file changes, use `npm run dev` instead.

### 2. Start the frontend

In a second terminal (leave the backend running):

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser. Vite proxies `/api` requests to
the backend on port 3000 (see `frontend/vite.config.ts`), so there is no CORS
setup or environment configuration to do.

You should see a map of Oslo with one marker per station — **green** when bikes
are available, **red** when empty. Click a marker to see the station name, the
number of available regular bikes, e-bikes, and free locks.

## The API

`GET /api/stations` returns a JSON array of stations, sorted by name:

```json
[
  {
    "id": "623",
    "name": "7. juni-plassen",
    "availableLocks": 8,
    "availableBikes": 12,
    "bikesByType": { "bike": 10, "ebike": 2 },
    "lat": 59.915079772688216,
    "lon": 10.730589336669283
  }
]
```

- `availableLocks` — free docks at the station
- `availableBikes` — total bikes ready to rent (regular + e-bikes)
- `bikesByType` — that total broken down into regular `bike` and electric `ebike`

If the upstream Oslo Bysykkel API is unreachable, the endpoint responds with
HTTP `502`.

## Tests

The backend has unit tests for the feed-merging logic:

```bash
cd backend
npm test          # runs node's built-in test runner
npm run typecheck # type-checks without emitting
```

## Linting

Both projects use ESLint (flat config) with `typescript-eslint` to check the
source code:

```bash
cd backend
npm run lint

cd ../frontend
npm run lint
```

## Production build (frontend)

To produce an optimized static build of the frontend:

```bash
cd frontend
npm run build     # type-checks and bundles into dist/
npm run preview   # serves the built app locally
```

## Potential improvements

The scope was kept intentionally small. Natural next steps would be:

- **Auto-refresh** — the GBFS data updates every ~15 seconds; the frontend could
  poll `/api/stations` on an interval so availability stays current without a
  manual reload.
- **Resilient upstream calls** — add a timeout (`AbortController`) and a couple
  of retries on the backend's GBFS fetch, so a slow or briefly failing feed
  doesn't immediately surface as a `502`.
- **Response caching** — cache the merged result for a few seconds on the
  backend to avoid hitting the GBFS feeds on every request.
- **Schema validation** — validate the GBFS payloads (e.g. with `zod`) instead
  of trusting the typed shape, to fail loudly if the upstream format changes.
- **Frontend resilience** — a "try again" button on the error state instead of
  requiring a full page reload.
- **Accessibility** — availability is currently shown by colour alone
  (green/red markers), which excludes colourblind users; add a second cue (icon,
  shape, or a count on the marker) and make the map and popups more usable with
  a keyboard and screen reader.
- **CORS / deployment coupling** — the backend sends no CORS headers, so the
  frontend only reaches it through Vite's dev proxy. Deploying the frontend on a
  different origin would require enabling CORS on the backend or serving both
  from the same origin.
- **Broader test coverage** — tests currently cover only the pure merge logic.
  The network layer (`fetchFeed`/`getStations`) and the Express route are
  untested; they could be covered deterministically by mocking the GBFS
  responses with undici's built-in `MockAgent` (no live API calls).
- **Frontend tests** — component tests with Vitest + React Testing Library.
- **Richer map UI** — custom marker icons showing counts at a glance, search /
  filter by station name, or "stations near me" via geolocation.
- **Deployment** — containerise both apps and serve the built frontend behind a
  reverse proxy that routes `/api` to the backend.
