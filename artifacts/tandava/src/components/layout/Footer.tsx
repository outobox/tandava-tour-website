import { Link } from "wouter";
import { FaWhatsapp, FaInstagram, FaPhone, FaEnvelope } from "react-icons/fa";

export function Footer() {
  return (
    <footer id="footer" className="bg-background border-t border-border pt-16 pb-8 relative overflow-hidden">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="absolute inset-0 pattern-leaf opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <img
                src={`${import.meta.env.BASE_URL}tandava-logo.jpg`}
                alt="Tandava Tour Company"
                className="w-16 h-16 rounded-full border border-primary/40 object-cover gold-glow"
              />
              <div className="flex flex-col">
                <span className="font-serif font-semibold text-xl tracking-wider text-gradient-gold leading-tight">TANDAVA</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Tour Company</span>
              </div>
            </Link>
            <p className="text-foreground/80 mb-6 font-serif italic text-base">
              "Pack Your Bags, We'll Do the Rest!"
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/917012393250"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <FaWhatsapp size={18} />
              </a>
              <a
                href="https://www.instagram.com/tandava_tour_company/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="tel:+917012393250"
                aria-label="Call"
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <FaPhone size={16} />
              </a>
              <a
                href="mailto:tandavatours@gmail.com"
                aria-label="Email"
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <FaEnvelope size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg text-primary mb-6">Quick Links</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/packages" className="hover:text-primary transition-colors">Tour Packages</Link></li>
              <li><Link href="/fleet" className="hover:text-primary transition-colors">Our Fleet</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg text-primary mb-6">Contact Us</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="leading-relaxed">
                Tandava Tour Company<br />
                Thiruvananthapuram,<br />
                Kerala, India
              </li>
              <li>
                <a href="tel:+917012393250" className="hover:text-primary transition-colors flex items-center gap-2">
                  <FaPhone size={12} /> +91 70123 93250
                </a>
              </li>
              <li>
                <a href="mailto:tandavatours@gmail.com" className="hover:text-primary transition-colors flex items-center gap-2">
                  <FaEnvelope size={12} /> tandavatours@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg text-primary mb-6">Plan Your Trip</h4>
            <p className="text-muted-foreground mb-4 text-sm">Get curated Kerala itineraries straight to your inbox.</p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="bg-card border border-border px-4 py-2 text-sm w-full focus:outline-none focus:border-primary text-foreground rounded-sm"
              />
              <a
                href="https://wa.me/917012393250?text=Hi%20Tandava%20Tour%20Company,%20I%20want%20to%20book%20a%20trip"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold uppercase tracking-wider text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 rounded-sm"
              >
                <FaWhatsapp size={14} /> Book on WhatsApp
              </a>
            </form>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Tandava Tour Company. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <a href="https://www.instagram.com/tandava_tour_company/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-border/40 flex justify-center">
          <p className="text-[11px] md:text-xs tracking-[0.18em] uppercase text-muted-foreground/80 text-center">
            <span className="opacity-80">Powered by</span>{" "}
            <a
              href="https://www.outobox.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="powered-by-link font-semibold text-primary/90 hover:text-primary transition-colors"
            >
              Outobox Cyber Solutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
