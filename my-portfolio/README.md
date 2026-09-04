# Pavan Aditya — Portfolio

React + Vite + Tailwind portfolio built as an **observability console** — the
visual language of a monitoring tool, because that is the work. Live
coding-profile stats that update on their own, a service-topology diagram, and
the resume served as a downloadable PDF.

## Design system

Dense panels, hard 1px borders, monospace numerics, and signal colours that
carry meaning: green healthy, amber warn, red critical, blue info, violet async.
No blur, no gradients, no rounded glass — the restraint is the point, and it is
what separates this from the standard dark-portfolio template.

Every surface is the same `Panel` primitive (`src/components/ui/index.jsx`): a
bordered box with a label strip, optional status dot, and corner ticks on hover.
Sections map onto console regions — experience is a **deployment log** with
INCOMING/ACTIVE/RESOLVED states, projects are **services**, skills are a
**capability matrix**, coding stats are **live telemetry**, contact is a table of
**endpoints**.

`src/components/ServiceTopology.jsx` draws the streaming backend's architecture
as an actual node graph: gateway fan-out, Kafka carrying async traffic, Saga on
billing failures, Redis in front of the read path. Dashed edges animate to
suggest flow, and the animation drops entirely under `prefers-reduced-motion`.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run lint
```

## Where to edit things

Almost everything you would want to change lives in one file:

| What | Where |
| --- | --- |
| Name, tagline, rotating hero roles | `src/data/profile.js` → `profile` |
| Usernames for the live stat cards | `src/data/profile.js` → `handles` |
| Email, phone | `src/data/profile.js` → `contact` |
| Experience, projects, skills, certs | `src/data/profile.js` |
| Resume PDF | `public/Muttavarapu_Pavan_Aditya_Resume.pdf` |

### Adding the remaining coding profiles

Two handles are still blank. Fill them in and the cards appear automatically —
a card whose handle is an empty string renders nothing at all, so the grid never
shows a broken placeholder:

```js
export const handles = {
    github: 'pavanaditya123',
    leetcode: 'Pavan200053',
    codeforces: '',        // <-- your Codeforces handle
    geeksforgeeks: '',     // <-- your GeeksforGeeks username
};
```

### Replacing the resume

Drop the new PDF into `public/` and point `RESUME_PATH` in `src/data/profile.js`
at it. Keep the filename stable if you have already shared the link anywhere.

## How the live stats work

`src/lib/codingStats.js` fetches each platform directly from the browser, so the
numbers track the real profiles with no server and no redeploy.

- **Codeforces** and **GitHub** have official, CORS-enabled APIs.
- **LeetCode** has no public API, so it falls through a chain of three community
  mirrors until one answers. Contest history comes from a separate, slower
  endpoint and is fetched as its own platform (`leetcodeContest`) so a cold
  start there cannot hold up the main card.
- **GitHub contribution counts** are not in the REST API — they exist only in
  the authenticated GraphQL API — so the heatmap uses a community mirror. If it
  fails, the repo/star/follower counts still render without it.
- **GeeksforGeeks** uses a community endpoint.

### Activity heatmaps

`src/components/Heatmap.jsx` draws both grids from a shared
`{ date, count }[]` shape. Intensity is bucketed against the busiest day in the
window rather than fixed thresholds, so a quiet year still shows a readable
gradient. Streaks and active-day counts are derived in `computeStreaks()`.

LeetCode's language breakdown is deliberately absent: the only mirror exposing
it is currently serving a stale GraphQL query that reports every user as
missing. GitHub's language split covers the same ground.

Because some of those mirrors are volunteer-run, every result is cached in
`localStorage` for 6 hours. If every endpoint for a platform is down, the last
successful response is shown and the card is marked `cached` rather than going
blank. If there is no cache either, the card degrades to a link to the profile.

The **refresh** button next to the LIVE badge forces a fetch past the cache.

## Deploying

**Vercel** — already configured. The app lives in `my-portfolio/` but the git
repo root is one level up, so a default import would not find `package.json`.
The `vercel.json` at the repo root handles that:

```json
{
  "installCommand": "npm install --prefix my-portfolio",
  "buildCommand": "npm run build --prefix my-portfolio",
  "outputDirectory": "my-portfolio/dist"
}
```

Import the repo on Vercel and leave Root Directory as the repo root — no other
setup. Every push to `main` redeploys automatically. (If you instead set Root
Directory to `my-portfolio`, Vercel auto-detects Vite and ignores this file;
that works too.)

Because the stats are fetched in the browser, the deployed numbers keep climbing
without any rebuild.

**GitHub Pages** — the site would be served from `/portfolio/`, so set the base
path first in `vite.config.js`:

```js
export default defineConfig({ plugins: [react()], base: '/portfolio/' })
```

Then publish `dist/` to the `gh-pages` branch.

## Accessibility and performance notes

- Everything animated respects `prefers-reduced-motion`: the 3D mesh stops
  rotating, counters snap to their value, and the cypher text renders instantly.
- The background canvas pauses when the tab is hidden.
- Counters fall back to a timeout, so a throttled tab still lands on the real
  number instead of sitting at zero.
