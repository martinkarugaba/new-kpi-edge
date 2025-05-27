#!/bin/bash

# This script seeds municipalities data from municipalities.json
echo "Seeding municipalities data..."

# Run the seeding script with the JSON file
npx ts-node scripts/seed-municipalities.ts

echo "Municipalities seeding completed."
