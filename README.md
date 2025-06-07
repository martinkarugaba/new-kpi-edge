This is a [Next.js](https://nextjs.org) project bootstrapped with
[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, set up your environment variables:

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your PostgreSQL database credentials
nano .env
```

Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

You can start editing the page by modifying `app/page.tsx`. The page
auto-updates as you edit the file.

This project uses
[`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
to automatically optimize and load [Geist](https://vercel.com/font), a new font
family for Vercel.

## Database Seeding

This project includes scripts to seed the database with location data, including
urban areas. You can pass the database URL directly as an argument:

```bash
# Seed all location data (countries, districts, counties, subcounties, municipalities, cities, etc.)
./scripts/run-seed.sh "postgresql://username:password@localhost:5432/kpi_edge_db"

# Seed only municipalities data
./scripts/run-seed-municipalities.sh "postgresql://username:password@localhost:5432/kpi_edge_db"

# Seed only cities data
./scripts/run-seed-cities.sh "postgresql://username:password@localhost:5432/kpi_edge_db"
```

The scripts will also look for a DATABASE_URL in your environment variables or
.env file if no argument is provided.

To verify the seeded data:

```bash
# Test all urban locations data
./scripts/test-urban-locations.sh
```

For more information about the urban locations seeding, see
[URBAN_LOCATIONS.md](./scripts/URBAN_LOCATIONS.md)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out
[the Next.js GitHub repository](https://github.com/vercel/next.js) - your
feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the
[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our
[Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)
for more details.
