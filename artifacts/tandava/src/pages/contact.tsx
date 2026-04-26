import { useState } from "react";
import { useGetSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt, FaInstagram } from "react-icons/fa";
import { PageMeta } from "@/components/PageMeta";

export default function Contact() {
  const { data: settings } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickup: "",
    destination: "",
    date: "",
    travellers: "2",
    details: "",
  });

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const lines = [
      `Hi Tandava Tour Company! I'd like to plan a trip:`,
      ``,
      `• Name: ${form.name}`,
      form.phone ? `• Phone: ${form.phone}` : "",
      form.pickup ? `• Pickup Location: ${form.pickup}` : "",
      form.destination ? `• Destination: ${form.destination}` : "",
      form.date ? `• Travel Date: ${form.date}` : "",
      `• Travellers: ${form.travellers}`,
      form.details ? `\nAdditional Notes:\n${form.details}` : "",
    ].filter(Boolean);

    const text = lines.join("\n");
    const whatsappNum = settings?.whatsappNumber?.replace(/\D/g, '') || '917012393250';

    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 text-foreground relative">
      <PageMeta
        title="Tandava Tour Company | Book Your Trip"
        description="Reach out to Tandava Tour Company in Thiruvananthapuram, Kerala. Quick booking form, WhatsApp, phone, and email contact."
      />

      <div
        className="absolute inset-0 z-0 opacity-5 bg-cover bg-center bg-fixed pointer-events-none"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}generated/section-bg-1.png)` }}
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Plan Your Kerala Trip</h1>
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6" />
          <p className="text-muted-foreground text-lg">Tell us about your dream journey and our concierges will get back to you on WhatsApp within the hour.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Booking form — 3 columns */}
          <div className="glass-card p-8 md:p-10 lg:col-span-3">
            <h2 className="font-serif text-3xl mb-8 text-primary">Quick Booking Inquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Your Name" required>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={update("name")}
                    placeholder="e.g. Aarav Menon"
                    className="input-field"
                  />
                </Field>
                <Field label="Phone Number" required>
                  <input
                    type="tel"
                    name="phone"
                    required
                    pattern="^[+0-9 \-()]{7,20}$"
                    value={form.phone}
                    onChange={update("phone")}
                    placeholder="+91 ..."
                    className="input-field"
                  />
                </Field>
                <Field label="Pickup Location">
                  <input
                    type="text"
                    name="pickup"
                    value={form.pickup}
                    onChange={update("pickup")}
                    placeholder="e.g. Trivandrum Airport"
                    className="input-field"
                  />
                </Field>
                <Field label="Destination">
                  <input
                    type="text"
                    name="destination"
                    value={form.destination}
                    onChange={update("destination")}
                    placeholder="e.g. Munnar / Alleppey"
                    className="input-field"
                  />
                </Field>
                <Field label="Travel Date">
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={update("date")}
                    className="input-field"
                  />
                </Field>
                <Field label="No. of Travellers">
                  <select
                    name="travellers"
                    value={form.travellers}
                    onChange={update("travellers")}
                    className="input-field"
                  >
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Additional Notes">
                <textarea
                  name="details"
                  rows={4}
                  value={form.details}
                  onChange={update("details")}
                  placeholder="Tell us about your interests, special requests, or any preferences..."
                  className="input-field resize-none"
                />
              </Field>

              <button
                type="submit"
                className="w-full py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-3 shadow-[0_0_24px_rgba(201,162,39,0.25)] rounded-sm"
              >
                <FaWhatsapp size={20} /> Send via WhatsApp
              </button>
              <p className="text-xs text-muted-foreground text-center mt-2">Your details are never stored — they go straight to our WhatsApp.</p>
            </form>
          </div>

          {/* Contact info column — 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-primary/20 p-8 rounded-sm">
              <h2 className="font-serif text-2xl mb-6 text-foreground">Contact Information</h2>

              <div className="space-y-5">
                <ContactRow icon={<FaPhone />} label="Call Us">
                  <a href={`tel:${settings?.phonePrimary || '+917012393250'}`} className="text-foreground hover:text-primary transition-colors">
                    {settings?.phonePrimary || '+91 70123 93250'}
                  </a>
                  {settings?.phoneSecondary && (
                    <div><a href={`tel:${settings.phoneSecondary}`} className="text-foreground hover:text-primary transition-colors">{settings.phoneSecondary}</a></div>
                  )}
                </ContactRow>

                <ContactRow icon={<FaWhatsapp />} label="WhatsApp">
                  <a
                    href={`https://wa.me/${(settings?.whatsappNumber || '917012393250').replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {settings?.whatsappNumber || '+91 70123 93250'}
                  </a>
                </ContactRow>

                <ContactRow icon={<FaEnvelope />} label="Email">
                  <a href={`mailto:${settings?.email || 'tandavatours@gmail.com'}`} className="text-foreground hover:text-primary transition-colors break-all">
                    {settings?.email || 'tandavatours@gmail.com'}
                  </a>
                </ContactRow>

                <ContactRow icon={<FaInstagram />} label="Instagram">
                  <a
                    href={settings?.instagramUrl || 'https://www.instagram.com/tandava_tour_company/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    @tandava_tour_company
                  </a>
                </ContactRow>

                <ContactRow icon={<FaMapMarkerAlt />} label="Location">
                  <div className="text-foreground whitespace-pre-wrap">{settings?.location || 'Thiruvananthapuram\nKerala, India'}</div>
                </ContactRow>
              </div>
            </div>

            <div className="bg-card border border-border p-2 h-64 relative overflow-hidden group rounded-sm">
              <div className="absolute inset-0 border-2 border-primary/20 m-2 z-10 pointer-events-none transition-colors group-hover:border-primary/50" />
              <iframe
                title="Tandava Tour Company location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d252543.56587425418!2d76.7820716654714!3d8.500037894086694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05bbb805bbcd47%3A0x15439fab5c5c81cb!2sThiruvananthapuram%2C%20Kerala!5e0!3m2!1sen!2sin!4v1709669528765!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(120%) hue-rotate(180deg) brightness(80%)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          padding: 0.75rem;
          color: hsl(var(--foreground));
          outline: none;
          transition: border-color 200ms;
          border-radius: 2px;
        }
        .input-field:focus { border-color: hsl(var(--primary)); }
      `}</style>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
    </div>
  );
}

function ContactRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</h4>
        <div>{children}</div>
      </div>
    </div>
  );
}
