
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PetCard from "@/components/PetCard";
import UpgradePlanDialog from "@/components/UpgradePlanDialog";
import { useAuth } from "@/contexts/AuthContext";
import { getAnimals, updateUserPlan } from "@/lib/supabase";
import { Animal, PlanType } from "@/types";
import { planFeatures, canAddMorePets } from "@/lib/plans";
import { Bell, Map, Plus, Check } from "lucide-react";

const Dashboard = () => {
  const { user, userPlan, updateUserData } = useAuth();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [upgradePlanOpen, setUpgradePlanOpen] = useState(false);

  useEffect(() => {
    const fetchAnimals = async () => {
      if (user) {
        setIsLoading(true);
        const fetchedAnimals = await getAnimals(user.id);
        setAnimals(fetchedAnimals);
        setIsLoading(false);
      }
    };

    fetchAnimals();
  }, [user]);

  const handleUpgradePlan = async (plan: PlanType) => {
    if (!user) return;
    
    await updateUserPlan(user.id, plan);
    await updateUserData();
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome to PetTouch, {user.full_name || user.email.split("@")[0]}!
            </p>
          </div>
          <Button onClick={() => setUpgradePlanOpen(true)} className="mt-4 md:mt-0">
            Upgrade Plan
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Your Subscription</CardTitle>
              <CardDescription>
                You are currently on the {planFeatures[userPlan].name} plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold">
                  ${planFeatures[userPlan].price}
                  <span className="text-sm font-normal text-muted-foreground">/month</span>
                </div>
                <Button variant="outline" onClick={() => setUpgradePlanOpen(true)}>
                  Upgrade
                </Button>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-pet-purple" />
                  <span>
                    {planFeatures[userPlan].features.maxPets === 999
                      ? "Unlimited pets"
                      : `${planFeatures[userPlan].features.maxPets} pets maximum`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {planFeatures[userPlan].features.notifications.email ? (
                    <Check size={16} className="text-pet-purple" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-muted-foreground" />
                  )}
                  <span>Email notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  {planFeatures[userPlan].features.customPhoto ? (
                    <Check size={16} className="text-pet-purple" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-muted-foreground" />
                  )}
                  <span>Custom pet photos</span>
                </div>
                <div className="flex items-center gap-2">
                  {planFeatures[userPlan].features.locationTracking ? (
                    <Check size={16} className="text-pet-purple" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-muted-foreground" />
                  )}
                  <span>Location tracking</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Scans</CardTitle>
              <CardDescription>
                See who's been checking on your pets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground">Loading scan data...</p>
              ) : animals.length === 0 ? (
                <p className="text-muted-foreground">No scan data available yet.</p>
              ) : (
                <div className="space-y-4">
                  {animals
                    .sort((a, b) => {
                      const dateA = a.last_scanned_at ? new Date(a.last_scanned_at).getTime() : 0;
                      const dateB = b.last_scanned_at ? new Date(b.last_scanned_at).getTime() : 0;
                      return dateB - dateA;
                    })
                    .slice(0, 3)
                    .map((animal) => (
                      <div key={animal.id} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{animal.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {animal.last_scanned_at
                              ? new Date(animal.last_scanned_at).toLocaleString()
                              : "Never scanned"}
                          </div>
                        </div>
                        <div className="badge-scan-count">
                          {animal.scan_count} {animal.scan_count === 1 ? 'scan' : 'scans'}
                        </div>
                      </div>
                    ))}
                </div>
              )}
              <div className="mt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/scans">View all scans</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Essential links to manage your pets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {!canAddMorePets(userPlan, animals.length) ? (
                <div className="text-sm text-amber-600 mb-2">
                  You've reached your pet limit. Upgrade your plan to add more pets.
                </div>
              ) : null}
              <div className="grid gap-2">
                <Button 
                  asChild 
                  disabled={!canAddMorePets(userPlan, animals.length)}
                >
                  <Link to="/pets/new">
                    <Plus className="h-4 w-4 mr-2" /> Add new pet
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/pets">View all pets</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/account">Manage account</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Your Pets</h3>
            <Button variant="outline" size="sm" asChild>
              <Link to="/pets">View all</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-72 rounded-xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : animals.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-muted p-3">
                    <Plus className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="mb-1 font-medium">No pets added yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your pets to get started with PetTouch.
                </p>
                <Button asChild>
                  <Link to="/pets/new">Add your first pet</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {animals.slice(0, 3).map((animal) => (
                <PetCard
                  key={animal.id}
                  animal={animal}
                  showActions={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <UpgradePlanDialog
        open={upgradePlanOpen}
        onOpenChange={setUpgradePlanOpen}
        currentPlan={userPlan}
        onUpgrade={handleUpgradePlan}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
