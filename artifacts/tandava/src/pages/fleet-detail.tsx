import { useRoute, Link } from "wouter";
import { useListVehicles, getListVehiclesQueryKey } from "@workspace/api-client-react";
import { resolveImageUrl } from "@/lib/image";
import { FaWhatsapp, FaSnowflake, FaMusic, FaUsers } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

export default function FleetDetail() {
  const [, params] = useRoute("/fleet/:id");
  const vehicleId = params?.id ? parseInt(params.id) : 0;
  
  const { data: vehicles, isLoading } = useListVehicles(undefined, { query: { queryKey: getListVehiclesQueryKey() } });
  
  const vehicle = vehicles?.find(v => v.id === vehicleId);

  if (isLoading) {
    return <div className="min-h-screen bg-background pt-32 px-4 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background pt-32 px-4 text-center text-foreground">
        <h1 className="text-3xl font-serif mb-4">Vehicle Not Found</h1>
        <Link href="/fleet" className="text-primary hover:underline">Back to Fleet</Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-32 text-foreground pb-24 relative">
      <div 
        className="absolute inset-0 z-0 opacity-10 bg-cover bg-center bg-fixed pointer-events-none"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}generated/section-bg-2.png)` }}
      />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="mb-8">
          <Link href="/fleet" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 uppercase tracking-widest text-xs font-semibold">
            <ArrowLeft size={16} /> Back to Fleet
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="rounded-sm overflow-hidden border border-border shadow-2xl relative">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-sm z-10 pointer-events-none mix-blend-overlay"></div>
            <img 
              src={resolveImageUrl(vehicle.imageUrl)} 
              alt={vehicle.name} 
              className="w-full h-auto object-cover"
            />
          </div>
          
          <div>
            <p className="text-primary uppercase tracking-widest font-semibold mb-4">{vehicle.vehicleType}</p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-8">{vehicle.name}</h1>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="bg-card border border-border p-4 flex items-center gap-4 rounded-sm min-w-[140px]">
                <FaUsers size={24} className="text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Capacity</p>
                  <p className="font-semibold">{vehicle.seatingCapacity} Seats</p>
                </div>
              </div>
              
              <div className="bg-card border border-border p-4 flex items-center gap-4 rounded-sm min-w-[140px]">
                <FaSnowflake size={24} className={vehicle.airConditioned ? "text-blue-400" : "text-muted-foreground/30"} />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">A/C</p>
                  <p className="font-semibold">{vehicle.airConditioned ? "Available" : "N/A"}</p>
                </div>
              </div>
              
              <div className="bg-card border border-border p-4 flex items-center gap-4 rounded-sm min-w-[140px]">
                <FaMusic size={24} className={vehicle.musicSystem ? "text-purple-400" : "text-muted-foreground/30"} />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Music</p>
                  <p className="font-semibold">{vehicle.musicSystem ? "Available" : "N/A"}</p>
                </div>
              </div>
            </div>
            
            <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap mb-10">{vehicle.description}</p>
            
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="mb-10">
                <h3 className="font-serif text-xl mb-4 text-primary">Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehicle.features.map((feature, i) => (
                    <li key={i} className="flex gap-3 items-center text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <a 
              href={`https://wa.me/917012393250?text=Hi%20Tandava%20Tour%20Company,%20I'm%20interested%20in%20booking%20the%20${encodeURIComponent(vehicle.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex px-8 py-4 bg-primary text-primary-foreground uppercase tracking-widest text-sm font-bold hover:bg-primary/90 transition-colors items-center justify-center gap-3 shadow-[0_0_20px_rgba(201,162,74,0.3)]"
            >
              <FaWhatsapp size={20} /> Request Booking
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
