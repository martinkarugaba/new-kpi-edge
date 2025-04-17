-- First, create a temporary column with the new type
ALTER TABLE "users" ADD COLUMN "role_new" user_role;

-- Update the temporary column with converted values
UPDATE "users" SET "role_new" = CASE 
  WHEN "role" = 'super_admin' THEN 'super_admin'::user_role
  WHEN "role" = 'cluster_manager' THEN 'cluster_manager'::user_role
  WHEN "role" = 'organization_admin' THEN 'organization_admin'::user_role
  WHEN "role" = 'organization_member' THEN 'organization_member'::user_role
  ELSE 'user'::user_role
END;

-- Drop the old column
ALTER TABLE "users" DROP COLUMN "role";

-- Rename the new column to the original name
ALTER TABLE "users" RENAME COLUMN "role_new" TO "role";

-- Set the default value
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user';

-- Do the same for organization_members table
ALTER TABLE "organization_members" ADD COLUMN "role_new" user_role;

UPDATE "organization_members" SET "role_new" = CASE 
  WHEN "role" = 'super_admin' THEN 'super_admin'::user_role
  WHEN "role" = 'cluster_manager' THEN 'cluster_manager'::user_role
  WHEN "role" = 'organization_admin' THEN 'organization_admin'::user_role
  WHEN "role" = 'organization_member' THEN 'organization_member'::user_role
  ELSE 'user'::user_role
END;

ALTER TABLE "organization_members" DROP COLUMN "role";
ALTER TABLE "organization_members" RENAME COLUMN "role_new" TO "role";
ALTER TABLE "organization_members" ALTER COLUMN "role" SET DEFAULT 'organization_member'; 