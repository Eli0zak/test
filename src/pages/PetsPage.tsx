
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PetCard from "@/components/PetCard";
import { useAuth } from "@/contexts/AuthContext";
import { getAnimals, deleteAnimal } from "@/lib/supabase";
import { Animal } from "@/types";
import { canAddMorePets } from "@/lib/plans";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const PetsPage = () => {
  const { user, userPlan } = useAuth();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState<Animal | null>(null);
  const navigate = useNavigate();

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

  const handleDeleteClick = (animal: Animal) => {
    setAnimalToDelete(animal);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (animalToDelete) {
      const success = await deleteAnimal(animalToDelete.id);
      if (success) {
        setAnimals(animals.filter((a) => a.id !== animalToDelete.id));
        toast({
          title: "Pet deleted",
          description: `${animalToDelete.name} has been removed from your account.`,
        });
      }
    }
    setDeleteDialogOpen(false);
    setAnimalToDelete(null);
  };

  if (!user) {
    return null;
  }

  const canAddPet = canAddMorePets(userPlan, animals.length);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">My Pets</h2>
            <p className="text-muted-foreground">
              Manage all your registered pets
            </p>
          </div>
          <Button
            disabled={!canAddPet}
            onClick={() => navigate("/pets/new")}
            className="mt-4 sm:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Pet
          </Button>
        </div>

        {!canAddPet && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
            <p>
              You've reached the maximum number of pets for your current plan.{" "}
              <Link to="/account" className="font-medium underline">
                Upgrade your plan
              </Link>{" "}
              to add more pets.
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-72 rounded-xl bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : animals.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
              <Plus className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium mb-1">No pets added yet</h3>
            <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
              Start by adding your first pet to manage their identity and track scans.
            </p>
            <Button onClick={() => navigate("/pets/new")}>Add your first pet</Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {animals.map((animal) => (
              <PetCard
                key={animal.id}
                animal={animal}
                onEdit={() => navigate(`/pets/edit/${animal.id}`)}
                onDelete={() => handleDeleteClick(animal)}
                onView={() => navigate(`/tag/${animal.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              {animalToDelete?.name}'s profile and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default PetsPage;
