import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";

const cards = [
  {
    title: "Backwaters",
    desc: "Houseboats in Alleppey & Kumarakom",
    image: "pkg-alleppey.png",
    href: "/packages",
  },
  {
    title: "Munnar Hills",
    desc: "Tea estates & misty peaks",
    image: "pkg-munnar.png",
    href: "/packages",
  },
  {
    title: "Family Trips",
    desc: "Curated, comfortable, safe",
    image: "pkg-wayanad.png",
    href: "/packages",
  },
  {
    title: "Airport Pickup",
    desc: "Premium chauffeured transfers",
    image: "veh-innova.png",
    href: "/fleet",
  },
];

export function JourneyStartsHere() {
  return (
    <section className="py-20 md:py-28 px-4 md:px-8 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pattern-leaf opacity-15 pointer-events-none" />
      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-sm font-semibold tracking-[0.3em] text-primary uppercase mb-4">Begin the Voyage</h2>
          <h3 className="font-serif text-3xl md:text-5xl text-foreground">Your Kerala Journey Starts Here</h3>
          <div className="mt-5 w-24 h-[2px] mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cards.map((c, i) => (
            <ParallaxCard key={c.title} card={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ParallaxCard({ card, index }: { card: typeof cards[number]; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-22, 22]);

  return (
    <motion.a
      ref={ref}
      href={card.href}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      className="group relative block aspect-[3/4] overflow-hidden rounded-sm border border-border/60 hover:border-primary/60 transition-colors"
    >
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src={`${import.meta.env.BASE_URL}generated/${card.image}`}
          alt={card.title}
          loading="lazy"
          className="w-full h-[120%] object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 z-10">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="font-serif text-lg md:text-2xl text-foreground leading-tight">{card.title}</h4>
            <p className="text-[11px] md:text-xs text-muted-foreground mt-1 line-clamp-2">{card.desc}</p>
          </div>
          <span className="shrink-0 mt-1 w-8 h-8 rounded-full border border-primary/40 text-primary flex items-center justify-center bg-background/30 backdrop-blur-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
      <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.a>
  );
}
