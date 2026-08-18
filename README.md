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
- [Prisma](https://www.prisma.io) + SQLite for the database
- [NextAuth.js v5](https://authjs.dev) (credentials provider) for auth
- Audio files are stored on disk under `public/uploads`

## Getting started

```bash
npm install
npx prisma migrate dev   # creates prisma/dev.db and applies the schema
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Environment variables (see `.env`):

- `DATABASE_URL` — SQLite connection string (defaults to `file:./dev.db`,
  resolved relative to `prisma/`, i.e. `prisma/dev.db`)
- `AUTH_SECRET` — secret used to sign session tokens (set a strong random
  value in production)
- `NEXTAUTH_URL` — the app's public URL

## Project structure

- `prisma/schema.prisma` — data model (`User`, `Track`, `Comment`,
  `ProductionOffer`, `Follow`)
- `src/lib/auth.ts` — NextAuth configuration
- `src/lib/actions.ts` — server actions for registration, uploads, comments,
  offers, and following
- `src/app` — pages (discover feed, signup/login, upload, track detail,
  profile, dashboard)

## Notes

- Uploaded audio is stored locally under `public/uploads` (30MB max per
  file). For a production deployment, swap this for object storage (e.g. S3)
  behind the same `createTrack` server action.
- SQLite is used for simplicity; swap the Prisma datasource for
  Postgres/MySQL for a multi-instance production deployment.
