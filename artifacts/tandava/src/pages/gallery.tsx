import { useState } from "react";
import { useListGalleryImages, getListGalleryImagesQueryKey } from "@workspace/api-client-react";
import { resolveImageUrl } from "@/lib/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Gallery() {
  const { data: gallery, isLoading } = useListGalleryImages({ query: { queryKey: getListGalleryImagesQueryKey() } });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = gallery?.sort((a, b) => a.sortOrder - b.sortOrder) || [];

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 text-foreground">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Visual Journey</h1>
          <p className="text-muted-foreground text-lg">Glimpses of the mythic landscapes and cultural richness of Kerala.</p>
        </div>

        {isLoading ? (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-card/50 animate-pulse border border-border/50 rounded-sm" style={{ height: `${Math.max(200, Math.random() * 400 + 200)}px` }} />
            ))}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
            {images.map((img) => (
              <div 
                key={img.id} 
                className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-sm border border-border/50 shadow-lg"
                onClick={() => setSelectedImage(resolveImageUrl(img.imageUrl))}
              >
                <img 
                  src={resolveImageUrl(img.imageUrl)} 
                  alt={img.title || "Gallery image"} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {img.title && <h3 className="font-serif text-xl text-primary mb-2">{img.title}</h3>}
                    {img.caption && <p className="text-sm text-foreground/80">{img.caption}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl bg-transparent border-none p-0 shadow-none overflow-hidden flex items-center justify-center h-[90vh]">
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Expanded gallery image" 
              className="max-w-full max-h-full object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
