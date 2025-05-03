
import { Animal } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPlanColor } from "@/lib/plans";
import { useNavigate } from "react-router-dom";
import { Bell, Map, User, Check, X } from "lucide-react";

interface PetCardProps {
  animal: Animal;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  showActions?: boolean;
}

const PetCard = ({ animal, onEdit, onDelete, onView, showActions = true }: PetCardProps) => {
  const navigate = useNavigate();
  const planColorClass = getPlanColor(animal.plan);

  const defaultImage = "/placeholder.svg";

  return (
    <Card className={`overflow-hidden ${planColorClass}`}>
      <div className="relative h-48 w-full overflow-hidden">
        {animal.image_url ? (
          <img 
            src={animal.image_url} 
            alt={animal.name} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <User size={64} className="text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <div className="badge-scan-count">
            {animal.scan_count} {animal.scan_count === 1 ? 'scan' : 'scans'}
          </div>
        </div>
      </div>
      
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">{animal.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">{animal.type}</p>
          </div>
          <div className="flex gap-1 text-xs">
            <div className="flex items-center">
              {animal.plan === 'comfort' || animal.plan === 'vip' ? (
                <Bell size={14} className="mr-1 text-pet-purple" />
              ) : (
                <Bell size={14} className="mr-1 text-muted-foreground" />
              )}
            </div>
            <div className="flex items-center">
              {animal.plan === 'vip' ? (
                <Map size={14} className="mr-1 text-pet-purple" />
              ) : (
                <Map size={14} className="mr-1 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-2">
          <p className="text-sm">Age: {animal.age} years</p>
          {animal.children_count > 0 && (
            <p className="text-sm">Children: {animal.children_count}</p>
          )}
        </div>
        
        {animal.notes && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground">
              {animal.notes.length > 80 ? `${animal.notes.substring(0, 80)}...` : animal.notes}
            </p>
          </div>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="flex justify-between gap-2 pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => navigate(`/tag/${animal.id}`)}
          >
            View Tag
          </Button>
          
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={onEdit}
            >
              Edit
            </Button>
          )}
          
          {onDelete && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={onDelete}
            >
              Delete
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default PetCard;
