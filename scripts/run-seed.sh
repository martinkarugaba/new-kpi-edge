#!/bin/bash

# Get the database URL from an argument or environment variable
DB_URL=${1:-$DATABASE_URL}

if [ -z "$DB_URL" ] && [ -f .env ]; then
  # Try to extract from .env file if it exists
  DB_URL=$(grep DATABASE_URL .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
fi

if [ -z "$DB_URL" ]; then
  echo "⚠️  Warning: DATABASE_URL is not set. Please provide it as an argument or set it in the .env file."
  echo "Example usage: ./scripts/run-seed.sh \"postgresql://username:password@localhost:5432/kpi_edge_db\""
  exit 1
fi

# Export the DB_URL so all sub-scripts can access it
export DATABASE_URL="$DB_URL"

echo "🌱 Running all seed scripts in order with database URL: $DB_URL"

# Run all seed scripts in order
./scripts/run-seed-countries.sh "$DB_URL"
./scripts/run-seed-districts.sh "$DB_URL"
./scripts/run-seed-counties.sh "$DB_URL"
./scripts/run-seed-subcounties.sh "$DB_URL"
./scripts/run-seed-municipalities.sh "$DB_URL" 
./scripts/run-seed-cities.sh "$DB_URL"
./scripts/run-seed-parishes.sh "$DB_URL"
./scripts/run-seed-villages.sh "$DB_URL"
./scripts/run-seed-urban-areas.sh "$DB_URL"

echo "✅ All seeding completed successfully!"
