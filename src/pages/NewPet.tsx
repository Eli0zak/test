
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PetForm from "@/components/PetForm";
import { useAuth } from "@/contexts/AuthContext";
import { createAnimal } from "@/lib/supabase";
import { canAddMorePets } from "@/lib/plans";
import { Animal } from "@/types";
import UpgradePlanDialog from "@/components/UpgradePlanDialog";
import { updateUserPlan } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

const NewPet = () => {
  const { user, userPlan, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [upgradePlanOpen, setUpgradePlanOpen] = useState(false);

  const handleCancel = () => {
    navigate("/pets");
  };

  const handleSubmit = async (data: Partial<Animal>) => {
    if (!user) return null;

    // Check if user can add more pets
    if (!canAddMorePets(userPlan, animals.length)) {
      toast({
        title: "Pet limit reached",
        description: "Upgrade your plan to add more pets.",
        variant: "destructive",
      });
      setUpgradePlanOpen(true);
      return null;
    }

    const newAnimal = await createAnimal({
      user_id: user.id,
      name: data.name || "",
      type: data.type || "dog",
      age: data.age || 0,
      children_count: data.children_count || 0,
      notes: data.notes || "",
      image_url: data.image_url || null,
      plan: userPlan,
    });

    if (newAnimal) {
      navigate("/pets");
      return newAnimal;
    }

    return null;
  };

  const handleUpgradePlan = async (plan: string) => {
    if (!user) return;
    
    await updateUserPlan(user.id, plan as "basic" | "comfort" | "vip");
    await updateUserData();
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Add New Pet</h2>
          <p className="text-muted-foreground">
            Fill in your pet's information to create their PetTouch profile.
          </p>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Pet Information</CardTitle>
            <CardDescription>
              Enter the basic details about your pet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PetForm
              onSubmit={handleSubmit}
              userId={user.id}
              userPlan={userPlan}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
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

export default NewPet;
