import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });
  const updateMutation = useUpdateSettings();

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const data = {
        companyName: formData.get("companyName") as string,
        tagline: formData.get("tagline") as string,
        phonePrimary: formData.get("phonePrimary") as string,
        phoneSecondary: formData.get("phoneSecondary") as string,
        whatsappNumber: formData.get("whatsappNumber") as string,
        email: formData.get("email") as string,
        location: formData.get("location") as string,
        instagramUrl: formData.get("instagramUrl") as string,
        facebookUrl: formData.get("facebookUrl") as string,
        youtubeUrl: formData.get("youtubeUrl") as string,
        aboutText: formData.get("aboutText") as string,
      };

      await updateMutation.mutateAsync({ data });
      queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
      alert("Settings updated successfully!");
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving.");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl text-foreground">Site Settings</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8 bg-card border border-border p-8 rounded-sm">
        
        {/* General Identity */}
        <div>
          <h2 className="text-xl font-serif text-primary mb-4 border-b border-border pb-2">Brand Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Company Name</label>
              <input type="text" name="companyName" defaultValue={settings?.companyName || ""} className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Tagline</label>
              <input type="text" name="tagline" defaultValue={settings?.tagline || ""} className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">About Text (Footer/Short info)</label>
              <textarea name="aboutText" defaultValue={settings?.aboutText || ""} rows={3} className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="text-xl font-serif text-primary mb-4 border-b border-border pb-2">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Primary Phone</label>
              <input type="text" name="phonePrimary" defaultValue={settings?.phonePrimary || ""} className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Secondary Phone</label>
              <input type="text" name="phoneSecondary" defaultValue={settings?.phoneSecondary || ""} className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">WhatsApp Number (e.g. 917012393250)</label>
              <input type="text" name="whatsappNumber" defaultValue={settings?.whatsappNumber || ""} className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Email Address</label>
              <input type="email" name="email" defaultValue={settings?.email || ""} className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Physical Location</label>
              <textarea name="location" defaultValue={settings?.location || ""} rows={2} className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="text-xl font-serif text-primary mb-4 border-b border-border pb-2">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Instagram URL</label>
              <input type="url" name="instagramUrl" defaultValue={settings?.instagramUrl || ""} className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Facebook URL</label>
              <input type="url" name="facebookUrl" defaultValue={settings?.facebookUrl || ""} className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">YouTube URL</label>
              <input type="url" name="youtubeUrl" defaultValue={settings?.youtubeUrl || ""} className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-border">
          <button type="submit" disabled={updateMutation.isPending} className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(201,162,74,0.3)]">
            <Save size={18} /> {updateMutation.isPending ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
