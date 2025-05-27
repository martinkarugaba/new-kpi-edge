#!/bin/bash

echo "🔍 Testing all urban location data"

echo -e "\n=== MUNICIPALITIES ==="
npx tsx scripts/test-municipalities.ts

echo -e "\n=== CITIES ==="
npx tsx scripts/test-cities.ts
