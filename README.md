# IPL Jaanimmarik Garage

Appointment booking website for the IPL Jaanimmarik school garage in Kuujjuaq, Nunavik.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **localStorage** (client-side, until Neon DB is wired in)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Services

| Service | Duration | Vehicles |
|---|---|---|
| Oil Change | 20 min | All |
| Tire Appointment | 30 min | Honda, Car, Truck |
| Changing Skis | 30 min | Ski-Doo |
| Spark Plugs | 30 min | All |
| Case Oil Change | 10 min | All |
| Gas Filters | 3h 30min (half day) | Ski-Doo |
| Air Filters | 15 min | All |
| Kill Switch | 1h 30min | Ski-Doo |
| Rims | 30 min | All |

**30-minute break between every appointment.**

## Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel
3. Add `DATABASE_URL` from Neon dashboard in Vercel env vars

## Connecting Neon DB

After deploying to Vercel and creating a Neon project:

```bash
npm install @neondatabase/serverless drizzle-orm
npm install -D drizzle-kit
```

Then update `src/app/api/appointments/route.ts` — all TODO comments are ready to guide the migration.

## Phone

📞 (819) 964-2961 — school phone for reservations
