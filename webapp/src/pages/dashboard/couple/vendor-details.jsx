import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Clock,
  ArrowLeft,
  Heart,
  Package,
  CheckCircle,
  CreditCard,
  ImageIcon,
} from "lucide-react";
import VendorReview from "@/components/vendor-review";
import { vendorService, reviewService, bookingService } from "@/services/api";
import { format } from "date-fns";

function VendorDetails() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingDate, setBookingDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [bookingTime, setBookingTime] = useState("10:00");

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        // Fetch vendor details
        const response = await vendorService.getVendorById(vendorId);
        setVendor(response.data);

        // Fetch vendor's service packages
        try {
          const packagesResponse = await vendorService.getVendorPackages(
            vendorId
          );
          setPackages(packagesResponse.data || []);
        } catch (packagesError) {
          console.error("Error fetching vendor packages:", packagesError);
          setPackages([]);
        }

        // Fetch vendor reviews
        try {
          const reviewsResponse = await reviewService.getReviewsByVendorId(
            vendorId
          );
          setReviews(reviewsResponse.data || []);
        } catch (reviewsError) {
          console.error("Error fetching vendor reviews:", reviewsError);
          setReviews([]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching vendor details:", error);
        setVendor(null);
        setIsLoading(false);
        toast("Error", {
          description:
            "Unable to fetch vendor details. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchVendorDetails();
  }, [vendorId]);

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
  };

  const createBooking = async () => {
    // Create a simpler booking object that matches backend expected format
    const newBooking = {
      id: `booking-${Date.now()}`, // Generate a unique ID for file-based storage
      vendorId: vendor.id,
      coupleId: currentUser.id || "couple-123", // Use authenticated user ID if available
      date: bookingDate,
      time: bookingTime,
      status: "pending",
      notes: `Booking for ${
        selectedPackage ? selectedPackage.name : "services"
      } at ${bookingTime} on ${bookingDate}`,
    };

    try {
      // Save to backend API - simplify the call to match backend expectations
      try {
        // Make a direct call to the bookingService
        const backendResponse = await bookingService.createBooking(newBooking);
        console.log(
          "Booking created successfully via backend API:",
          backendResponse.data || newBooking
        );
      } catch (apiError) {
        console.error("API booking creation failed:", apiError);
        alert(
          "Failed to create booking. Please make sure the backend server is running."
        );
        return; // Stop execution if API call fails
      }

      // Show success message
      alert(
        "Booking request sent successfully! Check your bookings page for status."
      );

      // Navigate to bookings page
      navigate("/dashboard/couple/bookings");
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("There was an error creating your booking. Please try again.");
    }
  };

  const handleReviewSubmitted = (newReview) => {
    // Add the new review to the reviews list
    setReviews([newReview, ...reviews]);

    // Update vendor average rating
    if (vendor) {
      const totalRatings =
        reviews.reduce((sum, review) => sum + review.rating, 0) +
        newReview.rating;
      const newAvgRating = totalRatings / (reviews.length + 1);
      setVendor({ ...vendor, avgRating: newAvgRating });
    }
  };

  const renderRatingStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      ));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Vendor not found</h2>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/dashboard/couple/vendors")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Vendors
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/dashboard/couple/vendors")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Vendors
        </Button>

        <div className="flex items-center gap-2">
          <VendorReview
            vendorId={vendor.id}
            onReviewSubmitted={handleReviewSubmitted}
          />

          <Button variant="outline" size="sm">
            <Heart className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <div className="relative aspect-video bg-muted">
              {vendor.featuredImage ? (
                <img
                  src={vendor.featuredImage}
                  alt={vendor.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <ImageIcon className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              <Badge className="absolute top-3 right-3" variant="secondary">
                {vendor.type ? vendor.type.replace("_", " ") : "Vendor"}
              </Badge>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{vendor.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {vendor.description}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    {renderRatingStars(vendor.avgRating || 0)}
                    <span className="ml-2 text-sm font-medium">
                      {vendor.avgRating?.toFixed(1) || "New"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {reviews.length} reviews
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    {vendor.address || `${vendor.city}, ${vendor.state}`}
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    {vendor.phone || "Not provided"}
                  </span>
                </div>
                {vendor.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{vendor.email}</span>
                  </div>
                )}
                {vendor.website && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a
                      href={`https://${vendor.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {vendor.website}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="packages">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="packages">Packages</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            </TabsList>

            <TabsContent value="packages" className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Available Packages</h3>
              {packages.length === 0 ? (
                <p className="text-muted-foreground">
                  No packages available. Contact the vendor for custom quotes.
                </p>
              ) : (
                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <Card
                      key={pkg.id}
                      className={`overflow-hidden transition-colors ${
                        selectedPackage?.id === pkg.id ? "border-primary" : ""
                      }`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle>{pkg.name}</CardTitle>
                          <Badge variant="outline">
                            ${pkg.price.toLocaleString()}
                          </Badge>
                        </div>
                        <CardDescription>{pkg.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <ul className="space-y-1">
                          {pkg.items?.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant={
                            selectedPackage?.id === pkg.id
                              ? "default"
                              : "outline"
                          }
                          className="w-full"
                          onClick={() => handlePackageSelect(pkg)}
                        >
                          {selectedPackage?.id === pkg.id
                            ? "Selected"
                            : "Select Package"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Customer Reviews</h3>
                <VendorReview
                  vendorId={vendor.id}
                  onReviewSubmitted={handleReviewSubmitted}
                />
              </div>

              {reviews.length === 0 ? (
                <p className="text-muted-foreground">
                  No reviews yet. Be the first to review this vendor!
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">
                            {review.reviewerName}
                          </CardTitle>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center pt-1">
                          {renderRatingStars(review.rating)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="portfolio" className="pt-4">
              <div className="text-center py-6">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">Portfolio</h3>
                <p className="text-muted-foreground">
                  This vendor hasn't uploaded any portfolio items yet.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Book This Vendor</CardTitle>
              <CardDescription>
                Select a package and time to request a booking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="booking-date">Booking Date</Label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    id="booking-date"
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={format(new Date(), "yyyy-MM-dd")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-time">Booking Time</Label>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    id="booking-time"
                    type="time"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2">
                <Card className="bg-muted">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-0">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Vendor:</span>
                        <span>{vendor.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Service:</span>
                        <span>
                          {selectedPackage
                            ? selectedPackage.name
                            : "No package selected"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date:</span>
                        <span>
                          {format(new Date(bookingDate), "MMMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Time:</span>
                        <span>{bookingTime}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <div className="flex justify-between items-center w-full">
                      <div className="text-lg font-medium">
                        $
                        {selectedPackage
                          ? selectedPackage.price.toLocaleString()
                          : "0"}
                      </div>
                      <Button
                        onClick={createBooking}
                        disabled={!selectedPackage}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default VendorDetails;
