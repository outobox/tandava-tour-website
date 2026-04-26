import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Packages", href: "/packages" },
  { name: "Fleet", href: "/fleet" },
  { name: "Gallery", href: "/gallery" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClass = isScrolled || mobileMenuOpen
    ? "bg-background/70 backdrop-blur-xl border-b border-primary/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
    : "bg-gradient-to-b from-background/60 via-background/20 to-transparent backdrop-blur-sm";

  function isActive(href: string): boolean {
    if (href === "/") return location === "/";
    return location === href || location.startsWith(`${href}/`);
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerClass}`}>
      {/* Subtle gold underline at the bottom of the header */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 z-50 relative group">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <img
              src={`${import.meta.env.BASE_URL}tandava-logo.jpg`}
              alt="Tandava Tour Company"
              className="relative w-12 h-12 rounded-full border border-primary/40 shadow-[0_0_15px_rgba(201,162,74,0.35)] object-cover"
            />
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-serif font-semibold text-base lg:text-lg tracking-[0.18em] text-gradient-gold">
              TANDAVA
            </span>
            <span className="text-[9px] lg:text-[10px] tracking-[0.32em] uppercase text-foreground/70 mt-1">
              Tour Company
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-xs lg:text-sm font-medium tracking-wider uppercase transition-colors hover:text-primary ${
                  active ? "text-primary" : "text-foreground/85"
                }`}
              >
                {link.name}
                <span
                  className={`absolute left-3 right-3 -bottom-0.5 h-[2px] bg-gradient-to-r from-primary/0 via-primary to-primary/0 origin-center transform transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0"
                  } group-hover:scale-x-100`}
                />
                {/* Hover underline (separate so it can overlap active state cleanly) */}
                <span className="absolute left-3 right-3 -bottom-0.5 h-[2px] bg-gradient-to-r from-primary/0 via-primary/70 to-primary/0 scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-center" />
              </Link>
            );
          })}
          <a
            href="https://wa.me/917012393250?text=Hi%20Tandava%20Tour%20Company,%20I%20want%20to%20book%20a%20trip"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 nav-book-btn"
          >
            <FaWhatsapp size={14} />
            <span>Book Now</span>
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground z-50 relative"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-0 pt-24 bg-background/95 backdrop-blur-xl border-b border-border z-40 flex flex-col h-screen"
          >
            <div className="flex flex-col items-center gap-6 p-8">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-2xl font-serif tracking-widest transition-colors hover:text-primary ${
                      active ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <a
                href="https://wa.me/917012393250?text=Hi%20Tandava%20Tour%20Company,%20I%20want%20to%20book%20a%20trip"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 px-8 py-3 text-lg font-semibold tracking-wide uppercase bg-primary text-primary-foreground rounded-sm w-full text-center inline-flex items-center justify-center gap-2"
              >
                <FaWhatsapp size={18} /> Book Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
