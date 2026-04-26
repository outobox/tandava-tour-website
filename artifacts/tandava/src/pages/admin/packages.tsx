import { useState } from "react";
import { 
  useListPackages, 
  useCreatePackage, 
  useUpdatePackage, 
  useDeletePackage, 
  getListPackagesQueryKey,
  useRequestUploadUrl,
  type Package as PackageType,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { uploadFile } from "@/lib/upload";
import { resolveImageUrl } from "@/lib/image";
import { Edit, Trash, Plus, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminPackages() {
  const queryClient = useQueryClient();
  const { data: packages, isLoading } = useListPackages({ includeInactive: true }, { query: { queryKey: getListPackagesQueryKey({ includeInactive: true }) } });
  
  const createMutation = useCreatePackage();
  const updateMutation = useUpdatePackage();
  const deleteMutation = useDeletePackage();
  const requestUploadUrlMutation = useRequestUploadUrl();

  const [isEditing, setIsEditing] = useState<PackageType | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this package?")) {
      await deleteMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListPackagesQueryKey({ includeInactive: true }) });
      queryClient.invalidateQueries({ queryKey: getListPackagesQueryKey() });
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    let imageUrl = formData.get("existingImageUrl") as string;
    const file = formData.get("imageFile") as File;
    
    try {
      setIsUploading(true);
      if (file && file.size > 0) {
        imageUrl = await uploadFile(file, (data) => requestUploadUrlMutation.mutateAsync(data));
      }
      setIsUploading(false);

      const packageData = {
        title: formData.get("title") as string,
        destination: formData.get("destination") as string,
        duration: formData.get("duration") as string,
        startingPrice: parseFloat(formData.get("startingPrice") as string),
        description: formData.get("description") as string,
        includedServices: (formData.get("includedServices") as string).split(",").map(s => s.trim()).filter(Boolean),
        highlights: (formData.get("highlights") as string).split(",").map(s => s.trim()).filter(Boolean),
        imageUrl: imageUrl,
        active: formData.get("active") === "on",
        sortOrder: parseInt(formData.get("sortOrder") as string) || 0
      };

      if (isEditing) {
        await updateMutation.mutateAsync({ id: isEditing.id, data: packageData });
      } else {
        await createMutation.mutateAsync({ data: packageData });
      }

      queryClient.invalidateQueries({ queryKey: getListPackagesQueryKey({ includeInactive: true }) });
      queryClient.invalidateQueries({ queryKey: getListPackagesQueryKey() });
      setIsEditing(null);
      setIsCreating(false);
    } catch (error) {
      console.error(error);
      setIsUploading(false);
      alert("An error occurred while saving.");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl text-foreground">Tour Packages</h1>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-primary/90"
        >
          <Plus size={16} /> Add Package
        </button>
      </div>

      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4">Package</th>
              <th className="p-4">Destination</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {packages?.map(pkg => (
              <tr key={pkg.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-sm overflow-hidden bg-muted flex-shrink-0">
                      {pkg.imageUrl ? (
                        <img src={resolveImageUrl(pkg.imageUrl)} alt={pkg.title} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-full h-full p-3 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{pkg.title}</div>
                      <div className="text-xs text-muted-foreground">{pkg.duration}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-foreground">{pkg.destination}</td>
                <td className="p-4 text-sm text-foreground">₹{pkg.startingPrice.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`inline-block px-2 py-1 text-[10px] uppercase tracking-wider rounded-sm ${pkg.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-destructive/20 text-destructive'}`}>
                    {pkg.active ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => setIsEditing(pkg)} className="p-2 text-muted-foreground hover:text-primary transition-colors inline-block"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(pkg.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors inline-block"><Trash size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isCreating || !!isEditing} onOpenChange={(open) => { if (!open) { setIsCreating(false); setIsEditing(null); } }}>
        <DialogContent className="max-w-3xl bg-card border-border text-foreground max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-primary">{isEditing ? 'Edit Package' : 'New Package'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Title</label>
                <input type="text" name="title" defaultValue={isEditing?.title || ""} required className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Destination</label>
                <input type="text" name="destination" defaultValue={isEditing?.destination || ""} required className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Duration (e.g. 3 Days / 2 Nights)</label>
                <input type="text" name="duration" defaultValue={isEditing?.duration || ""} required className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Starting Price (INR)</label>
                <input type="number" name="startingPrice" defaultValue={isEditing?.startingPrice || ""} required min="0" step="0.01" className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Description</label>
              <textarea name="description" defaultValue={isEditing?.description || ""} required rows={4} className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary resize-none"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Included Services (comma separated)</label>
                <textarea name="includedServices" defaultValue={isEditing?.includedServices?.join(", ") || ""} rows={3} className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary resize-none"></textarea>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Highlights (comma separated)</label>
                <textarea name="highlights" defaultValue={isEditing?.highlights?.join(", ") || ""} rows={3} className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary resize-none"></textarea>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Image Upload</label>
                <input type="file" name="imageFile" accept="image/jpeg, image/png, image/webp" className="w-full bg-background border border-border p-2 text-foreground text-sm" />
                <input type="hidden" name="existingImageUrl" value={isEditing?.imageUrl || ""} />
                {isEditing?.imageUrl && (
                  <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                    Current: <img src={resolveImageUrl(isEditing.imageUrl)} alt="Current" className="h-8 w-8 object-cover rounded-sm" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Sort Order</label>
                  <input type="number" name="sortOrder" defaultValue={isEditing?.sortOrder || 0} required className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <input type="checkbox" id="active" name="active" defaultChecked={isEditing ? isEditing.active : true} className="w-5 h-5 accent-primary" />
                  <label htmlFor="active" className="text-sm font-medium text-foreground">Active (Visible to public)</label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-border">
              <button type="button" onClick={() => { setIsCreating(false); setIsEditing(null); }} className="px-6 py-2 border border-border text-foreground text-sm font-semibold uppercase tracking-wider hover:bg-white/5 transition-colors">Cancel</button>
              <button type="submit" disabled={isUploading || createMutation.isPending || updateMutation.isPending} className="px-6 py-2 bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50">
                {isUploading ? "Uploading..." : "Save Package"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
