import { useLocation, Link } from "wouter";
import { useAdminMe, useAdminLogout, getAdminMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, LayoutDashboard, Package, Car, Image as ImageIcon, Star, Settings, Instagram, KeyRound } from "lucide-react";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: session, isLoading, isError } = useAdminMe({ query: { queryKey: getAdminMeQueryKey() } });
  const logoutMutation = useAdminLogout();

  useEffect(() => {
    if (isError) {
      setLocation("/admin/login");
    }
  }, [isError, setLocation]);

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!session?.authenticated) {
    return null; // Will redirect via useEffect
  }

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      queryClient.invalidateQueries({ queryKey: getAdminMeQueryKey() });
      setLocation("/admin/login");
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Packages", href: "/admin/packages", icon: Package },
    { name: "Fleet", href: "/admin/vehicles", icon: Car },
    { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { name: "Instagram Posts", href: "/admin/instagram", icon: Instagram },
    { name: "Reviews", href: "/admin/reviews", icon: Star },
    { name: "Settings", href: "/admin/settings", icon: Settings },
    { name: "Change Password", href: "/admin/change-password", icon: KeyRound },
  ];

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col h-screen sticky top-0 shrink-0">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}tandava-logo.jpg`} alt="Logo" className="w-10 h-10 rounded-full border border-primary/30 object-cover" />
          <div>
            <h2 className="font-serif text-primary font-semibold tracking-wider">TANDAVA</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Admin Control</p>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center px-6 md:hidden">
           <h2 className="font-serif text-primary font-semibold tracking-wider">TANDAVA ADMIN</h2>
        </header>
        <div className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
