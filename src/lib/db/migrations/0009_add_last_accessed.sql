-- Add last_accessed column to organization_members table
ALTER TABLE organization_members ADD COLUMN last_accessed TIMESTAMP DEFAULT NULL;
CREATE INDEX idx_organization_members_last_accessed ON organization_members(last_accessed);
