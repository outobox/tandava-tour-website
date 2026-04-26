import { Link } from "wouter";

export default function About() {
  return (
    <div className="bg-background min-h-screen pt-32 pb-24 text-foreground relative">
      <div 
        className="absolute inset-0 z-0 opacity-10 bg-cover bg-center bg-fixed pointer-events-none"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}generated/section-bg-3.png)` }}
      />
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Our Story</h1>
          <p className="text-muted-foreground text-lg">Rooted in the cosmic dance of Shiva, crafting mythic journeys across Kerala.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="font-serif text-3xl mb-6 text-primary">The Vision</h2>
            <p className="text-muted-foreground leading-relaxed text-lg mb-6">
              Tandava Tour Company was born from a desire to showcase Kerala not just as a destination, but as an experience that resonates with the soul. Inspired by the Tandava, the divine dance of creation, we orchestrate journeys that find the perfect rhythm between thrilling exploration and deep, restorative peace.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              We reject the templated approach to tourism. Every itinerary we design, every vehicle in our fleet, and every interaction with our concierges is infused with a commitment to dark luxury—where elegance is found in the shadows, in the quiet moments on the backwaters at dusk, and in the profound beauty of our heritage.
            </p>
          </div>
          <div className="h-[400px] rounded-sm overflow-hidden border border-primary/20 relative">
            <img 
              src={`${import.meta.env.BASE_URL}generated/pkg-alleppey.png`} 
              alt="Houseboat in Alleppey" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 text-center">
          <div className="glass-card p-8 border-t border-t-primary/20">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary text-2xl font-serif">1</div>
            <h3 className="font-serif text-xl mb-4 text-foreground">Bespoke Curation</h3>
            <p className="text-muted-foreground text-sm">Every journey is tailored to your unique rhythm, ensuring an experience that is entirely your own.</p>
          </div>
          <div className="glass-card p-8 border-t border-t-primary/20">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary text-2xl font-serif">2</div>
            <h3 className="font-serif text-xl mb-4 text-foreground">Uncompromised Luxury</h3>
            <p className="text-muted-foreground text-sm">From our premium fleet to our handpicked accommodations, we maintain the highest standards of dark luxury.</p>
          </div>
          <div className="glass-card p-8 border-t border-t-primary/20">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary text-2xl font-serif">3</div>
            <h3 className="font-serif text-xl mb-4 text-foreground">Authentic Connection</h3>
            <p className="text-muted-foreground text-sm">We provide deeper access to Kerala's culture, bypassing the superficial to reveal the true essence of God's Own Country.</p>
          </div>
        </div>

        <div className="text-center bg-card p-12 border border-border">
          <h2 className="font-serif text-3xl mb-6 text-primary">Begin Your Journey</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Allow us to choreograph your perfect Kerala experience. Pack your bags, we'll do the rest.</p>
          <Link href="/contact" className="inline-flex px-8 py-4 bg-primary text-primary-foreground uppercase tracking-widest text-sm font-bold hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(201,162,74,0.3)]">
            Contact Our Concierges
          </Link>
        </div>
      </div>
    </div>
  );
}
