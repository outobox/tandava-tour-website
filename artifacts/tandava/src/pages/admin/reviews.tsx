import { useState } from "react";
import { 
  useListReviews, 
  useCreateReview, 
  useUpdateReview, 
  useDeleteReview, 
  getListReviewsQueryKey,
  type Review,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, Trash, Plus, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminReviews() {
  const queryClient = useQueryClient();
  const { data: reviews, isLoading } = useListReviews({ query: { queryKey: getListReviewsQueryKey() } });
  
  const createMutation = useCreateReview();
  const updateMutation = useUpdateReview();
  const deleteMutation = useDeleteReview();

  const [isEditing, setIsEditing] = useState<Review | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this review?")) {
      await deleteMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() });
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const reviewData = {
        authorName: formData.get("authorName") as string,
        rating: parseInt(formData.get("rating") as string),
        comment: formData.get("comment") as string,
        location: formData.get("location") as string,
      };

      if (isEditing) {
        await updateMutation.mutateAsync({ id: isEditing.id, data: reviewData });
      } else {
        await createMutation.mutateAsync({ data: reviewData });
      }

      queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() });
      setIsEditing(null);
      setIsCreating(false);
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving.");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl text-foreground">Reviews</h1>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-primary/90"
        >
          <Plus size={16} /> Add Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {reviews?.map(review => (
          <div key={review.id} className="bg-card border border-border rounded-sm p-6 relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <button onClick={() => setIsEditing(review)} className="p-1 text-muted-foreground hover:text-primary transition-colors"><Edit size={14} /></button>
              <button onClick={() => handleDelete(review.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors"><Trash size={14} /></button>
            </div>
            
            <div className="flex items-center gap-1 text-primary mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={i < review.rating ? 0 : 2} />
              ))}
            </div>
            
            <p className="text-foreground text-sm italic mb-6 line-clamp-4">"{review.comment}"</p>
            
            <div>
              <p className="font-serif text-primary">{review.authorName}</p>
              <p className="text-xs text-muted-foreground">{review.location}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isCreating || !!isEditing} onOpenChange={(open) => { if (!open) { setIsCreating(false); setIsEditing(null); } }}>
        <DialogContent className="max-w-md bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-primary">{isEditing ? 'Edit Review' : 'New Review'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-6 mt-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Author Name *</label>
              <input type="text" name="authorName" defaultValue={isEditing?.authorName || ""} required className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Rating (1-5) *</label>
                <input type="number" name="rating" min="1" max="5" defaultValue={isEditing?.rating || 5} required className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Location</label>
                <input type="text" name="location" defaultValue={isEditing?.location || ""} className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Comment *</label>
              <textarea name="comment" defaultValue={isEditing?.comment || ""} required rows={4} className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary resize-none"></textarea>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-border">
              <button type="button" onClick={() => { setIsCreating(false); setIsEditing(null); }} className="px-6 py-2 border border-border text-foreground text-sm font-semibold uppercase tracking-wider hover:bg-white/5 transition-colors">Cancel</button>
              <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-6 py-2 bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50">
                Save
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
