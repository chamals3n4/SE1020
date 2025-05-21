import { useState, useEffect } from "react";
import { Star, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { reviewService, vendorService } from "@/services/api";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [deletingReview, setDeletingReview] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    rating: "",
    comment: "",
  });

  // Get current user information from localStorage
  const userStr = localStorage.getItem("currentUser");
  const user = userStr ? JSON.parse(userStr) : {};

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    if (!user || !user.id) {
      setReviews([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await reviewService.getAllReviews();
      if (response.data && Array.isArray(response.data)) {
        // Filter reviews for this couple
        const coupleReviews = response.data.filter(
          (review) => review.coupleId === user.id
        );
        // Fetch vendor details for each review
        const reviewsWithVendor = await Promise.all(
          coupleReviews.map(async (review) => {
            try {
              const vendorRes = await vendorService.getVendorById(review.vendorId);
              return {
                ...review,
                vendorName: vendorRes.data?.name || "Unknown Vendor",
                vendorType: vendorRes.data?.vendorType || "Vendor",
              };
            } catch (error) {
              console.error("Error fetching vendor details:", error);
              return {
                ...review,
                vendorName: "Unknown Vendor",
                vendorType: "Vendor",
              };
            }
          })
        );
        setReviews(reviewsWithVendor);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setEditForm({
      rating: review.rating.toString(),
      comment: review.comment,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (review) => {
    setDeletingReview(review);
    setDeleteDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingReview) return;

    try {
      const updatedReview = {
        ...editingReview,
        rating: parseInt(editForm.rating),
        comment: editForm.comment,
      };

      await reviewService.updateReview(editingReview.reviewId, updatedReview);
      await fetchReviews(); // Refresh the reviews list
      setEditDialogOpen(false);
      setEditingReview(null);
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Failed to update review. Please try again.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingReview) return;

    try {
      await reviewService.deleteReview(deletingReview.reviewId);
      await fetchReviews(); // Refresh the reviews list
      setDeleteDialogOpen(false);
      setDeletingReview(null);
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="py-10 text-center">Loading reviews...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Reviews</h1>

      {reviews.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          You haven't written any reviews yet.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.reviewId}>
                <TableCell className="font-medium">
                  {review.vendorName}
                </TableCell>
                <TableCell>{review.vendorType}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {review.rating}
                    <Star className="h-4 w-4 ml-1 text-yellow-400" />
                  </div>
                </TableCell>
                <TableCell className="max-w-md truncate">
                  {review.comment}
                </TableCell>
                <TableCell>
                  {review.reviewDate
                    ? format(new Date(review.reviewDate), "MMM d, yyyy")
                    : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(review)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(review)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Edit Review Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={editForm.rating}
                onChange={(e) =>
                  setEditForm({ ...editForm, rating: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={editForm.comment}
                onChange={(e) =>
                  setEditForm({ ...editForm, comment: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Review Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Reviews; 