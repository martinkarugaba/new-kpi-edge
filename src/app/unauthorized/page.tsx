import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center">Unauthorized Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            You don&apos;t have permission to access this page. Please contact
            your administrator if you believe this is a mistake.
          </p>
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/">Return to Home Pge</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
