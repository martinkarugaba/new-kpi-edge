#!/bin/bash

# This script runs the municipalities seeder with additional data
echo "Running additional municipalities seeding..."

npx ts-node scripts/seed-additional-municipalities.ts

echo "Additional municipalities seeding script completed."
