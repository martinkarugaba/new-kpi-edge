import { type SQL } from 'drizzle-orm';

/**
 * Helper function to build a query with multiple conditions
 * This avoids TypeScript errors with chaining .where() calls
 */
export function buildQueryWithConditions(
  baseQuery: { where(condition: SQL<unknown>): typeof baseQuery },
  conditions: SQL<unknown>[]
): typeof baseQuery {
  if (conditions.length === 0) {
    return baseQuery;
  }

  // Apply first condition
  let query = baseQuery.where(conditions[0]);

  // Use a loop with a temporary variable to add all conditions
  for (let i = 1; i < conditions.length; i++) {
    query = query.where(conditions[i]);
  }

  return query;
}
