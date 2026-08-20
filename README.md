# Musica

Musica is a place where musicians and producers connect. Artists upload and
share their tracks, listeners discover and comment on new music, and
producers can browse tracks that are looking for help and offer to
collaborate.

## Features

- **Accounts & roles** — sign up as an **Artist** (upload & share music) or a
  **Producer** (discover artists and offer production help).
- **Upload & share** — artists upload audio files (MP3, WAV, OGG, FLAC, AAC)
  with a title, genre, and description, and can flag a track as "seeking
  production help".
- **Discover feed** — a public feed of all uploaded tracks with inline
  playback, filterable by genre or by tracks seeking help.
- **Comments** — anyone signed in can leave feedback on a track.
- **Production offers** — producers can send a message offering to help
  produce a track; the artist can accept or decline it from the track page
  or their dashboard.
- **Profiles & following** — every user has a profile page listing their
  tracks (for artists) and follower count; users can follow one another.
- **Dashboards** — artists see their tracks and incoming offers; producers
  see tracks seeking help and the offers they've sent.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Prisma](https://www.prisma.io) + PostgreSQL for the database
- [NextAuth.js v5](https://authjs.dev) (credentials provider) for auth
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) for audio file
  storage, uploaded directly from the browser

## Getting started locally

You need a Postgres database (a free local one works fine) and a Vercel Blob
store (see [Deploying to Vercel](#deploying-to-vercel) below for the easiest
way to get one, even for local dev).

```bash
npm install
npx prisma migrate dev   # applies the schema to your Postgres database
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Environment variables (see `.env`):

- `DATABASE_URL` — Postgres connection string
- `AUTH_SECRET` — secret used to sign session tokens (set a strong random
  value in production; generate one with `openssl rand -base64 32`)
- `NEXTAUTH_URL` — the app's public URL
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob store token (used by `/api/upload`
  to authorize direct-from-browser uploads)

## Deploying to Vercel

1. **Import the repository** at [vercel.com/new](https://vercel.com/new),
   pointing it at this GitHub repo.
2. **Add storage** from the project's *Storage* tab, before the first
   deploy or any time after:
   - **Postgres** (e.g. Neon, via Vercel's Postgres integration) — this
     automatically sets `DATABASE_URL` (and related env vars) on the
     project.
   - **Blob** — this automatically sets `BLOB_READ_WRITE_TOKEN`.
3. **Set `AUTH_SECRET` and `NEXTAUTH_URL`** manually in the project's
   Environment Variables settings (`NEXTAUTH_URL` is your production
   domain, e.g. `https://your-app.vercel.app`).
4. **Deploy.** The build command (`prisma migrate deploy && next build`)
   applies the database schema automatically on every deploy — no manual
   migration step needed.

## Project structure

- `prisma/schema.prisma` — data model (`User`, `Track`, `Comment`,
  `ProductionOffer`, `Follow`)
- `src/lib/auth.ts` — NextAuth configuration
- `src/lib/actions.ts` — server actions for registration, comments, offers,
  and following
- `src/app/api/upload/route.ts` — authorizes direct-to-Blob client uploads
  (checks the signed-in user is an Artist before issuing an upload token)
- `src/components/UploadForm.tsx` — uploads the audio file straight from
  the browser to Vercel Blob, then calls `createTrack` with the resulting
  URL to save the track
- `src/app` — pages (discover feed, signup/login, upload, track detail,
  profile, dashboard)

## Notes

- Audio uploads go straight from the browser to Vercel Blob (bypassing the
  server), so there's no practical request-size limit from the app's own
  infrastructure — the 30MB cap in `src/lib/validation.ts` is a product
  choice, not a technical one.
- Postgres is required — SQLite won't work on Vercel's serverless runtime,
  which has no persistent local filesystem.
