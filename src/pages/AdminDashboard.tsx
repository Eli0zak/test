
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getAnimals, getUserProfiles } from "@/lib/supabase";
import { Animal, UserProfile } from "@/types";
import { ChevronRight, Users, PawPrint, Bell, BarChart } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPets: 0,
    totalScans: 0,
    premiumUsers: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setIsLoading(true);
        try {
          // Get all pets in the system for admin
          const fetchedAnimals = await getAnimals(null, true);
          setAnimals(fetchedAnimals);
          
          // Get all users (admin only)
          const fetchedUsers = await getUserProfiles();
          setUsers(fetchedUsers);
          
          // Calculate stats
          const totalScans = fetchedAnimals.reduce((sum, animal) => sum + (animal.scan_count || 0), 0);
          const premiumUsers = fetchedUsers.filter(u => u.plan !== 'basic').length;
          
          setStats({
            totalUsers: fetchedUsers.length,
            totalPets: fetchedAnimals.length,
            totalScans: totalScans,
            premiumUsers: premiumUsers
          });
        } catch (error) {
          console.error("Error fetching admin data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout isAdmin={true}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to the admin panel, {user.full_name || user.email.split("@")[0]}
          </p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-muted-foreground mr-2" />
                <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalUsers}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Pets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <PawPrint className="h-4 w-4 text-muted-foreground mr-2" />
                <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalPets}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Bell className="h-4 w-4 text-muted-foreground mr-2" />
                <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalScans}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart className="h-4 w-4 text-muted-foreground mr-2" />
                <div className="text-2xl font-bold">{isLoading ? '...' : stats.premiumUsers}</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Users */}
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
        
        {/* Recent Pets */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Pets</CardTitle>
            <CardDescription>
              Recently added pets in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 rounded-md bg-muted animate-pulse" />
                ))}
              </div>
            ) : animals.length === 0 ? (
              <p className="text-muted-foreground">No pets found.</p>
            ) : (
              <div className="space-y-4">
                {animals.slice(0, 5).map((animal) => (
                  <div key={animal.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      {animal.image_url ? (
                        <img
                          src={animal.image_url}
                          alt={animal.name}
                          className="h-10 w-10 rounded-full object-cover mr-3"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center mr-3">
                          <PawPrint className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{animal.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {animal.type} • {animal.scan_count || 0} scans
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/pets/edit/${animal.id}`}
                      className="ml-auto text-sm text-pet-purple hover:underline"
                    >
                      View details
                    </Link>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" asChild>
                <Link to="/pets">
                  View all pets <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
