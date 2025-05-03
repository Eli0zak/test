
import { BarChart, Bell, PawPrint, Users } from "lucide-react";
import StatCard from "./StatCard";

interface AdminStatsProps {
  stats: {
    totalUsers: number;
    totalPets: number;
    totalScans: number;
    premiumUsers: number;
  };
  isLoading: boolean;
}

const AdminStats = ({ stats, isLoading }: AdminStatsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Total Users" 
        value={stats.totalUsers} 
        icon={Users} 
        isLoading={isLoading} 
      />
      
      <StatCard 
        title="Total Pets" 
        value={stats.totalPets} 
        icon={PawPrint} 
        isLoading={isLoading} 
      />
      
      <StatCard 
        title="Total Scans" 
        value={stats.totalScans} 
        icon={Bell} 
        isLoading={isLoading} 
      />
      
      <StatCard 
        title="Premium Users" 
        value={stats.premiumUsers} 
        icon={BarChart} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default AdminStats;
