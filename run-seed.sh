#!/bin/bash
export DATABASE_URL="postgresql://kpi-database_owner:npg_uqdliF9QzY7g@ep-empty-mud-a22b9oc7-pooler.eu-central-1.aws.neon.tech/kpi-database?sslmode=require"
pnpm tsx scripts/seed-districts.ts
