import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Users, BadgeCheck } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";

const counters = [
  { to: 5000, suffix: "+", label: "Happy Travellers" },
  { to: 1200, suffix: "+", label: "Trips Completed" },
  { to: 10, suffix: "+", label: "Years of Service" },
  { to: 50, suffix: "+", label: "Luxury Vehicles" },
];

const trustBadges = [
  { icon: ShieldCheck, label: "24/7 Support", desc: "Always reachable" },
  { icon: Sparkles, label: "Clean Vehicles", desc: "Sanitised & ready" },
  { icon: Users, label: "Family Friendly", desc: "Tailored for all ages" },
  { icon: BadgeCheck, label: "Verified Drivers", desc: "Trained professionals" },
];

export function TrustSection() {
  return (
    <section className="py-24 px-4 md:px-8 bg-card relative overflow-hidden border-y border-primary/10">
      <div className="absolute inset-0 pattern-leaf opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold tracking-[0.3em] text-primary uppercase mb-4">Why Travellers Choose Us</h2>
          <h3 className="font-serif text-3xl md:text-5xl text-foreground">Trusted across God's Own Country</h3>
        </div>

        {/* Animated counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {counters.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <div className="text-4xl md:text-6xl font-serif text-gradient-gold mb-3">
                <AnimatedCounter to={c.to} suffix={c.suffix} />
              </div>
              <div className="text-xs md:text-sm tracking-widest text-muted-foreground uppercase">{c.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustBadges.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="glass-card p-6 text-center group hover:border-primary/40 transition-colors"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:gold-glow transition-shadow">
                  <Icon className="text-primary" size={26} />
                </div>
                <h4 className="font-serif text-lg text-foreground mb-1">{b.label}</h4>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
