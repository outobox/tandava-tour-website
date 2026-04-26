import { useState } from "react";
import { 
  useListVehicles, 
  useCreateVehicle, 
  useUpdateVehicle, 
  useDeleteVehicle, 
  getListVehiclesQueryKey,
  useRequestUploadUrl,
  type Vehicle,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { uploadFile } from "@/lib/upload";
import { resolveImageUrl } from "@/lib/image";
import { Edit, Trash, Plus, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminVehicles() {
  const queryClient = useQueryClient();
  const { data: vehicles, isLoading } = useListVehicles({ includeInactive: true }, { query: { queryKey: getListVehiclesQueryKey({ includeInactive: true }) } });
  
  const createMutation = useCreateVehicle();
  const updateMutation = useUpdateVehicle();
  const deleteMutation = useDeleteVehicle();
  const requestUploadUrlMutation = useRequestUploadUrl();

  const [isEditing, setIsEditing] = useState<Vehicle | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      await deleteMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListVehiclesQueryKey({ includeInactive: true }) });
      queryClient.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
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

      const vehicleData = {
        name: formData.get("name") as string,
        vehicleType: formData.get("vehicleType") as string,
        seatingCapacity: parseInt(formData.get("seatingCapacity") as string),
        airConditioned: formData.get("airConditioned") === "on",
        musicSystem: formData.get("musicSystem") === "on",
        description: formData.get("description") as string,
        features: (formData.get("features") as string).split(",").map(s => s.trim()).filter(Boolean),
        imageUrl: imageUrl,
        active: formData.get("active") === "on",
        sortOrder: parseInt(formData.get("sortOrder") as string) || 0
      };

      if (isEditing) {
        await updateMutation.mutateAsync({ id: isEditing.id, data: vehicleData });
      } else {
        await createMutation.mutateAsync({ data: vehicleData });
      }

      queryClient.invalidateQueries({ queryKey: getListVehiclesQueryKey({ includeInactive: true }) });
      queryClient.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
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
        <h1 className="font-serif text-3xl text-foreground">Fleet Management</h1>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-primary/90"
        >
          <Plus size={16} /> Add Vehicle
        </button>
      </div>

      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4">Vehicle</th>
              <th className="p-4">Type / Capacity</th>
              <th className="p-4">Features</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {vehicles?.map(vehicle => (
              <tr key={vehicle.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-10 rounded-sm overflow-hidden bg-muted flex-shrink-0">
                      {vehicle.imageUrl ? (
                        <img src={resolveImageUrl(vehicle.imageUrl)} alt={vehicle.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-full h-full p-2 text-muted-foreground" />
                      )}
                    </div>
                    <div className="font-medium text-foreground">{vehicle.name}</div>
                  </div>
                </td>
                <td className="p-4 text-sm text-foreground">
                  {vehicle.vehicleType} <span className="text-muted-foreground">({vehicle.seatingCapacity} pax)</span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {vehicle.airConditioned && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-sm uppercase tracking-wider">A/C</span>}
                    {vehicle.musicSystem && <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-sm uppercase tracking-wider">Music</span>}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-block px-2 py-1 text-[10px] uppercase tracking-wider rounded-sm ${vehicle.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-destructive/20 text-destructive'}`}>
                    {vehicle.active ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => setIsEditing(vehicle)} className="p-2 text-muted-foreground hover:text-primary transition-colors inline-block"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(vehicle.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors inline-block"><Trash size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isCreating || !!isEditing} onOpenChange={(open) => { if (!open) { setIsCreating(false); setIsEditing(null); } }}>
        <DialogContent className="max-w-3xl bg-card border-border text-foreground max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-primary">{isEditing ? 'Edit Vehicle' : 'New Vehicle'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Name</label>
                <input type="text" name="name" defaultValue={isEditing?.name || ""} required className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Type (e.g. Sedan, SUV)</label>
                <input type="text" name="vehicleType" defaultValue={isEditing?.vehicleType || ""} required className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Seating Capacity</label>
                <input type="number" name="seatingCapacity" defaultValue={isEditing?.seatingCapacity || ""} required min="1" className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Description</label>
              <textarea name="description" defaultValue={isEditing?.description || ""} required rows={3} className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary resize-none"></textarea>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Features (comma separated)</label>
              <textarea name="features" defaultValue={isEditing?.features?.join(", ") || ""} rows={2} className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary resize-none"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Image Upload</label>
                <input type="file" name="imageFile" accept="image/jpeg, image/png, image/webp" className="w-full bg-background border border-border p-2 text-foreground text-sm" />
                <input type="hidden" name="existingImageUrl" value={isEditing?.imageUrl || ""} />
                {isEditing?.imageUrl && (
                  <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                    Current: <img src={resolveImageUrl(isEditing.imageUrl)} alt="Current" className="h-8 w-12 object-cover rounded-sm" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="airConditioned" name="airConditioned" defaultChecked={isEditing?.airConditioned || false} className="w-4 h-4 accent-primary" />
                    <label htmlFor="airConditioned" className="text-sm text-foreground">A/C</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="musicSystem" name="musicSystem" defaultChecked={isEditing?.musicSystem || false} className="w-4 h-4 accent-primary" />
                    <label htmlFor="musicSystem" className="text-sm text-foreground">Music System</label>
                  </div>
                </div>
                <div className="flex gap-6 items-end mt-2">
                  <div className="flex-1">
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Sort Order</label>
                    <input type="number" name="sortOrder" defaultValue={isEditing?.sortOrder || 0} required className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
                  </div>
                  <div className="flex items-center gap-2 pb-3">
                    <input type="checkbox" id="active" name="active" defaultChecked={isEditing ? isEditing.active : true} className="w-5 h-5 accent-primary" />
                    <label htmlFor="active" className="text-sm font-medium text-foreground">Active</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-border">
              <button type="button" onClick={() => { setIsCreating(false); setIsEditing(null); }} className="px-6 py-2 border border-border text-foreground text-sm font-semibold uppercase tracking-wider hover:bg-white/5 transition-colors">Cancel</button>
              <button type="submit" disabled={isUploading || createMutation.isPending || updateMutation.isPending} className="px-6 py-2 bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50">
                {isUploading ? "Uploading..." : "Save Vehicle"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
