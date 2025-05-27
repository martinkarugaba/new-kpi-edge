#!/bin/bash
# Script to update Next.js and related dependencies

# Make the script executable
chmod +x update-deps.sh

# Install the latest version of Next.js
echo "Updating Next.js to the latest version..."
pnpm up next @types/react @types/react-dom react react-dom

# Clean cache
echo "Cleaning cache..."
pnpm cache clean --force

# Rebuild dependencies 
echo "Rebuilding node modules..."
rm -rf node_modules .next
pnpm install

echo "Update complete! Try running your app again."
