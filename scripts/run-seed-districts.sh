#!/bin/bash

DB_URL="postgresql://kpi-database_owner:npg_uqdliF9QzY7g@ep-empty-mud-a22b9oc7-pooler.eu-central-1.aws.neon.tech/kpi-database?sslmode=require"

echo "Running seed-districts script with database URL..."
DATABASE_URL="$DB_URL" pnpm tsx scripts/seed-districts.ts

echo "Done!"
