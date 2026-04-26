import { useState } from "react";
import {
  useListInstagramPosts,
  useCreateInstagramPost,
  useUpdateInstagramPost,
  useDeleteInstagramPost,
  getListInstagramPostsQueryKey,
  useRequestUploadUrl,
  type InstagramPost,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { uploadFile } from "@/lib/upload";
import { resolveImageUrl } from "@/lib/image";
import { Trash, Plus, Pencil, ExternalLink, Instagram as InstagramIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminInstagram() {
  const queryClient = useQueryClient();
  const { data: posts, isLoading } = useListInstagramPosts(
    { includeInactive: true },
    { query: { queryKey: getListInstagramPostsQueryKey({ includeInactive: true }) } },
  );

  const createMutation = useCreateInstagramPost();
  const updateMutation = useUpdateInstagramPost();
  const deleteMutation = useDeleteInstagramPost();
  const requestUploadUrlMutation = useRequestUploadUrl();

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<InstagramPost | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getListInstagramPostsQueryKey({ includeInactive: true }) });
    queryClient.invalidateQueries({ queryKey: getListInstagramPostsQueryKey() });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this Instagram post?")) {
      await deleteMutation.mutateAsync({ id });
      invalidate();
    }
  };

  const openCreate = () => {
    setEditing(null);
    setIsOpen(true);
  };
  const openEdit = (post: InstagramPost) => {
    setEditing(post);
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("imageFile") as File | null;
    const title = formData.get("title") as string;
    const caption = formData.get("caption") as string;
    const postUrl = formData.get("postUrl") as string;
    const displayOrder = parseInt((formData.get("displayOrder") as string) || "0", 10) || 0;
    const isActive = formData.get("isActive") === "on";

    if (!title.trim() || !postUrl.trim()) {
      alert("Title and Instagram URL are required.");
      return;
    }

    try {
      setIsUploading(true);
      let imageUrl = editing?.imageUrl ?? "";

      if (file && file.size > 0) {
        imageUrl = await uploadFile(file, (data) => requestUploadUrlMutation.mutateAsync(data));
      }

      if (!imageUrl) {
        alert("Please upload a post image.");
        setIsUploading(false);
        return;
      }

      const payload = { title, caption, imageUrl, postUrl, displayOrder, isActive };

      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, data: payload });
      } else {
        await createMutation.mutateAsync({ data: payload });
      }

      invalidate();
      setIsOpen(false);
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert("Could not save the post. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  const sorted = [...(posts ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Instagram Posts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            These appear in the auto-scrolling Instagram strip on the home page. Each card links to the real Instagram post URL.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-primary/90"
        >
          <Plus size={16} /> Add Post
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="bg-card border border-border rounded-sm p-12 text-center">
          <InstagramIcon size={32} className="mx-auto text-primary mb-4" />
          <h2 className="font-serif text-xl text-foreground mb-2">No posts yet</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Add your first Instagram post and it will appear in the public marquee on the home page.
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-primary/90"
          >
            <Plus size={16} /> Add First Post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sorted.map((post) => (
            <div key={post.id} className="bg-card border border-border rounded-sm overflow-hidden group relative flex flex-col">
              <div className="aspect-square overflow-hidden bg-background">
                <img
                  src={resolveImageUrl(post.imageUrl)}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4 border-t border-border flex-1 flex flex-col">
                <div className="flex items-start gap-2 mb-2">
                  <InstagramIcon size={14} className="text-primary mt-1 shrink-0" />
                  <div className="font-medium text-foreground line-clamp-1">{post.title}</div>
                </div>
                {post.caption && (
                  <div className="text-xs text-muted-foreground line-clamp-2 mb-3">{post.caption}</div>
                )}
                <a
                  href={post.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline truncate inline-flex items-center gap-1 mb-3"
                >
                  <ExternalLink size={12} /> {post.postUrl}
                </a>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50 text-xs">
                  <span className={`px-2 py-1 rounded-sm ${post.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                    {post.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-muted-foreground">Order: {post.displayOrder}</span>
                </div>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(post)}
                  className="p-2 bg-black/60 hover:bg-primary text-white rounded-full"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 bg-black/60 hover:bg-destructive text-white rounded-full"
                  title="Delete"
                >
                  <Trash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={(o) => { setIsOpen(o); if (!o) setEditing(null); }}>
        <DialogContent className="max-w-md bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-primary">
              {editing ? "Edit Instagram Post" : "Add Instagram Post"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-5 mt-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Post Image {editing ? "(leave empty to keep current)" : "*"}
              </label>
              <input
                type="file"
                name="imageFile"
                accept="image/jpeg,image/png,image/webp"
                className="w-full bg-background border border-border p-2 text-foreground text-sm"
              />
              {editing && (
                <img
                  src={resolveImageUrl(editing.imageUrl)}
                  alt=""
                  className="mt-3 w-24 h-24 object-cover border border-border rounded-sm"
                />
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Title *</label>
              <input
                type="text"
                name="title"
                required
                defaultValue={editing?.title ?? ""}
                placeholder="Sunset houseboat cruise"
                className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Caption</label>
              <textarea
                name="caption"
                rows={2}
                defaultValue={editing?.caption ?? ""}
                placeholder="A short caption for the card"
                className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Instagram Post URL *</label>
              <input
                type="url"
                name="postUrl"
                required
                defaultValue={editing?.postUrl ?? ""}
                placeholder="https://www.instagram.com/p/..."
                className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Display Order</label>
                <input
                  type="number"
                  name="displayOrder"
                  defaultValue={editing?.displayOrder ?? 0}
                  className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm text-foreground select-none cursor-pointer pb-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={editing ? editing.isActive : true}
                    className="w-4 h-4 accent-primary"
                  />
                  Active
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-border">
              <button
                type="button"
                onClick={() => { setIsOpen(false); setEditing(null); }}
                className="px-6 py-2 border border-border text-foreground text-sm font-semibold uppercase tracking-wider hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading || createMutation.isPending || updateMutation.isPending}
                className="px-6 py-2 bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isUploading ? "Saving..." : editing ? "Save Changes" : "Create"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
