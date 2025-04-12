"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash, Loader2, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  addOrganizationMember,
  removeOrganizationMember,
  updateOrganizationMemberRole,
} from "../actions/organization-members";
import { getUsers } from "@/features/users/actions/users";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface OrganizationMembersProps {
  organizationId: string;
  members: {
    id: string;
    name: string;
    email: string;
    role: string;
    created_at?: string;
    updated_at?: string;
    createdAt?: string;
  }[];
}

interface User {
  id: string;
  name: string;
  email: string;
}

export function OrganizationMembers({
  organizationId,
  members,
}: OrganizationMembersProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadAvailableUsers = useCallback(async () => {
    try {
      console.log("Loading available users..."); // Debug log
      setIsLoading(true);

      const response = await getUsers();
      console.log("getUsers response:", response); // Debug log

      // Even if there's an error, we might still have data
      if (response.data && response.data.length > 0) {
        // Filter out users who are already members
        const filteredUsers = response.data.filter(
          (user: { id: string; name: string; email: string }) =>
            !members.some((member) => member.id === user.id),
        );
        console.log("Available users:", filteredUsers); // Debug log
        setAvailableUsers(filteredUsers);
      } else {
        console.log("No users available"); // Debug log
        setAvailableUsers([]);

        // Show error message if there was an error
        if (!response.success) {
          toast.error(response.error || "Failed to load users");
        }
      }
    } catch (error) {
      console.error("Error loading available users:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to load users",
      );
      setAvailableUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [members]);

  // Load available users when dialog opens
  useEffect(() => {
    if (dialogOpen) {
      loadAvailableUsers();
    }
  }, [dialogOpen, loadAvailableUsers]);

  const handleAddMember = async () => {
    if (!selectedUserId) {
      toast.error("Please select a user");
      return;
    }

    if (!session) {
      toast.error("You need to be logged in to add members");
      router.push("/sign-in");
      return;
    }

    setIsLoading(true);
    try {
      const result = await addOrganizationMember(
        organizationId,
        selectedUserId,
      );
      if (result.success) {
        toast.success("Member added successfully");
        setDialogOpen(false);
        setSelectedUserId("");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to add member");
      }
    } catch {
      toast.error("Failed to add member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!session) {
      toast.error("You need to be logged in to remove members");
      router.push("/sign-in");
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [userId]: true }));
    try {
      const result = await removeOrganizationMember(organizationId, userId);
      if (result.success) {
        toast.success("Member removed successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to remove member");
      }
    } catch {
      toast.error("Failed to remove member");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    if (!session) {
      toast.error("You need to be logged in to update member roles");
      router.push("/sign-in");
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [userId]: true }));
    try {
      const result = await updateOrganizationMemberRole(
        organizationId,
        userId,
        role,
      );
      if (result.success) {
        toast.success("Role updated successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update role");
      }
    } catch {
      toast.error("Failed to update role");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="space-y-4 px-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Organization Members</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={isLoading}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Organization Member</DialogTitle>
              <DialogDescription>
                Select a user to add as a member of this organization.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Select
                value={selectedUserId}
                onValueChange={setSelectedUserId}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm text-muted-foreground">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading users...
                    </div>
                  ) : availableUsers.length > 0 ? (
                    availableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))
                  ) : (
                    <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm text-muted-foreground">
                      No available users found
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddMember}
                disabled={isLoading || !selectedUserId}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Member"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-6 text-muted-foreground"
              >
                No members found. Add members to get started.
              </TableCell>
            </TableRow>
          ) : (
            members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <Select
                    value={member.role}
                    onValueChange={(value) =>
                      handleUpdateRole(member.id, value)
                    }
                    disabled={loadingStates[member.id]}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {member.createdAt
                    ? format(new Date(member.createdAt), "PPP")
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={loadingStates[member.id]}
                  >
                    {loadingStates[member.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
