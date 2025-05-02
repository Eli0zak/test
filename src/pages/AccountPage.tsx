
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import UpgradePlanDialog from "@/components/UpgradePlanDialog";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserPlan } from "@/lib/supabase";
import { PlanType } from "@/types";
import { planFeatures } from "@/lib/plans";
import { Check } from "lucide-react";

const AccountPage = () => {
  const { user, userPlan, updateUserData } = useAuth();
  const [upgradePlanOpen, setUpgradePlanOpen] = useState(false);

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
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Account</h2>
          <p className="text-muted-foreground">
            Manage your account settings and subscription
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your personal account details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Email
                  </div>
                  <div>{user.email}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Name
                  </div>
                  <div>{user.full_name || "Not set"}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>
                Your current plan and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Current Plan
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    userPlan === "vip" ? "bg-pet-purple" : 
                    userPlan === "comfort" ? "bg-pet-purple-light" : 
                    "bg-pet-green"
                  }`} />
                  <div>{planFeatures[userPlan].name}</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Price
                </div>
                <div>
                  ${planFeatures[userPlan].price}
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
              </div>
              
              <Button onClick={() => setUpgradePlanOpen(true)}>
                {userPlan === "vip" ? "Manage Plan" : "Upgrade Plan"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Plan Comparison</CardTitle>
            <CardDescription>
              See what's included in each plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left pb-4">Feature</th>
                    <th className="text-center pb-4">Basic</th>
                    <th className="text-center pb-4">Comfort</th>
                    <th className="text-center pb-4">VIP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="py-4">Price</td>
                    <td className="text-center py-4">$0/mo</td>
                    <td className="text-center py-4">$4.99/mo</td>
                    <td className="text-center py-4">$9.99/mo</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="py-4">Pet Limit</td>
                    <td className="text-center py-4">1</td>
                    <td className="text-center py-4">3</td>
                    <td className="text-center py-4">Unlimited</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="py-4">Email Notifications</td>
                    <td className="text-center py-4">
                      {planFeatures.basic.features.notifications.email ? (
                        <Check className="inline h-5 w-5 text-green-500" />
                      ) : (
                        "–"
                      )}
                    </td>
                    <td className="text-center py-4">
                      {planFeatures.comfort.features.notifications.email ? (
                        <Check className="inline h-5 w-5 text-green-500" />
                      ) : (
                        "–"
                      )}
                    </td>
                    <td className="text-center py-4">
                      {planFeatures.vip.features.notifications.email ? (
                        <Check className="inline h-5 w-5 text-green-500" />
                      ) : (
                        "–"
                      )}
                    </td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="py-4">WhatsApp Notifications</td>
                    <td className="text-center py-4">
                      {planFeatures.basic.features.notifications.whatsapp ? (
                        <Check className="inline h-5 w-5 text-green-500" />
                      ) : (
                        "–"
                      )}
                    </td>
                    <td className="text-center py-4">
                      {planFeatures.comfort.features.notifications.whatsapp ? (
                        <Check className="inline h-5 w-5 text-green-500" />
                      ) : (
                        "–"
                      )}
                    </td>
                    <td className="text-center py-4">
                      {planFeatures.vip.features.notifications.whatsapp ? (
                        <Check className="inline h-5 w-5 text-green-500" />
                      ) : (
                        "–"
                      )}
                    </td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="py-4">Custom Pet Photo</td>
                    <td className="text-center py-4">
                      {planFeatures.basic.features.customPhoto ? (
                        <Check className="inline h-5 w-5 text-green-500" />
                      ) : (
                        "–"
                      )}
                    </td>
                    <td className="text-center py-4">
                      {planFeatures.comfort.features.customPhoto ? (
                        <Check className="inline h-5 w-5 text-green-500" />
                      ) : (
                        "–"
                      )}
                    </td>
                    <td className="text-center py-4">
                      {planFeatures.vip.features.customPhoto ? (
                        <Check className="inline h-5 w-5 text-green-500" />
                      ) : (
                        "–"
                      )}
                    </td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="py-4">Location Tracking</td>
                    <td className="text-center py-4">
                      {planFeatures.basic.features.locationTracking ? (
                        <Check className="inline h-5 w-5 text-green-500" />
                      ) : (
                        "–"
                      )}
                    </td>
                    <td className="text-center py-4">
                      {planFeatures.comfort.features.locationTracking ? (
                        <Check className="inline h-5 w-5 text-green-500" />
                      ) : (
                        "–"
                      )}
                    </td>
                    <td className="text-center py-4">
                      {planFeatures.vip.features.locationTracking ? (
                        <Check className="inline h-5 w-5 text-green-500" />
                      ) : (
                        "–"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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

export default AccountPage;
