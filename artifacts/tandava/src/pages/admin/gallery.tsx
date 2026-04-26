import { useState } from "react";
import { 
  useListGalleryImages, 
  useCreateGalleryImage, 
  useDeleteGalleryImage, 
  getListGalleryImagesQueryKey,
  useRequestUploadUrl
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { uploadFile } from "@/lib/upload";
import { resolveImageUrl } from "@/lib/image";
import { Trash, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminGallery() {
  const queryClient = useQueryClient();
  const { data: gallery, isLoading } = useListGalleryImages({ query: { queryKey: getListGalleryImagesQueryKey() } });
  
  const createMutation = useCreateGalleryImage();
  const deleteMutation = useDeleteGalleryImage();
  const requestUploadUrlMutation = useRequestUploadUrl();

  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      await deleteMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListGalleryImagesQueryKey() });
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("imageFile") as File;
    
    if (!file || file.size === 0) {
      alert("Please select an image file.");
      return;
    }
    
    try {
      setIsUploading(true);
      const imageUrl = await uploadFile(file, (data) => requestUploadUrlMutation.mutateAsync(data));

      await createMutation.mutateAsync({ 
        data: {
          title: formData.get("title") as string,
          caption: formData.get("caption") as string,
          imageUrl: imageUrl,
          sortOrder: parseInt(formData.get("sortOrder") as string) || 0
        }
      });

      queryClient.invalidateQueries({ queryKey: getListGalleryImagesQueryKey() });
      setIsCreating(false);
    } catch (error) {
      console.error(error);
      alert("An error occurred while uploading.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl text-foreground">Gallery</h1>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-primary/90"
        >
          <Plus size={16} /> Add Image
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {gallery?.sort((a,b) => a.sortOrder - b.sortOrder).map(img => (
          <div key={img.id} className="bg-card border border-border rounded-sm overflow-hidden group relative">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={resolveImageUrl(img.imageUrl)} alt={img.title || "Gallery image"} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            </div>
            <div className="p-4 border-t border-border">
              <div className="font-medium text-foreground truncate">{img.title || "Untitled"}</div>
              <div className="text-xs text-muted-foreground truncate">{img.caption || "No caption"}</div>
            </div>
            <button 
              onClick={() => handleDelete(img.id)}
              className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash size={14} />
            </button>
          </div>
        ))}
      </div>

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-md bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-primary">Upload Image</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-6 mt-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Image File *</label>
              <input type="file" name="imageFile" required accept="image/jpeg, image/png, image/webp" className="w-full bg-background border border-border p-2 text-foreground text-sm" />
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Title</label>
              <input type="text" name="title" className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Caption</label>
              <input type="text" name="caption" className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Sort Order</label>
              <input type="number" name="sortOrder" defaultValue={0} required className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-border">
              <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2 border border-border text-foreground text-sm font-semibold uppercase tracking-wider hover:bg-white/5 transition-colors">Cancel</button>
              <button type="submit" disabled={isUploading || createMutation.isPending} className="px-6 py-2 bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50">
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
