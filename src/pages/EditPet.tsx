
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PetForm from "@/components/PetForm";
import { useAuth } from "@/contexts/AuthContext";
import { getAnimalById, updateAnimal } from "@/lib/supabase";
import { Animal } from "@/types";
import { toast } from "@/hooks/use-toast";

const EditPet = () => {
  const { user, userPlan } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnimal = async () => {
      if (id) {
        setIsLoading(true);
        const fetchedAnimal = await getAnimalById(id);
        
        if (fetchedAnimal) {
          // Verify the animal belongs to the current user
          if (fetchedAnimal.user_id !== user?.id) {
            toast({
              title: "Access denied",
              description: "You don't have permission to edit this pet.",
              variant: "destructive",
            });
            navigate("/pets");
            return;
          }
          
          setAnimal(fetchedAnimal);
        } else {
          toast({
            title: "Pet not found",
            description: "The pet you're trying to edit doesn't exist.",
            variant: "destructive",
          });
          navigate("/pets");
        }
        
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAnimal();
    }
  }, [id, user, navigate]);

  const handleCancel = () => {
    navigate("/pets");
  };

  const handleSubmit = async (data: Partial<Animal>) => {
    if (!user || !id || !animal) return null;

    const updatedAnimal = await updateAnimal(id, {
      name: data.name || animal.name,
      type: data.type || animal.type,
      age: data.age !== undefined ? data.age : animal.age,
      children_count: data.children_count !== undefined ? data.children_count : animal.children_count,
      notes: data.notes !== undefined ? data.notes : animal.notes,
      image_url: data.image_url || animal.image_url,
    });

    if (updatedAnimal) {
      navigate("/pets");
      return updatedAnimal;
    }

    return null;
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Edit Pet</h2>
            <p className="text-muted-foreground">Loading pet information...</p>
          </div>
          
          <div className="h-96 rounded-xl bg-muted animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  if (!animal) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Edit Pet</h2>
          <p className="text-muted-foreground">
            Update {animal.name}'s information and profile.
          </p>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Edit {animal.name}</CardTitle>
            <CardDescription>
              Make changes to your pet's profile information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PetForm
              onSubmit={handleSubmit}
              animal={animal}
              userId={user.id}
              userPlan={userPlan}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EditPet;
