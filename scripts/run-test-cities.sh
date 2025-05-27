#!/bin/bash

# Get the database URL from an argument or environment variable
DB_URL=${1:-$DATABASE_URL}

if [ -z "$DB_URL" ] && [ -f .env ]; then
  # Try to extract from .env file if it exists
  DB_URL=$(grep DATABASE_URL .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
fi

if [ -z "$DB_URL" ]; then
  echo "⚠️  Warning: DATABASE_URL is not set. Please provide it as an argument or set it in the .env file."
  echo "Example usage: ./scripts/run-test-cities.sh \"postgresql://username:password@localhost:5432/kpi_edge_db\""
else
  echo "🔍 Testing city data"
  npx tsx scripts/test-cities.ts --database-url="$DB_URL"
fi
