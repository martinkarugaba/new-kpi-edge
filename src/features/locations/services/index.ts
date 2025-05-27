/**
 * Location Services Index File
 *
 * This file re-exports all location services from their respective modules,
 * providing a single import point for consuming components and functions.
 */

// Export utilities used by the location services
export * from './utils';

// Export all location services from locations-new
// This file already handles exporting from individual service files
export * from './locations-new';

// Legacy export for backward compatibility
// This can be removed once all imports are updated to use the specific services
export * from './locations';
