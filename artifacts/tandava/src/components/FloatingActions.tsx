import { useEffect, useState } from "react";
import { FaWhatsapp, FaInstagram, FaPhone } from "react-icons/fa";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PHONE = "+917012393250";
const WA = "917012393250";
const IG = "https://www.instagram.com/tandava_tour_company/";

export function FloatingActions() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Hide on admin routes (rendered conditionally by App, but also self-hide if on /admin)
  useEffect(() => {
    const check = () => setHidden(window.location.pathname.includes("/admin"));
    check();
    window.addEventListener("popstate", check);
    return () => window.removeEventListener("popstate", check);
  }, []);

  if (hidden) return null;

  const items = [
    {
      label: "WhatsApp",
      href: `https://wa.me/${WA}?text=Hi%20Tandava%20Tour%20Company,%20I%20want%20to%20book%20a%20trip`,
      icon: FaWhatsapp,
      color: "bg-[#25D366] hover:bg-[#1ebe57]",
      external: true,
    },
    {
      label: "Call",
      href: `tel:${PHONE}`,
      icon: FaPhone,
      color: "bg-primary hover:bg-primary/90 text-primary-foreground",
      external: false,
    },
    {
      label: "Instagram",
      href: IG,
      icon: FaInstagram,
      color: "bg-gradient-to-tr from-pink-500 via-orange-500 to-yellow-500",
      external: true,
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.a
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              aria-label={item.label}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              transition={{ delay: i * 0.05 }}
              className={`w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg ${item.color}`}
            >
              <Icon size={20} />
            </motion.a>
          );
        })}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close quick actions" : "Open quick actions"}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: open ? 45 : 0 }}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl gold-glow"
      >
        {open ? <Plus size={26} /> : <FaWhatsapp size={26} />}
      </motion.button>
    </div>
  );
}
