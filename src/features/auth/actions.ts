'use server';

import { auth } from './auth';
import { db } from '@/lib/db';
import { organizationMembers, users, organizations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserClusterId() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    // First get the organization ID for the user
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return null;
    }

    // Now get the cluster ID for that organization
    const [org] = await db
      .select({ cluster_id: organizations.cluster_id })
      .from(organizations)
      .where(eq(organizations.id, organizationId));

    return org?.cluster_id || null;
  } catch (error) {
    console.error('Error getting cluster ID:', error);
    return null;
  }
}

export async function getOrganizationId() {
  try {
    console.log('Getting organization ID - Starting auth check...');
    const session = await auth();
    if (!session?.user?.id) {
      console.log('No authenticated user session found');
      return null;
    }
    console.log('Found user session for user:', session.user.id);

    // Check if user exists in database
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    // If user doesn't exist, return null
    if (!user) {
      console.log(`User ${session.user.id} not found in database`);
      return null;
    }
    console.log('Found user in database:', user.id);

    console.log('Looking up organization membership...');
    const [member] = await db
      .select({ organization_id: organizationMembers.organization_id })
      .from(organizationMembers)
      .where(eq(organizationMembers.user_id, session.user.id));

    if (!member) {
      console.log('No organization membership found for user');
      return null;
    }

    console.log('Found organization membership:', member.organization_id);
    return member.organization_id;
  } catch (error) {
    console.error('Error getting organization ID:', error);
    return null;
  }
}
