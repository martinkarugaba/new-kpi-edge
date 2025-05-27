import { getUsers } from '@/features/users/actions/users';
import { UsersTable } from '@/features/users/components/users-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function UsersPage() {
  const result = await getUsers();

  if (!result.success) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">
              Error loading users: {result.error}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable users={result.data} />
        </CardContent>
      </Card>
    </div>
  );
}
