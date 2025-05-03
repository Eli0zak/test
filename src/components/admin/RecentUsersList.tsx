import { UserProfile } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface RecentUsersListProps {
  users: UserProfile[];
  isLoading: boolean;
}

const RecentUsersList = ({ users, isLoading }: RecentUsersListProps) => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <p className="text-muted-foreground">Access denied.</p>; // Restrict access to admins
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
        <CardDescription>
          Recently registered users in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-md bg-muted animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <p className="text-muted-foreground">No users found.</p>
        ) : (
          <div className="space-y-4">
            {users.slice(0, 5).map((profile) => (
              <div key={profile.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-pet-purple flex items-center justify-center text-white mr-3">
                    {profile.full_name ? profile.full_name[0] : profile.email[0]}
                  </div>
                  <div>
                    <div className="font-medium">{profile.full_name || 'N/A'}</div>
                    <div className="text-sm text-muted-foreground">{profile.email}</div>
                  </div>
                </div>
                <div className="ml-auto text-sm bg-primary-foreground px-2 py-1 rounded">
                  {profile.plan || 'basic'}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm">
            View all users <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentUsersList;
