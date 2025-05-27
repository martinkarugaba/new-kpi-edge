-- Drop existing foreign key constraints
ALTER TABLE clusters DROP CONSTRAINT IF EXISTS clusters_organization_id_organizations_id_fk;

-- Remove organization_id from clusters table
ALTER TABLE clusters DROP COLUMN IF EXISTS organization_id;

-- Add cluster_id to organizations table
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS cluster_id UUID REFERENCES clusters(id); 