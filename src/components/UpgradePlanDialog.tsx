import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { planFeatures } from "@/lib/plans";
import { PlanType } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

interface UpgradePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: PlanType;
  onUpgrade: (plan: PlanType) => Promise<void>;
}

const UpgradePlanDialog = ({
  open,
  onOpenChange,
  currentPlan,
  onUpgrade,
}: UpgradePlanDialogProps) => {
  const handleUpgrade = async (plan: PlanType) => {
    try {
      await onUpgrade(plan);
      toast({
        title: "Plan upgraded",
        description: `You've successfully upgraded to the ${planFeatures[plan].name} plan.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Upgrade failed",
        description: "There was a problem upgrading your plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const PlanOption = ({ plan }: { plan: PlanType }) => {
    const isPlanDisabled = plan === currentPlan;
    const planInfo = planFeatures[plan];

    return (
      <div className={`pet-card p-6 ${plan === "vip" ? "pet-card-vip" : ""} ${plan === "comfort" ? "pet-card-comfort" : ""} ${plan === "basic" ? "pet-card-basic" : ""}`}>
        <h3 className="text-xl font-bold">{planInfo.name}</h3>
        <p className="text-muted-foreground mb-2">{planInfo.description}</p>
        <div className="text-2xl font-bold mb-4">
          ${planInfo.price}
          <span className="text-sm font-normal text-muted-foreground">/month</span>
        </div>

        <ul className="space-y-2 mb-6">
          {planInfo.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check size={16} className="text-pet-purple" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={() => handleUpgrade(plan)}
          className="w-full"
          variant={isPlanDisabled ? "outline" : "default"}
          disabled={isPlanDisabled}
        >
          {isPlanDisabled ? "Current Plan" : "Upgrade"}
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            Choose the plan that works best for you and your pets.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 md:grid-cols-3">
          <PlanOption plan="basic" />
          <PlanOption plan="comfort" />
          <PlanOption plan="vip" />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePlanDialog;
