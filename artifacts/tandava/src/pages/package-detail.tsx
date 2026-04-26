import { useRoute, Link } from "wouter";
import { useListPackages, getListPackagesQueryKey } from "@workspace/api-client-react";
import { resolveImageUrl } from "@/lib/image";
import { FaWhatsapp } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

export default function PackageDetail() {
  const [, params] = useRoute("/packages/:id");
  const packageId = params?.id ? parseInt(params.id) : 0;
  
  const { data: packages, isLoading } = useListPackages(undefined, { query: { queryKey: getListPackagesQueryKey() } });
  
  const pkg = packages?.find(p => p.id === packageId);

  if (isLoading) {
    return <div className="min-h-screen bg-background pt-32 px-4 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-background pt-32 px-4 text-center text-foreground">
        <h1 className="text-3xl font-serif mb-4">Package Not Found</h1>
        <Link href="/packages" className="text-primary hover:underline">Back to Packages</Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-24 text-foreground pb-24">
      {/* Hero Image */}
      <div className="w-full h-[40vh] md:h-[60vh] relative mb-12">
        <img 
          src={resolveImageUrl(pkg.imageUrl)} 
          alt={pkg.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 container mx-auto">
          <Link href="/packages" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 uppercase tracking-widest text-xs font-semibold mb-6">
            <ArrowLeft size={16} /> Back to Packages
          </Link>
          <p className="text-primary uppercase tracking-widest font-semibold mb-2">{pkg.destination}</p>
          <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-4 drop-shadow-lg">{pkg.title}</h1>
          <div className="flex gap-6 items-center text-muted-foreground">
            <span>{pkg.duration}</span>
            <span>•</span>
            <span className="text-xl font-serif text-primary">₹{pkg.startingPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="mb-12">
            <h2 className="text-2xl font-serif mb-6 text-primary">About this Journey</h2>
            <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">{pkg.description}</p>
          </div>

          {pkg.highlights && pkg.highlights.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-serif mb-6 text-primary">Highlights</h2>
              <ul className="space-y-4">
                {pkg.highlights.map((h, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="text-primary mt-1">✧</span>
                    <span className="text-muted-foreground">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {pkg.includedServices && pkg.includedServices.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-serif mb-6 text-primary">What's Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pkg.includedServices.map((service, i) => (
                  <div key={i} className="bg-card border border-border/50 p-4 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="text-muted-foreground">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="glass-card p-8 sticky top-32">
            <h3 className="font-serif text-2xl text-foreground mb-2">Book This Journey</h3>
            <p className="text-muted-foreground text-sm mb-8">Reach out to our concierges on WhatsApp to customize and book this package.</p>
            
            <div className="mb-8 border-b border-border pb-8">
              <p className="text-sm uppercase tracking-widest text-muted-foreground mb-1">Starting from</p>
              <p className="text-3xl font-serif text-primary">₹{pkg.startingPrice.toLocaleString('en-IN')}</p>
            </div>

            <a 
              href={`https://wa.me/917012393250?text=Hi%20Tandava%20Tour%20Company,%20I'm%20interested%20in%20booking%20the%20${encodeURIComponent(pkg.title)}%20package`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-primary text-primary-foreground text-center uppercase tracking-widest text-sm font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(201,162,74,0.3)]"
            >
              <FaWhatsapp size={20} /> WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
