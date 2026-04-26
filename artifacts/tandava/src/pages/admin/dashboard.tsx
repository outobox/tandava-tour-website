import { useAdminDashboardStats, getAdminDashboardStatsQueryKey } from "@workspace/api-client-react";
import { Package, Car, Image as ImageIcon, Star } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = useAdminDashboardStats({ query: { queryKey: getAdminDashboardStatsQueryKey() } });

  if (isLoading) {
    return <div className="animate-pulse flex flex-col gap-6">
      <div className="h-8 bg-card w-48 rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-card rounded-sm"></div>)}
      </div>
    </div>;
  }

  const statCards = [
    {
      title: "Total Packages",
      value: stats?.totalPackages || 0,
      subValue: `${stats?.activePackages || 0} active`,
      icon: Package,
      color: "text-blue-400"
    },
    {
      title: "Fleet Size",
      value: stats?.totalVehicles || 0,
      subValue: `${stats?.activeVehicles || 0} active`,
      icon: Car,
      color: "text-emerald-400"
    },
    {
      title: "Gallery Images",
      value: stats?.totalGalleryImages || 0,
      subValue: "Visual assets",
      icon: ImageIcon,
      color: "text-purple-400"
    },
    {
      title: "Reviews",
      value: stats?.totalReviews || 0,
      subValue: `${stats?.averageRating?.toFixed(1) || '0.0'} average rating`,
      icon: Star,
      color: "text-primary"
    }
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-foreground mb-2">Overview</h1>
      <p className="text-muted-foreground mb-8">Welcome back to the Tandava control room.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-card border border-border p-6 rounded-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                <Icon size={100} className={stat.color} />
              </div>
              <div className="relative z-10">
                <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">{stat.title}</p>
                <p className="text-4xl font-serif text-foreground mb-2">{stat.value}</p>
                <p className="text-xs text-primary">{stat.subValue}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
