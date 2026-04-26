import { motion } from "framer-motion";
import { Link } from "wouter";
import { Waves, Mountain, Landmark, Users, Plane, Sparkles } from "lucide-react";

const experiences = [
  {
    icon: Waves,
    title: "Backwater Trips",
    desc: "Drift through emerald canals on private deluxe houseboats.",
    color: "from-cyan-500/20 to-emerald-500/10",
  },
  {
    icon: Mountain,
    title: "Munnar Hill Rides",
    desc: "Wind through tea estates and mist-veiled peaks of the Western Ghats.",
    color: "from-emerald-500/20 to-teal-500/10",
  },
  {
    icon: Landmark,
    title: "Temple Tours",
    desc: "Discover ancient shrines and the spiritual heart of Kerala.",
    color: "from-amber-500/20 to-yellow-500/10",
  },
  {
    icon: Users,
    title: "Family Trips",
    desc: "Tailored itineraries for unforgettable family memories.",
    color: "from-rose-500/15 to-pink-500/10",
  },
  {
    icon: Plane,
    title: "Airport Pickup",
    desc: "Premium chauffeured transfers from any Kerala airport.",
    color: "from-sky-500/20 to-blue-500/10",
  },
  {
    icon: Sparkles,
    title: "Custom Packages",
    desc: "Bespoke journeys crafted around your dreams and dates.",
    color: "from-primary/25 to-amber-600/10",
  },
];

export function ExperienceKerala() {
  return (
    <section className="py-24 px-4 md:px-8 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pattern-leaf opacity-20 pointer-events-none" />
      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-[0.3em] text-primary uppercase mb-4">Experience Kerala</h2>
          <h3 className="font-serif text-3xl md:text-5xl text-foreground mb-4">Experience Kerala with Tandava</h3>
          <p className="text-muted-foreground text-lg">Six signature ways to immerse yourself in God's Own Country.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp, i) => {
            const Icon = exp.icon;
            return (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="group relative glass-card p-8 overflow-hidden cursor-default"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${exp.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="w-14 h-14 mb-6 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:gold-glow group-hover:scale-110 transition-all duration-500">
                    <Icon className="text-primary" size={26} />
                  </div>
                  <h4 className="font-serif text-2xl text-foreground mb-3">{exp.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{exp.desc}</p>
                </div>
                <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border border-primary text-primary uppercase tracking-widest text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Explore All Packages
          </Link>
        </div>
      </div>
    </section>
  );
}
