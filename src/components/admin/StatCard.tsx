
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  isLoading?: boolean;
  description?: string;
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  isLoading = false,
  description 
}: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <Icon className="h-4 w-4 text-muted-foreground ml-2" />
          <div className="text-2xl font-bold">{isLoading ? '...' : value}</div>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
