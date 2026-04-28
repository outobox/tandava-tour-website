import { motion } from "framer-motion";
import { Link } from "wouter";
import { FaWhatsapp } from "react-icons/fa";
import { ChevronDown, Car } from "lucide-react";
import { useListPackages, getListPackagesQueryKey } from "@workspace/api-client-react";
import { resolveImageUrl } from "@/lib/image";
import { InstagramMarquee } from "@/components/InstagramMarquee";
import { TrustSection } from "@/components/TrustSection";
import { ExperienceKerala } from "@/components/ExperienceKerala";
import { JourneyStartsHere } from "@/components/JourneyStartsHere";
import { KeralaSceneBackdrop } from "@/components/KeralaSceneBackdrop";
import { PageMeta } from "@/components/PageMeta";

function getBadge(pkg: { duration?: string; startingPrice?: number; sortOrder?: number }, index: number): string | null {
  // Heuristic badges from existing data — no schema changes
  if (index === 0) return "Popular";
  if (pkg.duration && /^\s*(2|3)\s*Days?/i.test(pkg.duration)) return "Best for Weekend";
  if ((pkg.startingPrice ?? 0) <= 15000) return "Family Friendly";
  return null;
}

export default function Home() {
  const { data: packages } = useListPackages(undefined, { query: { queryKey: getListPackagesQueryKey() } });

  const safePackages = Array.isArray(packages)
  ? packages
  : packages?.items || packages?.data || [];

const featuredPackages = safePackages
  .filter(p => p.active)
  .slice(0, 3);

  return (
    <div className="bg-background min-h-screen text-foreground">
      <PageMeta
        title="Tandava Tour Company | Premium Kerala Tourism Experts"
        description="Premium Kerala tour packages, luxury vehicle fleet, and 24/7 concierge service. Pack Your Bags, We'll Do the Rest!"
      />

      {/* Hero Section — cinematic Kerala backdrop */}
      <section className="relative min-h-screen w-full overflow-hidden flex items-center">
        <KeralaSceneBackdrop />

        <div className="relative z-10 w-full px-4 pt-28 pb-20 md:pt-24 md:pb-24 flex flex-col items-center text-center">
          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-7 px-4 py-1.5 rounded-full border border-primary/30 bg-background/40 backdrop-blur-md text-[10px] md:text-xs uppercase tracking-[0.32em] text-primary/90"
          >
            Kerala • Tours • Vehicles • Custom Trips
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: "easeOut", delay: 0.1 }}
            className="mb-7 relative"
          >
            <div className="absolute inset-0 rounded-full bg-primary/30 blur-3xl animate-pulse" />
            <div className="absolute -inset-3 rounded-full border border-primary/20 hero-ring" />
            <div className="absolute -inset-7 rounded-full border border-primary/10 hero-ring-2" />
            <img
              src={`${import.meta.env.BASE_URL}tandava-logo.jpg`}
              alt="Tandava Tour Company"
              className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-primary/60 shadow-[0_0_60px_rgba(201,162,39,0.6)] object-cover"
            />
          </motion.div>

          {/* Brand title */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-serif font-bold tracking-[0.12em] mb-3 drop-shadow-2xl text-3xl md:text-5xl lg:text-6xl"
          >
            <span className="text-gradient-gold">TANDAVA TOUR COMPANY</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-lg md:text-2xl text-foreground/90 font-serif italic tracking-wide mb-5 max-w-2xl"
          >
            "Pack Your Bags, We'll Do the Rest!"
          </motion.p>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-sm md:text-base text-muted-foreground max-w-xl mb-10 leading-relaxed"
          >
            Explore Kerala with comfortable rides, curated packages, and trusted local travel
            support from Thiruvananthapuram.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-2xl justify-center"
          >
            <a
              href="https://wa.me/917012393250?text=Hi%20Tandava%20Tour%20Company,%20I%20want%20to%20plan%20a%20trip"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn cta-btn-whatsapp"
            >
              <FaWhatsapp size={18} /> Book on WhatsApp
            </a>
            <a href="#featured-packages" className="cta-btn cta-btn-gold">
              Explore Packages
            </a>
            <Link href="/fleet" className="cta-btn cta-btn-outline">
              <Car size={16} /> View Fleet
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ delay: 1.6, duration: 2, repeat: Infinity, repeatType: "loop" }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-primary/70"
          >
            <ChevronDown size={26} />
          </motion.div>
        </div>
      </section>

      {/* Your Kerala Journey Starts Here */}
      <JourneyStartsHere />

      {/* About Section */}
      <section className="py-24 px-4 md:px-8 bg-card relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-10 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}generated/section-bg-1.png)` }}
        />
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-sm font-semibold tracking-[0.3em] text-primary uppercase mb-4">The Atelier of Travel</h2>
            <h3 className="font-serif text-3xl md:text-5xl text-foreground mb-8">Discover the soul of Kerala through mythic journeys</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Rooted in the cosmic dance of Shiva, Tandava Tour Company crafts experiences that transcend ordinary travel. We don't just show you Kerala; we immerse you in its rhythm. From the silent backwaters of Alleppey to the mist-shrouded peaks of Munnar, every journey is a masterpiece of dark luxury and impeccable service.
            </p>
          </div>
        </div>
      </section>

      {/* Trust / Counters Section */}
      <TrustSection />

      {/* Experience Kerala Section */}
      <ExperienceKerala />

      {/* Featured Packages */}
      <section id="featured-packages" className="py-24 px-4 md:px-8 bg-background scroll-mt-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-sm font-semibold tracking-[0.3em] text-primary uppercase mb-4">Curated Experiences</h2>
              <h3 className="font-serif text-3xl md:text-5xl text-foreground">Featured Journeys</h3>
            </div>
            <Link href="/packages" className="hidden md:inline-flex text-primary hover:text-primary/80 uppercase tracking-widest text-sm font-semibold pb-1 border-b border-primary/30 hover:border-primary">
              View All Packages
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPackages.map((pkg, i) => {
              const badge = getBadge(pkg, i);
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="glass-card group overflow-hidden tilt-card flex flex-col h-full"
                >
                  <div className="relative h-64 overflow-hidden">
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
                    <div className="flex flex-col gap-2 mt-auto">
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
          <div className="mt-12 text-center md:hidden">
            <Link href="/packages" className="inline-flex text-primary uppercase tracking-widest text-sm font-semibold pb-1 border-b border-primary/30">
              View All Packages
            </Link>
          </div>
        </div>
      </section>

      {/* Instagram marquee */}
      <InstagramMarquee />

      {/* Contact Section */}
      <section className="py-24 px-4 md:px-8 bg-card relative">
        <div className="absolute inset-0 pattern-leaf opacity-30 pointer-events-none" />
        <div className="container mx-auto text-center max-w-3xl relative z-10">
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-8">Ready to begin your journey?</h2>
          <p className="text-muted-foreground mb-12 text-lg">Contact our travel concierges to craft your perfect Kerala experience.</p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <a
              href="https://wa.me/917012393250"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex px-10 py-5 bg-primary text-primary-foreground font-semibold tracking-widest uppercase text-sm hover:bg-primary/90 transition-all hover:shadow-[0_0_30px_rgba(201,162,39,0.5)] items-center gap-3 rounded-sm"
            >
              <FaWhatsapp size={24} /> Message Us Now
            </a>
            <Link
              href="/contact"
              className="inline-flex px-10 py-5 bg-transparent border border-primary text-primary font-semibold tracking-widest uppercase text-sm hover:bg-primary/10 transition-all rounded-sm"
            >
              Quick Booking Form
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
