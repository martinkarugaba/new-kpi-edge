#!/bin/bash

# Change to the project directory
cd "$(dirname "$0")/.."

# Load .env file if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL is not set. Please provide it as an argument or in .env file."
  echo "Usage: $0 [database_url]"
  exit 1
fi

# Allow overriding DATABASE_URL from command line
if [ ! -z "$1" ]; then
  export DATABASE_URL="$1"
fi

echo "Using DATABASE_URL: ${DATABASE_URL}"

# Run the seed script
DATABASE_URL="${DATABASE_URL}" pnpm tsx scripts/seed-subcounties.ts
