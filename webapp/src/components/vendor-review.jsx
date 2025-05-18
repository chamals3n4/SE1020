import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { reviewService } from "@/services/api";

export function VendorReview({ review, onSubmit, mode = "display" }) {
  const [rating, setRating] = useState(review?.rating || 0);
  const [comment, setComment] = useState(review?.comment || "");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    setIsSubmitting(true);
    try {
      // Get the current user
      const userStr = localStorage.getItem('currentUser');
      const user = userStr ? JSON.parse(userStr) : {};
      if (!userStr || !user.id) {
        alert('Please log in to submit a review');
        setIsSubmitting(false);
        return;
      }
      // Validate required vendor ID
      if (!review?.vendorId) {
        console.error('Vendor ID is required for reviews');
        alert('Unable to submit review: missing vendor information');
        setIsSubmitting(false);
        return;
      }
      // Create review data
      const reviewData = {
        rating: rating,
        comment: comment
      };
      // Call the parent's onSubmit callback
      if (onSubmit) {
        await onSubmit(reviewData);
        // Reset form
        setIsOpen(false);
        setRating(0);
        setComment('');
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      setIsSubmitting(false);
      alert('Failed to submit review. Please try again.');
    }
  };

  const StarRating = ({ value, onChange, readonly }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${readonly ? "" : "cursor-pointer"} ${
              star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => !readonly && onChange && onChange(star)}
          />
        ))}
      </div>
    );
  };

  if (mode === "display" && review) {
    return (
      <div className="border rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start mb-2">
          <StarRating value={review.rating} readonly={true} />
          <span className="text-sm text-gray-400">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm text-gray-600">{review.comment}</p>
        {review.reviewerName && (
          <p className="mt-2 text-xs text-gray-400">- {review.reviewerName}</p>
        )}
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Write a Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Write a Review</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Review</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review here..."
              className="min-h-[100px]"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Submit Review
          </Button>
        </form>
      </DialogContent>
      <DialogFooter>
        <Button type="submit" disabled={rating === 0 || isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default VendorReview;
