import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListPackages, getListPackagesQueryKey } from "@workspace/api-client-react";
import { resolveImageUrl } from "@/lib/image";
import { FaWhatsapp } from "react-icons/fa";
import { PageMeta } from "@/components/PageMeta";

function badgeFor(pkg: { duration?: string; startingPrice?: number }, index: number): string | null {
  if (index === 0) return "Popular";
  if (pkg.duration && /^\s*(2|3)\s*Days?/i.test(pkg.duration)) return "Best for Weekend";
  if ((pkg.startingPrice ?? 0) <= 15000) return "Family Friendly";
  return null;
}

export default function Packages() {
  const { data: packages, isLoading } = useListPackages(undefined, { query: { queryKey: getListPackagesQueryKey() } });

  const safePackages = Array.isArray(packages)
  ? packages
  : packages?.items || packages?.data || [];

const activePackages = safePackages
  .filter(p => p.active)
  .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 text-foreground">
      <PageMeta
        title="Tandava Tour Company | Tour Packages"
        description="Browse our hand-crafted Kerala tour packages — backwaters, hill stations, family trips, and bespoke journeys."
      />
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Curated Journeys</h1>
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6" />
          <p className="text-muted-foreground text-lg">Explore our hand-crafted travel experiences across God's Own Country, designed for the discerning traveler.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[520px] bg-card/50 animate-pulse border border-border/50 rounded-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activePackages.map((pkg, i) => {
              const badge = badgeFor(pkg, i);
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
                  className="glass-card group overflow-hidden tilt-card flex flex-col h-full"
                >
                  <div className="relative h-64 overflow-hidden shrink-0">
                    {badge && (
                      <span className="absolute top-4 left-4 z-20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground rounded-full shadow-lg">
                        {badge}
                      </span>
                    )}
                    <img
                      src={resolveImageUrl(pkg.imageUrl)}
                      alt={pkg.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="font-serif text-2xl text-foreground mb-1 drop-shadow-md">{pkg.title}</h4>
                      <p className="text-xs text-primary uppercase tracking-widest">{pkg.destination}</p>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col grow">
                    <div className="flex justify-between items-center mb-6 pb-6 border-b border-border/50">
                      <span className="text-muted-foreground text-sm">{pkg.duration}</span>
                      <span className="text-xl font-serif text-primary">₹{pkg.startingPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 grow">{pkg.description}</p>

                    <div className="flex flex-col gap-3 mt-auto">
                      <Link href={`/packages/${pkg.id}`} className="w-full py-3 bg-transparent border border-border text-foreground text-center uppercase tracking-widest text-xs font-bold hover:border-primary hover:text-primary transition-colors">
                        View Details
                      </Link>
                      <a
                        href={`https://wa.me/917012393250?text=Hi%20Tandava%20Tour%20Company,%20I'm%20interested%20in%20the%20${encodeURIComponent(pkg.title)}%20package`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-primary/10 text-primary border border-primary/30 text-center uppercase tracking-widest text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-2"
                      >
                        <FaWhatsapp size={16} /> Book on WhatsApp
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
