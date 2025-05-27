# Urban Locations Seeding for Uganda

This documentation explains how to seed and test urban locations (municipalities and cities) data for Uganda.

## Data Structure

The database includes the following urban location tables:

1. `municipalities` - Municipal administrative units
2. `cities` - City administrative units
3. `wards` - Divisions within cities
4. `divisions` - Further subdivisions within wards
5. `cells` - Smallest administrative units within divisions

## Seeding Instructions

### Prerequisites

Before seeding urban locations, ensure you have:

1. Seeded countries data
2. Seeded districts data
3. Seeded counties data
4. Seeded subcounties data

### Running the Seeds

To seed municipalities and cities data, run:

```bash
# Seed municipalities
./scripts/run-seed-municipalities.sh

# Seed cities
./scripts/run-seed-cities.sh

# Or use the complete seeding script (recommended)
./scripts/run-seed.sh
```

The complete seeding script will run all seeds in the correct order.

## Testing the Data

To verify the seeded data, run:

```bash
# Test municipalities data
./scripts/run-test-municipalities.sh

# Test cities data
./scripts/run-test-cities.sh

# Or test all urban location data at once
./scripts/test-urban-locations.sh
```

## Data Sources

The municipalities and cities data is sourced from:

1. Uganda Bureau of Statistics (UBOS)
2. Ministry of Local Government Uganda
3. `ug-locale` package for administrative divisions

## Administrative Structure

Uganda's urban areas follow this hierarchical structure:

- Country (Uganda)
  - Districts/Cities
    - Counties
      - Sub-counties
        - Municipalities
          - Divisions/Wards
            - Parishes/Cells
              - Villages

## Troubleshooting

If you encounter issues with seeding:

1. Check that prerequisite data exists in the database
2. Verify district, county, and subcounty references in the urban data
3. Check database logs for specific error messages
4. Run the test scripts to identify missing or incorrect data
