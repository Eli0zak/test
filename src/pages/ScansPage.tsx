
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getAnimals } from "@/lib/supabase";
import { Animal } from "@/types";

const ScansPage = () => {
  const { user } = useAuth();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (!user) {
    return null;
  }

  const hasScans = animals.some((animal) => animal.scan_count > 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Scan History</h2>
          <p className="text-muted-foreground">
            Track when and how often your pets' tags have been scanned
          </p>
        </div>

        {isLoading ? (
          <div className="h-64 rounded-xl bg-muted animate-pulse" />
        ) : !hasScans ? (
          <div className="text-center py-12 bg-card rounded-lg border">
            <h3 className="text-lg font-medium mb-1">No scan history yet</h3>
            <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
              When someone scans your pet's tag, it will appear here.
            </p>
            <Button asChild variant="outline">
              <Link to="/pets">Manage your pets</Link>
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pet</TableHead>
                  <TableHead>Scan Count</TableHead>
                  <TableHead>Last Scanned</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {animals
                  .sort((a, b) => {
                    // Sort by last scan date (newest first)
                    const dateA = a.last_scanned_at
                      ? new Date(a.last_scanned_at).getTime()
                      : 0;
                    const dateB = b.last_scanned_at
                      ? new Date(b.last_scanned_at).getTime()
                      : 0;
                    return dateB - dateA;
                  })
                  .map((animal) => (
                    <TableRow key={animal.id}>
                      <TableCell className="font-medium">{animal.name}</TableCell>
                      <TableCell>
                        <span className="badge-scan-count">
                          {animal.scan_count}
                        </span>
                      </TableCell>
                      <TableCell>
                        {animal.last_scanned_at
                          ? new Date(animal.last_scanned_at).toLocaleString()
                          : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/tag/${animal.id}`}>View Tag</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ScansPage;
