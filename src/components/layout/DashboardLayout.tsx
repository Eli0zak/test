
import { ReactNode, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/supabase";
import { planFeatures } from "@/lib/plans";
import { Menu, User, Bell, X, Plus, LayoutDashboard, Users, Settings, PawPrint, LineChart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
}

const DashboardLayout = ({ children, isAdmin = false }: DashboardLayoutProps) => {
  const { user, userPlan } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  // Define navigation items based on user role
  const navigationItems = isAdmin 
    ? [
        { label: "لوحة التحكم", href: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
        { label: "المستخدمون", href: "/admin/users", icon: <Users size={18} /> },
        { label: "الحيوانات", href: "/admin/pets", icon: <PawPrint size={18} /> },
        { label: "التحليلات", href: "/admin/analytics", icon: <LineChart size={18} /> },
        { label: "الإعدادات", href: "/admin/settings", icon: <Settings size={18} /> },
      ]
    : [
        { label: "لوحة التحكم", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
        { label: "حيواناتي", href: "/pets", icon: <PawPrint size={18} /> },
        { label: "المسح", href: "/scans", icon: <LineChart size={18} /> },
        { label: "الحساب", href: "/account", icon: <User size={18} /> },
      ];

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) => (
    <Link
      to={href}
      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
        isActive(href)
          ? "bg-primary text-white"
          : "hover:bg-primary/10"
      }`}
      onClick={() => setMenuOpen(false)}
    >
      <span className="ml-2">{icon}</span>
      <span className="ar">{label}</span>
    </Link>
  );

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <Link to={isAdmin ? "/admin/dashboard" : "/dashboard"} className="flex items-center">
            <img src="/lovable-uploads/d8049df2-619a-44e5-9cd8-c54416c17875.png" alt="PetTouch" className="h-8 w-8 mr-2" />
            <span className="text-xl font-bold text-primary">PetTouch</span>
            {isAdmin && <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-md">مدير</span>}
          </Link>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(false)}
              className="md:hidden"
            >
              <X size={20} />
            </Button>
          )}
        </div>

        {user && (
          <div className="mt-8 flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
              {user.full_name ? user.full_name[0] : user.email[0]}
            </div>
            <div>
              <div className="font-medium">
                {user.full_name || user.email.split("@")[0]}
              </div>
              <div className="text-xs text-muted-foreground">
                {isAdmin ? "مدير النظام" : `خطة ${planFeatures[userPlan].name}`}
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator className="my-4" />

      <div className="flex-1">
        <nav className="grid gap-1 px-2">
          {navigationItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} icon={item.icon} />
          ))}
          
          {/* Only show Add Pet button for regular users */}
          {!isAdmin && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                navigate("/pets/new");
                setMenuOpen(false);
              }}
            >
              <Plus className="ml-2 h-4 w-4" /> إضافة حيوان جديد
            </Button>
          )}
        </nav>
      </div>

      <Separator className="my-4" />

      <div className="p-4">
        <Button variant="outline" className="w-full" onClick={handleSignOut}>
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Mobile Navigation */}
      {isMobile ? (
        <header className="border-b">
          <div className="flex h-16 items-center px-4">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <div className="flex-1 flex justify-center">
              <Link to={isAdmin ? "/admin/dashboard" : "/dashboard"} className="flex items-center">
                <img src="/lovable-uploads/d8049df2-619a-44e5-9cd8-c54416c17875.png" alt="PetTouch" className="h-8 w-8 mr-2" />
                <span className="text-xl font-bold text-primary">
                  PetTouch
                </span>
                {isAdmin && <span className="mr-1 text-xs bg-primary text-white px-1.5 py-0.5 rounded-md">مدير</span>}
              </Link>
            </div>
            <Link to={isAdmin ? "/admin/settings" : "/account"} className="mr-auto">
              <Button variant="ghost" size="icon">
                {isAdmin ? <Settings size={20} /> : <User size={20} />}
              </Button>
            </Link>
          </div>
        </header>
      ) : (
        <div className="flex">
          {/* Desktop Sidebar */}
          <aside className="w-64 border-l bg-background h-screen sticky top-0">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className={`${isMobile ? "p-4" : "p-8 mr-64"}`}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
