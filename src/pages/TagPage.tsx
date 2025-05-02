import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TagLayout from "@/components/layout/TagLayout";
import { getAnimalById, recordAnimalScan } from "@/lib/supabase";
import { Animal } from "@/types";
import { User, Mail, MapPin } from "lucide-react";
import { planFeatures } from "@/lib/plans";

const TagPage = () => {
  const { id } = useParams<{ id: string }>();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      if (!id) {
        setError("No tag ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Record the scan
        await recordAnimalScan(id);
        
        // Get the animal data
        const animalData = await getAnimalById(id);
        
        if (animalData) {
          setAnimal(animalData);
        } else {
          setError("Pet not found");
        }
      } catch (err) {
        console.error("Error fetching animal:", err);
        setError("Failed to load pet information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);

  if (isLoading) {
    return (
      <TagLayout>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full bg-pet-purple/20 flex items-center justify-center animate-pulse">
                <span className="text-3xl text-pet-purple">...</span>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="h-8 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4 mx-auto" />
              <div className="h-24 bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </TagLayout>
    );
  }

  if (error || !animal) {
    return (
      <TagLayout>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 text-xl mb-4">
              {error || "Something went wrong"}
            </div>
            <p className="text-muted-foreground">
              We couldn't find the pet you're looking for. Please check the tag and try again.
            </p>
          </CardContent>
        </Card>
      </TagLayout>
    );
  }

  return (
    <TagLayout>
      <Card className={`overflow-hidden ${animal.plan === "vip" ? "pet-card-vip" : animal.plan === "comfort" ? "pet-card-comfort" : "pet-card-basic"}`}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            {animal.image_url ? (
              <img
                src={animal.image_url}
                alt={animal.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-pet-purple mb-4"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mb-4">
                <User size={64} className="text-muted-foreground" />
              </div>
            )}
            <h2 className="text-2xl font-bold mb-1">{animal.name}</h2>
            <div className="text-muted-foreground capitalize mb-2">{animal.type}</div>
            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-1 text-sm">
                <Mail size={16} className="text-pet-purple" />
                <span>{animal.plan}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <MapPin size={16} className="text-pet-purple" />
                <span>Scans: {animal.scan_count}</span>
              </div>
            </div>
            <div className="mb-2 text-sm">Age: {animal.age} years</div>
            {animal.children_count > 0 && (
              <div className="mb-2 text-sm">Children: {animal.children_count}</div>
            )}
            {animal.notes && (
              <div className="mb-2 text-xs text-muted-foreground max-w-md text-center">
                {animal.notes}
              </div>
            )}
            <div className="mt-4">
              <Button asChild variant="outline">
                <a href="mailto:support@pettouch.com">Contact Owner</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </TagLayout>
  );
};

export default TagPage;
