import { NextRequest, NextResponse } from "next/server";
import { getClusterUsers } from "@/features/clusters/actions/cluster-users";
import { auth } from "@/features/auth/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const clusterId = params.id;

    // Fetch cluster users
    const result = await getClusterUsers(clusterId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to fetch cluster users" },
        { status: 500 },
      );
    }

    return NextResponse.json({ users: result.data });
  } catch (error) {
    console.error("Error in GET /api/clusters/[id]/users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
