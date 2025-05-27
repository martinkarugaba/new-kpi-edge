#!/bin/bash

# Run the urban areas seed script
echo "Running urban areas seed script..."
npx tsx scripts/seed-urban-areas.ts

# Check if the script executed successfully
if [ $? -eq 0 ]; then
    echo "Urban areas seeding completed successfully"
else
    echo "Error: Urban areas seeding failed"
    exit 1
fi 