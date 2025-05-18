import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Star,
  MapPin,
  Phone,
  Calendar,
  ImageIcon,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { vendorService, bookingService, reviewService } from "@/services/api";

function FindVendors() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('asc');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });

  // Fetch vendors on component mount
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        // Get sorted vendors from backend
        const response = await vendorService.getVendorsSortedByPrice(sortOrder === 'asc');
        let vendorsData = response.data;

        // Filter for approved vendors only
        vendorsData = vendorsData.filter(vendor => vendor.status === "APPROVED");

        // Process the vendors first before fetching images
        const processedVendors = await Promise.all(
          vendorsData.map(async (vendor) => {
            // Fetch reviews for this vendor
            let avgRating = 0;
            let reviewCount = 0;
            let reviews = [];
            try {
              reviews = (await reviewService.getReviewsByVendorId(vendor.id)) || [];
              vendor.reviews = reviews;
              if (reviews.length > 0) {
                const totalRating = reviews.reduce(
                  (sum, review) => sum + review.rating,
                  0
                );
                avgRating = totalRating / reviews.length;
                reviewCount = reviews.length;
              }
            } catch (error) {
              console.error(`Failed to fetch reviews for vendor ${vendor.id}:`, error);
            }

            return {
              ...vendor,
              type: vendor.vendorType || "Unknown Type",
              minPrice: vendor.basePrice || 0,
              maxPrice: vendor.basePrice || 0,
              avgRating,
              reviewCount,
              reviews,
              portfolioImages: vendor.imageUrls || [],
            };
          })
        );

        // Filter by price range
        const filteredVendors = processedVendors.filter(vendor => {
          const price = vendor.basePrice || 0;
          return price >= priceRange.min && price <= priceRange.max;
        });

        setVendors(filteredVendors);
      } catch (error) {
        console.error("Error in fetchVendors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, [sortOrder, priceRange]); // Re-fetch when sort order or price range changes

  const bookVendor = async (vendorId) => {
    // First, get vendor details to include in booking
    let vendorDetails = {};
    try {
      const vendorResponse = await vendorService.getVendorById(vendorId);
      vendorDetails = vendorResponse.data || {};
    } catch (error) {
      console.error("Error fetching vendor details for booking:", error);
      const vendor = vendors.find((v) => v.id === vendorId) || {};
      vendorDetails = vendor;
    }

    // Get user data from localStorage
    let userStr = localStorage.getItem("user");
    if (!userStr) {
      const currentUserStr = localStorage.getItem("currentUser");
      if (currentUserStr) {
        userStr = currentUserStr;
      }
    }

    if (!userStr) {
      alert("You must be logged in to book a vendor");
      return;
    }

    const user = JSON.parse(userStr);

    if (!user.id) {
      alert("User information is incomplete. Please log in again.");
      return;
    }

    // Get vendor pricing information
    let packagePrice = 0;
    let packageId = "";
    let packageName = "";

    if (
      vendorDetails.servicePackages &&
      vendorDetails.servicePackages.length > 0
    ) {
      const selectedPackage = vendorDetails.servicePackages[0];
      packagePrice = selectedPackage.price || 1000;
      packageId = selectedPackage.id || `package-${vendorId}-1`;
      packageName = selectedPackage.name || "Standard Package";
    } else {
      packagePrice = vendorDetails.minPrice || 1000;
      packageId = `package-${vendorId}-default`;
      packageName = "Standard Package";
    }

    const timestamp = Date.now();
    const bookingId = `booking-${timestamp}`;

    const newBooking = {
      id: bookingId,
      bookingId: bookingId,
      vendorId: vendorId,
      coupleId: user.id,
      weddingId: user.weddingId || null,
      serviceId: packageId,
      packageName: packageName,
      packagePrice: packagePrice,
      date: new Date().toISOString().split("T")[0],
      time: "10:00",
      status: "REQUESTED",
      totalCost: packagePrice,
      coupleNames: user.name || "Couple",
      vendorName: vendorDetails.name || "Vendor",
      notes: `Booking request for ${packageName} package`,
      createdAt: new Date().toISOString(),
    };

    try {
      if (
        !newBooking.vendorId ||
        !newBooking.coupleId ||
        !newBooking.bookingId
      ) {
        console.error("Booking validation failed - missing required fields:", {
          vendorId: newBooking.vendorId,
          coupleId: newBooking.coupleId,
          bookingId: newBooking.bookingId,
        });
        alert("Cannot create booking: Missing required information");
        return;
      }

      const backendResponse = await bookingService.createBooking(newBooking);
      console.log(
        "Booking created successfully:",
        backendResponse.data || newBooking
      );

      alert(
        "Booking request sent successfully! Check your bookings page for status."
      );
      navigate("/dashboard/couple/bookings");
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("There was an error creating your booking. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="py-10 text-center">Loading vendors...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Add sorting and filtering controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="w-4 h-4" />
            Sort by Price {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="minPrice">Min Price (LKR):</Label>
            <Input
              id="minPrice"
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
              className="w-24"
              min="0"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="maxPrice">Max Price (LKR):</Label>
            <Input
              id="maxPrice"
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
              className="w-24"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="overflow-hidden">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">
                  {vendor.name}
                </CardTitle>
                <Badge variant="secondary" className="font-medium">
                  {vendor.type}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-medium">
                    {vendor.avgRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  ({vendor.reviewCount} reviews)
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Image Gallery */}
              <div className="aspect-[16/9] relative rounded-md overflow-hidden bg-muted">
                {vendor.portfolioImages && vendor.portfolioImages.length > 0 ? (
                  <Carousel className="w-full h-full">
                    <CarouselContent>
                      {vendor.portfolioImages.map((image, index) => (
                        <CarouselItem key={index}>
                          <img
                            src={image}
                            alt={`${vendor.name}'s portfolio ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-3" />
                    <CarouselNext className="-right-3" />
                  </Carousel>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Vendor Details */}
              <div className="grid grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{vendor.address || "Location not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{vendor.phone || "Contact not available"}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">
                    Starting from
                  </span>
                  <div className="text-lg font-bold">
                    LKR {(vendor.basePrice || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center pt-4 border-t">
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">
                  Starting from
                </span>
                <div className="text-lg font-bold">
                  LKR {(vendor.basePrice || 0).toLocaleString()}
                </div>
              </div>

              <Dialog
                open={openDialog && selectedVendor?.id === vendor.id}
                onOpenChange={(open) => {
                  setOpenDialog(open);
                  if (!open) setSelectedVendor(null);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedVendor(vendor)}
                  >
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[850px]">
                  <DialogHeader>
                    <DialogTitle> {selectedVendor?.name}</DialogTitle>
                    <DialogDescription>
                      {selectedVendor?.type}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-center gap-10 mb-6">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-56 h-40 bg-blue-200 rounded-2xl border-2 border-blue-400 flex items-center justify-center overflow-hidden"
                      >
                        {selectedVendor?.portfolioImages?.[i] ? (
                          <img
                            src={selectedVendor.portfolioImages[i]}
                            alt={`${selectedVendor.name} portfolio ${i + 1}`}
                            className="w-full h-full object-cover rounded-2xl"
                          />
                        ) : (
                          <span className="text-blue-400 text-4xl">+</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">Reviews</h3>
                    {selectedVendor?.reviews?.length > 0 ? (
                      <div className="max-h-80 overflow-y-auto pr-2">
                        {selectedVendor.reviews.map((review, idx) => (
                          <div
                            key={idx}
                            className="border rounded-lg p-4 bg-muted/30 mb-3 last:mb-0 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">
                                {review.coupleName || "Anonymous"}
                              </span>
                              <div className="flex items-center text-yellow-500">
                                <Star className="w-4 h-4 mr-1" />
                                <span>{review.rating}</span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {review.reviewDate
                                ? new Date(
                                    review.reviewDate
                                  ).toLocaleDateString()
                                : ""}
                            </p>
                            <p className="text-sm leading-relaxed mt-2 line-clamp-3">
                              {review.comment}
                            </p>
                            {review.comment.length > 150 && (
                              <button className="text-xs text-blue-500 mt-1 hover:underline">
                                Read more
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No reviews yet.</p>
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      onClick={() => {
                        setOpenDialog(false);
                        bookVendor(selectedVendor.id);
                      }}
                    >
                      Book This Vendor
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default FindVendors;
