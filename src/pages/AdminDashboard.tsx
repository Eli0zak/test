import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getAnimals, getUserProfiles } from "@/lib/supabase";
import { Animal, UserProfile } from "@/types";
import AdminStats from "@/components/admin/AdminStats";
import RecentUsersList from "@/components/admin/RecentUsersList";
import RecentPetsList from "@/components/admin/RecentPetsList";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
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
    if (!isAdmin) {
      navigate('/dashboard'); // Redirect non-admin users
    }
  }, [isAdmin, navigate]);

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
        <AdminStats stats={stats} isLoading={isLoading} />
        
        {/* Recent Users */}
        <RecentUsersList users={users} isLoading={isLoading} />
        
        {/* Recent Pets */}
        <RecentPetsList animals={animals} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
