import { Link } from "wouter";
import { useListVehicles, getListVehiclesQueryKey } from "@workspace/api-client-react";
import { resolveImageUrl } from "@/lib/image";
import { FaWhatsapp, FaSnowflake, FaMusic } from "react-icons/fa";

export default function Fleet() {
  const { data: vehicles, isLoading } = useListVehicles(undefined, { query: { queryKey: getListVehiclesQueryKey() } });

  const activeVehicles = vehicles?.filter(v => v.active).sort((a, b) => a.sortOrder - b.sortOrder) || [];

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 text-foreground relative">
      <div 
        className="absolute inset-0 z-0 opacity-10 bg-cover bg-center bg-fixed pointer-events-none"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}generated/section-bg-3.png)` }}
      />
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Our Luxury Fleet</h1>
          <p className="text-muted-foreground text-lg">Travel in unparalleled comfort with our meticulously maintained fleet of premium vehicles.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[400px] bg-card/50 animate-pulse border border-border/50 rounded-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeVehicles.map((vehicle) => (
              <div key={vehicle.id} className="glass-card group overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col h-full border-t border-t-primary/20">
                <div className="relative h-56 overflow-hidden shrink-0">
                  <img 
                    src={resolveImageUrl(vehicle.imageUrl)} 
                    alt={vehicle.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <h4 className="font-serif text-2xl text-foreground drop-shadow-md">{vehicle.name}</h4>
                  </div>
                </div>
                <div className="p-6 flex flex-col grow">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-border/50">
                    <span className="text-primary uppercase tracking-widest text-sm font-semibold">{vehicle.vehicleType}</span>
                    <span className="text-muted-foreground">{vehicle.seatingCapacity} Seats</span>
                  </div>
                  
                  <div className="flex gap-3 mb-6">
                    {vehicle.airConditioned && (
                      <div className="px-3 py-1 bg-card border border-border/50 rounded-full text-xs text-muted-foreground flex items-center gap-2">
                        <FaSnowflake className="text-blue-400" /> A/C
                      </div>
                    )}
                    {vehicle.musicSystem && (
                      <div className="px-3 py-1 bg-card border border-border/50 rounded-full text-xs text-muted-foreground flex items-center gap-2">
                        <FaMusic className="text-purple-400" /> Music System
                      </div>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-8 grow">{vehicle.description}</p>
                  
                  <div className="flex flex-col gap-3 mt-auto">
                    <Link href={`/fleet/${vehicle.id}`} className="w-full py-3 bg-transparent border border-border text-foreground text-center uppercase tracking-widest text-xs font-bold hover:border-primary hover:text-primary transition-colors">
                      Vehicle Details
                    </Link>
                    <a 
                      href={`https://wa.me/917012393250?text=Hi%20Tandava%20Tour%20Company,%20I%20want%20to%20book%20the%20${encodeURIComponent(vehicle.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-primary/10 text-primary border border-primary/20 text-center uppercase tracking-widest text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-2"
                    >
                      <FaWhatsapp size={16} /> Book on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
