-- Migration to support organizations belonging to multiple clusters
-- This migration ensures the clusterMembers table has all existing organization-cluster relationships

-- First, insert all existing organization-cluster relationships into clusterMembers
INSERT INTO cluster_members (cluster_id, organization_id)
SELECT cluster_id, id FROM organizations 
WHERE cluster_id IS NOT NULL
  -- Only insert if the relationship doesn't already exist
  AND NOT EXISTS (
    SELECT 1 FROM cluster_members 
    WHERE cluster_members.cluster_id = organizations.cluster_id 
    AND cluster_members.organization_id = organizations.id
  );

-- We're keeping the cluster_id column in organizations for now for backward compatibility
-- In a future migration, we can remove this column once all code has been updated to use
-- the clusterMembers table for relationships
