
import { Link } from "react-router-dom";
import { Animal } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, PawPrint } from "lucide-react";

interface RecentPetsListProps {
  animals: Animal[];
  isLoading: boolean;
}

const RecentPetsList = ({ animals, isLoading }: RecentPetsListProps) => {
  return (
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
  );
};

export default RecentPetsList;
