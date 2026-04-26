import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram } from "react-icons/fa";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import {
  useListInstagramPosts,
  getListInstagramPostsQueryKey,
  type InstagramPost,
} from "@workspace/api-client-react";
import { resolveImageUrl } from "@/lib/image";

const PROFILE_URL = "https://www.instagram.com/tandava_tour_company/";
const PROFILE_HANDLE = "@tandava_tour_company";

function PostCard({ post }: { post: InstagramPost }) {
  return (
    <a
      href={post.postUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0 w-72 sm:w-80 group bg-white/5 backdrop-blur-md border border-primary/20 rounded-xl overflow-hidden hover:border-primary/60 hover:bg-white/[0.07] transition-all duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_40px_rgba(201,162,74,0.25)]"
    >
      <div className="relative aspect-square overflow-hidden bg-background">
        <img
          src={resolveImageUrl(post.imageUrl)}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-90" />
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          <FaInstagram size={14} className="text-primary" />
          <span className="text-xs uppercase tracking-widest text-white/90 font-medium">Tandava</span>
        </div>
      </div>

      <div className="p-5">
        <h4 className="font-serif text-lg text-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors">
          {post.title}
        </h4>
        {post.caption && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem]">{post.caption}</p>
        )}
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold border-b border-primary/30 pb-1 group-hover:border-primary transition-colors">
          View on Instagram <ExternalLink size={12} />
        </span>
      </div>
    </a>
  );
}

function FallbackCard() {
  return (
    <a
      href={PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block max-w-md mx-auto bg-white/5 backdrop-blur-md border border-primary/20 rounded-xl p-10 text-center hover:border-primary/60 transition-all"
    >
      <FaInstagram size={40} className="mx-auto text-primary mb-4" />
      <h4 className="font-serif text-2xl text-foreground mb-2">Follow us on Instagram</h4>
      <p className="text-muted-foreground mb-6">{PROFILE_HANDLE}</p>
      <span className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-xs uppercase tracking-widest font-semibold rounded-sm">
        <FaInstagram size={16} /> Visit Profile
      </span>
    </a>
  );
}

export function InstagramMarquee() {
  const { data: posts } = useListInstagramPosts(undefined, {
    query: { queryKey: getListInstagramPostsQueryKey() },
  });

  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);

  const items = posts ?? [];

  useEffect(() => {
    if (!trackRef.current) return;
    // Width of a single (non-doubled) sequence:
    setTrackWidth(trackRef.current.scrollWidth / 2);
  }, [items.length]);

  const scrollBy = (direction: "left" | "right") => {
    if (!trackRef.current) return;
    const amount = direction === "left" ? -340 : 340;
    trackRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (items.length === 0) {
    return (
      <section className="py-24 px-4 md:px-8 bg-background relative overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-sm font-semibold tracking-[0.3em] text-primary uppercase mb-4">From the Atelier</h2>
            <h3 className="font-serif text-3xl md:text-5xl text-foreground">On Instagram</h3>
          </div>
          <FallbackCard />
        </div>
      </section>
    );
  }

  // Duplicate the items so the auto-scroll loop is seamless
  const doubled = [...items, ...items];

  return (
    <section id="instagram" className="py-24 px-4 md:px-8 bg-background relative overflow-hidden">
      {/* subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_rgba(201,162,74,0.15),_transparent_60%)]" />

      <div className="container mx-auto relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <h2 className="text-sm font-semibold tracking-[0.3em] text-primary uppercase mb-4">From the Atelier</h2>
            <h3 className="font-serif text-3xl md:text-5xl text-foreground">On Instagram</h3>
            <a
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <FaInstagram size={16} /> {PROFILE_HANDLE}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollBy("left")}
              aria-label="Scroll left"
              className="w-11 h-11 rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollBy("right")}
              aria-label="Scroll right"
              className="w-11 h-11 rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Auto-scrolling marquee */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />

        <div ref={trackRef} className="overflow-x-auto scrollbar-hide">
          <motion.div
            className="flex gap-6 px-6 py-4 w-max"
            animate={paused || trackWidth === 0 ? { x: 0 } : { x: -trackWidth }}
            transition={
              paused || trackWidth === 0
                ? { duration: 0 }
                : { ease: "linear", duration: Math.max(20, items.length * 6), repeat: Infinity }
            }
          >
            {doubled.map((post, idx) => (
              <PostCard key={`${post.id}-${idx}`} post={post} />
            ))}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto relative mt-10 text-center">
        <a
          href={PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-7 py-3 border border-primary/30 text-primary uppercase tracking-widest text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <FaInstagram size={16} /> Follow {PROFILE_HANDLE}
        </a>
      </div>
    </section>
  );
}

export default InstagramMarquee;
